export const MAIN_DOMAIN =
  process.env.NEXT_PUBLIC_MAIN_DOMAIN || "quanlythoigian.io.vn";
export const API_DOMAIN =
  process.env.NEXT_PUBLIC_API_DOMAIN || "tracktrack.pages.dev";

export const isMainDomain = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname === MAIN_DOMAIN;
};

export const isApiDomain = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname === API_DOMAIN;
};

export const getApiUrl = (path: string) => {
  return `https://${API_DOMAIN}${path}`;
};

export const getMainUrl = (path: string) => {
  return `https://${MAIN_DOMAIN}${path}`;
};
