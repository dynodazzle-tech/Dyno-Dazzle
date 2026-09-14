import fs from 'fs';
import path from 'path';

/**
 * Returns a safely writable data directory.
 * In serverless environments like Netlify Functions or AWS Lambda,
 * the application directory is read-only, so /tmp must be used.
 */
export function getDataDir(): string {
  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL
  );

  if (isServerless) {
    const tmpDir = path.join('/tmp', 'dynodazzle-data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
        // Attempt to copy initial bundled data files if present
        const bundledDir = path.join(process.cwd(), 'data');
        if (fs.existsSync(bundledDir)) {
          const files = fs.readdirSync(bundledDir);
          for (const file of files) {
            try {
              fs.copyFileSync(path.join(bundledDir, file), path.join(tmpDir, file));
            } catch {
              // Ignore copy error
            }
          }
        }
      } catch (err) {
        console.warn('[DataDir] Failed to setup tmp directory in serverless:', err);
      }
    }
    return tmpDir;
  }

  const localDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {
      const fallback = path.join('/tmp', 'dynodazzle-data');
      if (!fs.existsSync(fallback)) {
        try {
          fs.mkdirSync(fallback, { recursive: true });
        } catch {
          // Ignore
        }
      }
      return fallback;
    }
  }
  return localDir;
}
