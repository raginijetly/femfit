import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL } from "@/utils/constants";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // No token, user is not logged in - stay on landing page
          return;
        }

        // Token exists, check with backend
        const response = await fetchData(
          "get",
          `${BACKEND_API_URL}/sections/home`,
        );

        if (response.status === 200) {
          // User is authenticated and has valid session
          console.log("User is logged in, redirecting to /home");
          navigate("/home");
        }
        // If response is not 200, user session is invalid - stay on landing page
      } catch (error) {
        // Error checking auth status - likely user is not logged in, stay on landing page
        console.log("User is not logged in, staying on landing page");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="gradient-primary flex min-h-screen items-center justify-center p-5">
      <Card className="mx-auto w-full max-w-md border-0 bg-white py-0 shadow-lg">
        <CardContent className="space-y-6 p-8 text-center">
          {/* FemFit Title */}
          <h1 className="mb-2 text-4xl font-bold text-purple-600">FemFit</h1>

          {/* Subtitle */}
          <p className="text-brand-dark text-sm font-semibold italic">
            Built for Women. {/* <br /> */}
            Backed by Science.
            <br />
            Inspired by You.
          </p>

          {/* Main Description */}
          <p className="text-sm leading-relaxed text-purple-700">
            Get to understand your body better and work with your hormones, not
            against them.
          </p>

          {/* Feature List */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col">
              <div className="flex items-start space-x-3">
                <span className="text-lg text-purple-500">•</span>
                <span className="text-brand-dark text-sm">
                  Daily body insights.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg text-purple-500">•</span>
                <span className="text-brand-dark text-sm">
                  Personalized Workouts.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg text-purple-500">•</span>
                <span className="text-brand-dark text-sm">
                  Tailored nutrition.
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-lg text-purple-500">•</span>
                <span className="text-brand-dark text-sm">
                  And so much more!
                </span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm leading-relaxed text-purple-600 italic">
              You're not "hormonal" - you're hormonally intelligent!
            </p>
          </div>

          {/* Get Started Button */}
          <Button
            onClick={handleGetStarted}
            className="gradient-primary h-12 w-full text-2xl font-medium text-white"
            size="lg"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;
