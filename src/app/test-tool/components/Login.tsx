import { IS_PRODUCTION } from "@/app/constants";
import { useState } from "react";

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const FAKE_PASSWORD = IS_PRODUCTION ? "Xx" : "";
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [typedPassword, setTypedPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const onSubmit = () => {
    setValidated(true);
    if (typedPassword === FAKE_PASSWORD) {
      onLogin();
    } else {
      setWrongPassword(true);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container box">
        <h1>Maturahilfe.com</h1>
        <p className="subtitle">Dein KI-gestützter Feedback-Partner.</p>
        <p className="coming-soon">Coming Soon...</p>
        <div id="login-form">
          <div className="input-wrapper">
            <input
              type={passwordType}
              id="access-code"
              placeholder="Zugangscode eingeben"
              value={typedPassword}
              onChange={(e) => setTypedPassword(e.target.value)}
            />
            <span id="toggle-password" onClick={onTogglePassword}>
              {showPassword ? (
                <svg
                  id="eye-closed"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"></path>
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"></path>
                </svg>
              ) : (
                <svg
                  id="eye-open"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path>
                </svg>
              )}
            </span>
          </div>
          <button type="button" onClick={onSubmit}>
            App starten
          </button>
          {validated && wrongPassword && (
            <p id="error-message">Falscher Code. Bitte versuche es erneut.</p>
          )}
        </div>
      </div>
    </div>
  );
};
