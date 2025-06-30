import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Dumbbell,
  Heart,
  ArrowRight,
  Loader2,
  Moon,
  Activity,
  Sun,
} from "lucide-react";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL, UI_DELAY } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import type { UserInfoType, UserType } from "@/utils/types";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const [cyclePhase, setCyclePhase] = useState<string>("Unknown");
  // State for mood popup
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch Home page data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetchData("get", `${BACKEND_API_URL}/test/home`);
        if (response.status === 200) {
          console.log("Home data fetched successfully:", response);
          // User has not completed onboarding
          if (!response.data.user.completedOnboarding) navigate("/onboarding");
          // User is logged in and has completed onboarding
          setUserDetails(response.data.user);
          setUserInfo(response.data.userInfo);
          setLoading(false);
        } else {
          // User Not logged in
          console.error("User not logged in, redirecting to auth page");
          setLoading(false);
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        // navigate("/auth");
        setLoading(false);
        return;
      }
    };
    const timer = setTimeout(() => {
      fetchHomeData();
    }, UI_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Function to set user details
  const setUserDetails = (userData: any) => {
    setUser({
      id: userData._id,
      fullName: userData.fullName,
      email: userData.email,
      completedOnboarding: userData.completedOnboarding,
      onboardingAnswers: userData.onboardingAnswers,
      dailyMood: userData.dailyMood,
    });
  };

  // Show the mood popup after 5 seconds on the home page
  useEffect(() => {
    if (
      user &&
      user.completedOnboarding &&
      differenceInDays(
        new Date(),
        new Date(user.dailyMood[user.dailyMood.length - 1]?.date),
      )
    ) {
      const timer = setTimeout(() => {
        setShowMoodPopup(true);
      }, 1); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Function to handle mood popup click
  const handleMoodSelect = async (
    mood: "energetic" | "balanced" | "stressed" | "tired",
  ) => {
    setShowMoodPopup(false);
    try {
      const response = await fetchData(
        "put",
        `${BACKEND_API_URL}/users/update-mood`,
        {
          mood: mood,
        },
      );
      if (response.status === 200) {
        console.log("Mood updated successfully:", response.data);
        if (user)
          setUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              dailyMood: response.data,
            };
          });
      } else {
        console.error("Failed to update mood:", response.data);
      }
    } catch (error) {
      console.error("Error updating mood:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetchData("get", `${BACKEND_API_URL}/auth/logout`);
      if (response.status === 200) {
        console.log("Logout successful");
        setUser(null);
        navigate("/auth");
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Get workout recommendations based on cycle phase
  const getWorkoutRecommendations = () => {
    switch (userInfo?.cyclePhase) {
      case "menstruation":
        return [
          "Gentle yoga or stretching",
          "Walking or light cardio",
          "Restorative exercises",
        ];
      case "follicular":
        return [
          "High-intensity interval training",
          "Strength training",
          "Cardio classes",
        ];
      case "ovulation":
        return [
          "Circuit training",
          "Endurance workouts",
          "Group fitness classes",
        ];
      case "luteal":
        return [
          "Moderate strength training",
          "Pilates or barre",
          "Swimming or cycling",
        ];
      default:
        return [
          "Balanced strength and cardio",
          "Flexibility exercises",
          "Rest and recovery as needed",
        ];
    }
  };

  // Get nutrition recommendations based on cycle phase
  const getNutritionRecommendations = () => {
    switch (userInfo?.cyclePhase) {
      case "menstruation":
        return [
          "Iron-rich foods (leafy greens, lentils)",
          "Anti-inflammatory foods (berries, nuts)",
          "Stay hydrated with water and herbal teas",
        ];
      case "follicular":
        return [
          "Complex carbs for energy (oats, brown rice)",
          "Lean proteins (chicken, fish, tofu)",
          "Vitamin B-rich foods (whole grains, eggs)",
        ];
      case "ovulation":
        return [
          "Magnesium-rich foods (dark chocolate, avocados)",
          "Antioxidant-rich foods (colorful fruits and vegetables)",
          "Healthy fats (olive oil, nuts, seeds)",
        ];
      case "luteal":
        return [
          "Calcium-rich foods (dairy or fortified plant milks)",
          "Fiber-rich foods to reduce bloating (beans, vegetables)",
          "Limit caffeine, salt, and sugar",
        ];
      default:
        return [
          "Balanced meals with protein, healthy fats, and complex carbs",
          "Colorful fruits and vegetables",
          "Stay hydrated throughout the day",
        ];
    }
  };

  const workoutRecommendations = getWorkoutRecommendations();
  const nutritionRecommendations = getNutritionRecommendations();

  // Choose color theme based on phase
  const getPhaseColor = () => {
    switch (!!userInfo && userInfo.cyclePhase) {
      case "menstruation":
        return "text-red-600";
      case "follicular":
        return "text-green-600";
      case "ovulation":
        return "text-yellow-600";
      case "luteal":
        return "text-blue-600";
      default:
        return "text-purple-600";
    }
  };

  const getPhaseIcon = () => {
    switch (!!userInfo && userInfo.cyclePhase) {
      case "menstruation":
        return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "follicular":
        return <Activity className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "ovulation":
        return <Sun className={`h-6 w-6 ${getPhaseColor()}`} />;
      case "luteal":
        return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      default:
        return <Calendar className="h-6 w-6 text-purple-600" />;
    }
  };

  // const getPhaseBackgroundColor = () => {
  //   switch (cyclePhase) {
  //     case "Menstruation": return "bg-red-50";
  //     case "Follicular": return "bg-green-50";
  //     case "Ovulation": return "bg-yellow-50";
  //     case "Luteal": return "bg-blue-50";
  //     default: return "bg-purple-50";
  //   }
  // };

  // const getPhaseBorderColor = () => {
  //   switch (cyclePhase) {
  //     case "Menstruation": return "border-red-100";
  //     case "Follicular": return "border-green-100";
  //     case "Ovulation": return "border-yellow-100";
  //     case "Luteal": return "border-blue-100";
  //     default: return "border-purple-100";
  //   }
  // };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="gradient-primary flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Mood Popup */}
      {showMoodPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <button
              onClick={() => setShowMoodPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <h3 className="mb-8 text-center text-2xl font-semibold text-purple-800">
              How are you feeling today?
            </h3>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleMoodSelect("energetic")}
                className="flex flex-col items-center gap-3 rounded-xl bg-purple-100 p-6 transition-colors hover:bg-purple-200"
              >
                <span className="text-4xl">😄</span>
                <span className="font-medium text-gray-700">Energetic</span>
              </button>

              <button
                onClick={() => handleMoodSelect("balanced")}
                className="flex flex-col items-center gap-3 rounded-xl bg-blue-100 p-6 transition-colors hover:bg-blue-200"
              >
                <span className="text-4xl">😊</span>
                <span className="font-medium text-gray-700">Balanced</span>
              </button>

              <button
                onClick={() => handleMoodSelect("tired")}
                className="flex flex-col items-center gap-3 rounded-xl bg-blue-100 p-6 transition-colors hover:bg-blue-200"
              >
                <span className="text-4xl">😴</span>
                <span className="font-medium text-gray-700">Tired</span>
              </button>

              <button
                onClick={() => handleMoodSelect("stressed")}
                className="flex flex-col items-center gap-3 rounded-xl bg-red-100 p-6 transition-colors hover:bg-red-200"
              >
                <span className="text-4xl">😓</span>
                <span className="font-medium text-gray-700">Stressed</span>
              </button>
            </div>

            <p className="text-md text-center text-purple-700">
              This helps us personalize your workout and nutrition
              recommendations based on how you feel.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-10 sm:pb-8">
        {/* User greeting */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {/* Welcome, {user.name || user.username}! */}
              </h2>
              <p className="text-white/80">
                Your personalized wellness journey is here.
              </p>
            </div>
          </div>
        </div>

        {/* Cycle information */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center text-xl font-semibold text-gray-800">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Your Daily Insight
            </h3>
            <Button
              variant="ghost"
              className="h-auto px-2 py-1 text-sm text-purple-600 hover:bg-purple-50"
            >
              Update <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-col space-y-4">
            {!!user && user.onboardingAnswers.lastPeriod ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm text-gray-500">Current phase</span>
                    <div className="flex items-center">
                      {getPhaseIcon()}
                      <span className="ml-2 text-lg font-medium text-gray-800">
                        {!!userInfo && userInfo.cyclePhase}
                      </span>
                    </div>
                    <div className="mt-1 max-w-xs text-sm text-gray-600">
                      {!!userInfo &&
                        userInfo.cyclePhase === "menstruation" &&
                        "Your body is shedding uterine lining. Focus on rest and gentle movement."}
                      {!!userInfo &&
                        userInfo.cyclePhase === "follicular" &&
                        "Your body is preparing for ovulation. Energy levels start to increase."}
                      {!!userInfo &&
                        userInfo.cyclePhase === "ovulation" &&
                        "Your body is releasing an egg. Peak energy and confidence levels."}
                      {!!userInfo &&
                        userInfo.cyclePhase === "luteal" &&
                        "Your body is preparing for possible pregnancy. Energy may start to decrease."}
                      {!!userInfo &&
                        userInfo.cyclePhase === "unknown" &&
                        "Complete your profile to get personalized cycle insights."}
                    </div>
                  </div>
                  <div className="order-first mb-4 flex flex-col items-center sm:order-none sm:mb-0">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-purple-200 bg-purple-100">
                        <span className="text-4xl font-bold text-purple-600">
                          {!!userInfo && userInfo.cycleDay}
                        </span>
                      </div>
                      <span className="mt-2 text-xs text-gray-600">
                        Day of cycle
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm text-gray-500">Next phase in</span>
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-800">
                        {!!userInfo && userInfo.nextPhaseIn} days
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>Day 1</span>
                    <span>Day 28</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-50">
                    <div
                      className="h-full bg-gradient-to-r from-purple-200 to-purple-400"
                      style={{
                        width: `${!!userInfo && userInfo.cyclePercentage}%`,
                      }}
                    ></div>
                  </div>
                  // Hormone Levels Section
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">
                      HORMONE LEVELS
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      // Estrogen
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-pink-500">
                            Estrogen
                          </span>
                          <span className="text-xs text-pink-400">rising</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-pink-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-pink-100 to-pink-300"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Peaks during ovulation, boosting energy
                        </p>
                      </div>
                      // Progesterone
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-400">
                            Progesterone
                          </span>
                          <span className="text-xs text-gray-500">stable</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-100 to-blue-200"
                            style={{ width: "40%" }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Low during ovulation, rises in luteal phase
                        </p>
                      </div>
                      // Testosterone
                      <div className="max-h-28 min-h-[5rem]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-amber-500">
                            Testosterone
                          </span>
                          <span className="text-xs text-amber-400">rising</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-amber-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-100 to-amber-200"
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Increases during ovulation, boosts libido
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-2 text-center">
                <p className="text-gray-700">
                  Track your cycle to get personalized recommendations
                </p>
                <Button
                  variant="outline"
                  className="mt-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Add Period Date
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Recommendations */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Workout recommendations */}
          <section className="rounded-xl border bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">
                Workout Recommendations
              </h3>
            </div>

            <div className="space-y-3">
              {/* Debug log: {console.log("Debug cyclePhase value:", cyclePhase)} */}
              <div className="mb-3 text-sm text-gray-600">
                {!!userInfo && userInfo.cyclePhase === "follicular" && (
                  <p>
                    The Follicular phase is a great time to build muscle as your
                    energy increases. Your body naturally has more stamina now.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "ovulation" && (
                  <p>
                    During Ovulation, your energy is at its peak, making it
                    ideal for high-intensity workouts and setting new personal
                    records.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "luteal" && (
                  <p>
                    In the Luteal phase, your body is winding down. Focus on
                    moderate activity and active recovery to support this
                    transition.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "menstruation" && (
                  <p>
                    During Menstruation, your energy is lower. Gentle movement
                    supports your body's natural recovery process.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "unknown" && (
                  <p>
                    Matching your workouts to your cycle phase can optimize
                    results and make exercise feel more natural and enjoyable.
                  </p>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600">
                Based on your{" "}
                {!!userInfo && userInfo.cyclePhase
                  ? userInfo.cyclePhase.toLowerCase()
                  : "current"}{" "}
                phase, focus on:
              </p>
              <ul className="space-y-2">
                {workoutRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mt-0.5 mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                      <span className="text-xs font-medium text-purple-600">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>

              <Button className="gradient-primary mt-2 w-full hover:opacity-90">
                View Workouts
              </Button>
            </div>
          </section>

          {/* Nutrition recommendations */}
          <section className="rounded-xl border bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">
                Nutrition Recommendations
              </h3>
            </div>

            <div className="space-y-3">
              {/* Debug log: {console.log("Debug cyclePhase value (nutrition):", cyclePhase)} */}
              <div className="mb-3 text-sm text-gray-600">
                {!!userInfo && userInfo.cyclePhase === "follicular" && (
                  <p>
                    During your follicular phase, focus on foods that support
                    rising estrogen levels. Your metabolism is increasing and
                    your body needs more nutrients.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "ovulation" && (
                  <p>
                    During ovulation, your body benefits from antioxidant-rich
                    foods that support hormone balance and cellular health.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "luteal" && (
                  <p>
                    In the luteal phase, your body needs foods that help balance
                    mood and reduce bloating as progesterone rises.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "menstruation" && (
                  <p>
                    During menstruation, your body needs extra iron and
                    anti-inflammatory foods to replenish what's lost and reduce
                    discomfort.
                  </p>
                )}
                {!!userInfo && userInfo.cyclePhase === "unknown" && (
                  <p>
                    Eating according to your cycle phase can help manage
                    symptoms and provide your body with exactly what it needs
                    when it needs it.
                  </p>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600">
                Foods to focus on during your{" "}
                {!!userInfo && userInfo.cyclePhase
                  ? userInfo.cyclePhase.toLowerCase()
                  : "current"}{" "}
                phase:
              </p>
              <ul className="space-y-2">
                {nutritionRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mt-0.5 mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                      <span className="text-xs font-medium text-purple-600">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>

              <Button className="gradient-primary mt-2 w-full hover:opacity-90">
                View Recipes
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white/10 py-6 pb-16 backdrop-blur-sm sm:pb-6">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} FemFit. All rights reserved.</p>
          <p className="mt-1 text-sm">Built by Women for Women</p>
          <Button
            variant="outline"
            className="mx-auto mt-4 mb-6 flex items-center gap-2 border border-purple-200 bg-white/10 px-5 py-2 font-medium text-white shadow-sm hover:bg-white/30"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
