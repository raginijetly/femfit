import { Button } from "@/components/ui/button";
import { Heart, Dumbbell, Utensils, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const AppFooter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer>
      {/* Bottom Navigation Bar - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center px-3 py-3 z-10">
        {/* Home */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/"
              ? "text-purple-600 font-medium"
              : "text-gray-500"
          } flex flex-col items-center p-1 h-auto w-1/5 hover:bg-transparent`}
          onClick={() => navigate("/")}
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span className="text-[10px] mt-1">Home</span>
          </div>
        </Button>

        {/* Log Symptoms */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/symptoms"
              ? "text-purple-600 font-medium"
              : "text-gray-500"
          } flex flex-col items-center p-1 h-auto w-1/5 hover:bg-transparent`}
          onClick={() => navigate("/symptoms")}
        >
          <div className="flex flex-col items-center justify-center">
            <Heart className="h-6 w-6" />
            <span className="text-[10px] mt-1">Log</span>
          </div>
        </Button>

        {/* Workout */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/workout"
              ? "text-purple-600 font-medium"
              : "text-gray-500"
          } flex flex-col items-center p-1 h-auto w-1/5 hover:bg-transparent`}
          onClick={() => navigate("/workout")}
        >
          <div className="flex flex-col items-center justify-center">
            <Dumbbell className="h-6 w-6" />
            <span className="text-[10px] mt-1">Workout</span>
          </div>
        </Button>

        {/* Nutrition */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/nutrition"
              ? "text-purple-600 font-medium"
              : "text-gray-500"
          } flex flex-col items-center p-1 h-auto w-1/5 hover:bg-transparent`}
          onClick={() => navigate("/nutrition")}
        >
          <div className="flex flex-col items-center justify-center">
            <Utensils className="h-6 w-6" />
            <span className="text-[10px] mt-1">Nutrition</span>
          </div>
        </Button>

        {/* Info Hub */}
        <Button
          variant="link"
          className={`${
            location.pathname === "/info-hub"
              ? "text-purple-600 font-medium"
              : "text-gray-500"
          } flex flex-col items-center p-1 h-auto w-1/5 hover:bg-transparent`}
          onClick={() => navigate("/info-hub")}
        >
          <div className="flex flex-col items-center justify-center">
            <BookOpen className="h-6 w-6" />
            <span className="text-[10px] mt-1">Info</span>
          </div>
        </Button>
      </div>
    </footer>
  );
};

export default AppFooter;
