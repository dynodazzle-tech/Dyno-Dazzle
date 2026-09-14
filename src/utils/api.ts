/**
 * Unified API Client for DynoDazzle with Netlify & Cloud Run cross-origin support.
 */

// Deployed live backend URL on Google Cloud Run (always available for fallback)
export const CLOUD_RUN_BACKEND_URL = 'https://ais-pre-rutbzyhwvqb3tney7cshne-16516054101.asia-east1.run.app';

/**
 * Resolves the active API base URL.
 * Order of precedence:
 * 1. User/Admin override in localStorage (dyno_api_base_url)
 * 2. Environment variable VITE_API_URL / VITE_BACKEND_URL
 * 3. Empty string "" (relative path, standard for dev and Netlify with redirects/functions)
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  // 1. Check localStorage override
  try {
    const custom = localStorage.getItem('dyno_api_base_url');
    if (custom && custom.trim() !== '') {
      return custom.trim().replace(/\/+$/, '');
    }
  } catch {
    // Ignore localStorage errors
  }

  // 2. Check Vite environment variable
  const metaEnv = (import.meta as any).env || {};
  const envUrl = (metaEnv.VITE_API_URL || metaEnv.VITE_BACKEND_URL || '') as string;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  return '';
}

export function setApiBaseUrl(url: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!url || url.trim() === '') {
      localStorage.removeItem('dyno_api_base_url');
    } else {
      localStorage.setItem('dyno_api_base_url', url.trim().replace(/\/+$/, ''));
    }
  } catch {
    // Ignore
  }
}

/**
 * Builds a full URL for an API endpoint
 */
export function buildApiUrl(path: string, baseUrlOverride?: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = baseUrlOverride !== undefined ? baseUrlOverride.replace(/\/+$/, '') : getApiBaseUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
}

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
  baseUrlOverride?: string;
  skipAutoFallback?: boolean;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  rawText?: string;
  isHtmlError?: boolean;
  usedFallback?: boolean;
}

/**
 * Resilient fetch wrapper that:
 * - Automatically prefixes the active API base URL
 * - Detects Netlify 404/SPA HTML responses and explains the cause clearly
 * - Supports automatic fallback to live Cloud Run backend if Netlify static hosting lacks functions
 * - Supports automatic timeout
 * - Handles CORS headers
 */
export async function apiFetch<T = any>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { timeoutMs = 15000, baseUrlOverride, skipAutoFallback = false, headers = {}, ...rest } = options;
  const fullUrl = buildApiUrl(path, baseUrlOverride);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(fullUrl, {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // Check if the server returned HTML instead of JSON
    // (Common on Netlify when /api/* hits static 404 or index.html SPA fallback)
    const isHtml =
      contentType.includes('text/html') ||
      text.trim().startsWith('<!DOCTYPE') ||
      text.trim().startsWith('<html');

    if (isHtml || (!res.ok && res.status === 404)) {
      // Auto-fallback check: If on Netlify or external static host and relative path failed
      const currentBase = baseUrlOverride !== undefined ? baseUrlOverride : getApiBaseUrl();
      if (
        !skipAutoFallback &&
        !currentBase &&
        typeof window !== 'undefined' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
      ) {
        console.warn(`[API] Endpoint ${fullUrl} returned HTML/404 on external host. Retrying with live Cloud Run backend...`);
        try {
          const fallbackRes = await apiFetch<T>(path, {
            ...options,
            baseUrlOverride: CLOUD_RUN_BACKEND_URL,
            skipAutoFallback: true,
          });

          if (fallbackRes.ok) {
            // Auto-persist backend preference for current browser session
            setApiBaseUrl(CLOUD_RUN_BACKEND_URL);
            return {
              ...fallbackRes,
              usedFallback: true,
            };
          }
        } catch (fbErr) {
          console.error('[API] Cloud Run fallback attempt failed:', fbErr);
        }
      }

      if (isHtml) {
        return {
          ok: false,
          status: res.status,
          data: {
            success: false,
            message:
              'Netlify returned an HTML page instead of API JSON. If Netlify Functions are still building or unconfigured, click "Connect to Live Backend" below.',
          } as any,
          rawText: text,
          isHtmlError: true,
        };
      }
    }

    let parsed: any;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { success: false, message: 'Invalid server response format.' };
    }

    return {
      ok: res.ok,
      status: res.status,
      data: parsed,
      rawText: text,
      isHtmlError: false,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If fetch failed completely (network error / blocked) and we haven't tried Cloud Run backend yet
    const currentBase = baseUrlOverride !== undefined ? baseUrlOverride : getApiBaseUrl();
    if (
      !skipAutoFallback &&
      !currentBase &&
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost'
    ) {
      console.warn('[API] Primary fetch failed. Retrying with live Cloud Run backend...');
      try {
        const fallbackRes = await apiFetch<T>(path, {
          ...options,
          baseUrlOverride: CLOUD_RUN_BACKEND_URL,
          skipAutoFallback: true,
        });

        if (fallbackRes.ok) {
          setApiBaseUrl(CLOUD_RUN_BACKEND_URL);
          return {
            ...fallbackRes,
            usedFallback: true,
          };
        }
      } catch {
        // Fallback also failed
      }
    }

    if (err.name === 'AbortError') {
      return {
        ok: false,
        status: 408,
        data: {
          success: false,
          message: 'Connection timed out. The server took too long to respond.',
        } as any,
      };
    }

    return {
      ok: false,
      status: 0,
      data: {
        success: false,
        message:
          'Connection error. If running on Netlify without backend functions, please configure your backend URL or click "Connect to Live Backend".',
      } as any,
    };
  }
}

/**
 * Tests connection to the API backend
 */
export async function testBackendConnection(customUrl?: string): Promise<{
  connected: boolean;
  message: string;
  endpoint: string;
  platform?: string;
}> {
  const targetUrl = customUrl !== undefined ? customUrl : getApiBaseUrl();
  const testPath = '/api/health';
  const fullUrl = buildApiUrl(testPath, targetUrl);

  try {
    const res = await apiFetch<{ status?: string; service?: string; platform?: string; message?: string }>(testPath, {
      baseUrlOverride: targetUrl,
      timeoutMs: 8000,
      skipAutoFallback: true,
    });

    if (res.ok && res.data?.status === 'ok') {
      return {
        connected: true,
        message: `Connected successfully (${res.data.platform || 'online'})`,
        endpoint: fullUrl,
        platform: res.data.platform,
      };
    }

    if (res.isHtmlError) {
      return {
        connected: false,
        message: 'Endpoint returned HTML instead of API JSON (Netlify functions or proxy not active).',
        endpoint: fullUrl,
      };
    }

    return {
      connected: false,
      message: res.data?.message || `Server returned HTTP status ${res.status}`,
      endpoint: fullUrl,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Failed to reach API endpoint',
      endpoint: fullUrl,
    };
  }
}
