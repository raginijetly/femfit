import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "@/pages/auth-page-tabs";
import HomePage from "@/pages/home-page";
import OnboardingPage from "@/pages/onboarding-page";
import NotFound from "@/pages/not-found";
import ResetPasswordPage from "@/pages/reset-password-page";

// Placeholder Pages
import SymptomsPage from "@/pages/symptoms-page";
import WorkoutPage from "@/pages/workout-page";
import NutritionPage from "@/pages/nutrition-page";
import InfoHubPage from "@/pages/info-hub-page";
// import { useState, useEffect } from "react";
import AppFooter from "./components/AppFooter";
import Header from "./components/Header";
import UpdatePage from "./pages/update-profile";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  // const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const location = useLocation();

  // Determine visibility of header and footer
  const headerFooterVisible =
    location.pathname !== "/auth" &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/reset-password";

  // useEffect(() => {
  //   const handleResize = () => setViewportWidth(window.innerWidth);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <>
      {headerFooterVisible && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/info-hub" element={<InfoHubPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* {viewportWidth <= 768 && headerFooterVisible && <AppFooter />} */}
      {headerFooterVisible && <AppFooter />}
    </>
  );
}

export default App;
