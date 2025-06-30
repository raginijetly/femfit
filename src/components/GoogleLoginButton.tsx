import React, { useEffect } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleLoginButtonProps {
  onToken: (idToken: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onToken }) => {
  useEffect(() => {
    if (window.google && window.google.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id:
          "124150586808-7c3dr1t7413evrufuvbpm0tpsavbideh.apps.googleusercontent.com",
        callback: (response: any) => {
          onToken(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn") as HTMLElement,
        { theme: "outline", size: "large" },
      );
    }
  }, [onToken]);

  return (
    <div
      id="google-signin-btn"
      className="text-brand-dark overflow-hidden rounded-xl"
    ></div>
  );
};

export default GoogleLoginButton;
