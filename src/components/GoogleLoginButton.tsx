import React, { useEffect } from "react";

// Extend the Window interface for our global callback
declare global {
  interface Window {
    google?: any; // Google Identity Services object
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

interface GoogleLoginButtonProps {
  /** Callback with the Google ID token (JWT) */
  onToken: (idToken: string) => void;
  /** Override client id (otherwise uses VITE_GOOGLE_CLIENT_ID env or fallback) */
  clientId?: string;
  /** Login / redirect URI for one-tap or credential mode (defaults to current origin + /login) */
  loginUri?: string;
  /** Disable auto prompt explicitly (default false) */
  autoPrompt?: boolean;
  /** Width of the rendered button (string or number) */
  width?: string | number;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onToken,
  clientId,
  loginUri,
  autoPrompt = false,
  width = 320,
}) => {
  const resolvedClientId =
    clientId || (import.meta.env.VITE_GOOGLE_CLIENT_ID as string);
  const resolvedLoginUri =
    loginUri ||
    (import.meta.env.VITE_GOOGLE_LOGIN_URI as string) ||
    `${window.location.origin}/login`;

  useEffect(() => {
    // Provide a stable global callback for the data-callback attribute
    window.handleGoogleCredential = (response: { credential: string }) => {
      if (response?.credential) {
        onToken(response.credential);
      }
    };

    return () => {
      // Cleanup to avoid leaking references if component unmounts
      delete window.handleGoogleCredential;
    };
  }, [onToken]);

  /**
   * We use the declarative markup approach recommended by
   * Google Identity Services:
   * - <div id="g_id_onload" ...> acts like google.accounts.id.initialize
   * - <div class="g_id_signin" ...> renders the button automatically
   * The external script (loaded in index.html) detects these data-* attributes.
   */
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Google Identity onload config */}
      <div
        id="g_id_onload"
        data-client_id={resolvedClientId}
        data-login_uri={resolvedLoginUri}
        data-auto_prompt={autoPrompt ? "true" : "false"}
        data-callback="handleGoogleCredential"
        // Helpful optional attributes (commented for future use):
        // data-ux_mode="popup"  // or redirect
        // data-context="signin" // or signup / use
        // data-itp_support="true"
      ></div>

      {/* The actual sign-in button */}
      <div
        id="google-signin-btn"
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
        data-width={String(width)}
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default GoogleLoginButton;
