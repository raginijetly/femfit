import { Button } from "@/components/ui/button";
import { Heart, Dumbbell, Utensils, BookOpen, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AppFooter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer>
      {/* Bottom Navigation Bar - Always visible */}
      <div className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-between border-t border-gray-200 bg-white px-3 py-3">
        {/* Home */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/home" || location.pathname === "/update"
              ? "font-medium text-purple-600"
              : "text-gray-500"
          } flex h-auto w-1/5 flex-col items-center p-1 hover:bg-transparent`}
          onClick={() => navigate("/home")}
        >
          <div className="flex flex-col items-center justify-center">
            <Home className="h-6 w-6" />
            <span
              className={`mt-1 text-xs ${(location.pathname === "/home" || location.pathname === "/update") && "font-bold"}`}
            >
              Home
            </span>
          </div>
        </Button>

        {/* Log Symptoms */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/symptoms"
              ? "font-medium text-purple-600"
              : "text-gray-500"
          } flex h-auto w-1/5 flex-col items-center p-1 hover:bg-transparent`}
          onClick={() => navigate("/symptoms")}
        >
          <div className="flex flex-col items-center justify-center">
            <Heart className="h-6 w-6" />
            <span
              className={`mt-1 text-xs ${location.pathname === "/symptoms" && "font-bold"}`}
            >
              Log
            </span>
          </div>
        </Button>

        {/* Workout */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/workout"
              ? "font-medium text-purple-600"
              : "text-gray-500"
          } flex h-auto w-1/5 flex-col items-center p-1 hover:bg-transparent`}
          onClick={() => navigate("/workout")}
        >
          <div className="flex flex-col items-center justify-center">
            <Dumbbell className="h-6 w-6" />
            <span
              className={`mt-1 text-xs ${location.pathname === "/workout" && "font-bold"}`}
            >
              Workout
            </span>
          </div>
        </Button>

        {/* Nutrition */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/nutrition"
              ? "font-medium text-purple-600"
              : "text-gray-500"
          } flex h-auto w-1/5 flex-col items-center p-1 hover:bg-transparent`}
          onClick={() => navigate("/nutrition")}
        >
          <div className="flex flex-col items-center justify-center">
            <Utensils className="h-6 w-6" />
            <span
              className={`mt-1 text-xs ${location.pathname === "/nutrition" && "font-bold"}`}
            >
              Nutrition
            </span>
          </div>
        </Button>

        {/* Info Hub */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/info-hub"
              ? "font-medium text-purple-600"
              : "text-gray-500"
          } flex h-auto w-1/5 flex-col items-center p-1 hover:bg-transparent`}
          onClick={() => navigate("/info-hub")}
        >
          <div className="flex flex-col items-center justify-center">
            <BookOpen className="h-6 w-6" />
            <span
              className={`mt-1 text-xs ${location.pathname === "/info-hub" && "font-bold"}`}
            >
              Info
            </span>
          </div>
        </Button>
      </div>
    </footer>
  );
};

export default AppFooter;
