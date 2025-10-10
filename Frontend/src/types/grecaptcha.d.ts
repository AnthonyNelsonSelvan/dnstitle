declare global {
  interface Window {
    grecaptcha: ReCAPTCHA;
  }

  interface ReCAPTCHA {
    ready: (cb: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  }
}

export {};
