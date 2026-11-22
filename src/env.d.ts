/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Cloudflare Turnstile sitekey. When empty, the contact form renders no widget. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
