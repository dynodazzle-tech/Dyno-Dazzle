export const SITE_CONFIG = {
  companyName: "DynoDazzle",
  domain: "https://dynodazzle.in",
  displayDomain: "dynodazzle.in",
  email: "dynodazzle@gmail.com",
  whatsappNumber: "917770032149",
  whatsappFormatted: "+91 7770032149",
  defaultWhatsAppMessage: "Hello DynoDazzle, I would like to know more about your services.",
  techClassUrl: "https://techclass.dynodazzle.in",
  tagline: "Technology That Makes Your Business Move.",
  subtagline:
    "From digital marketing and high-performance websites to applications, automation and technical support — DynoDazzle helps businesses turn ideas into powerful digital experiences.",
  trustStatement: "Technology • Digital • Support • Innovation",
  year: 2026,
  analytics: {
    enabled: false,
    id: "",
  },
};

export const getWhatsAppUrl = (customMessage?: string) => {
  const msg = encodeURIComponent(customMessage || SITE_CONFIG.defaultWhatsAppMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${msg}`;
};
