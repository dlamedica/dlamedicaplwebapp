import { useRef, useImperativeHandle, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  darkMode?: boolean;
  onVerify: (token: string | null) => void;
}

export interface ReCaptchaHandle {
  reset: () => void;
  executeAsync: () => Promise<string | null>;
}

const ReCaptcha = forwardRef<ReCaptchaHandle, ReCaptchaProps>(
  ({ darkMode = false, onVerify }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const siteKey = (import.meta as any).env.VITE_RECAPTCHA_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset();
      },
      executeAsync: async () => {
        if (!recaptchaRef.current) return null;
        return await recaptchaRef.current.executeAsync();
      },
    }));

    if (!siteKey) {
      return (
        <div className="text-center text-red-500 text-sm">
          reCAPTCHA nie jest skonfigurowana. Dodaj VITE_RECAPTCHA_SITE_KEY do .env.local
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={onVerify}
          theme={darkMode ? 'dark' : 'light'}
          size="normal"
        />
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;