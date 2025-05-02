import { useState } from "react";
import LoginPage from "./LoginPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import SignUpPage from "./SignUpPage";

// Define the possible auth views
type AuthView = "login" | "forgotPassword" | "signup";

interface AuthContainerProps {
  onLogin: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onLogin }) => {
  // State to track which authentication view to display
  const [currentView, setCurrentView] = useState<AuthView>("login");

  // Handler for successful login
  const handleLogin = () => {
    // Call the onLogin callback from parent component
    onLogin();
  };

  // Handler for navigation to forgot password page
  const handleForgotPassword = () => {
    setCurrentView("forgotPassword");
  };

  // Handler for navigation to signup page
  const handleSignUp = () => {
    setCurrentView("signup");
  };

  // Handler for back navigation to login page
  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  // Handler for successful signup
  const handleSignUpComplete = () => {
    // After signup, we usually want to either automatically log the user in
    // or redirect them to the login page with a success message
    setCurrentView("login");
    // You could set a success message here to show on the login screen
    alert("Account created successfully! You can now log in.");
  };

  // Render the appropriate component based on current view
  return (
    <>
      {currentView === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
        />
      )}
      
      {currentView === "forgotPassword" && (
        <ForgotPasswordPage onBack={handleBackToLogin} />
      )}
      
      {currentView === "signup" && (
        <SignUpPage onBack={handleBackToLogin} onSignUp={handleSignUpComplete} />
      )}
    </>
  );
};

export default AuthContainer;