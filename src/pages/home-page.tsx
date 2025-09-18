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
  X,
} from "lucide-react";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL, UI_DELAY } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import {
  CYCLE_PHASES,
  type PerDayCycleDataType,
  type UserInfoType,
  type UserType,
} from "@/utils/types";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [cycleInfo, setCycleInfo] = useState<PerDayCycleDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // const [cyclePhase, setCyclePhase] = useState<string>("Unknown");
  // State for mood popup
  const [showMoodPopup, setShowMoodPopup] = useState<boolean>(false);
  const [showKnowMorePopup, setShowKnowMorePopup] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch Home page data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetchData(
          "get",
          `${BACKEND_API_URL}/sections/home`,
        );
        if (response.status === 200) {
          console.log("Home data fetched successfully:", response);
          // User has not completed onboarding
          if (!response.data.user.completedOnboarding) navigate("/onboarding");
          // User is logged in and has completed onboarding
          setUserDetails(response.data.user);
          setUserInfo(response.data.userInfo);
          setCycleInfo(response.data.cycleInfo);
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
    // Only show mood popup if user is logged in and has completed onboarding
    if (!user || !user.completedOnboarding) return;
    // If the user has already logged their mood today, do not show the popup
    if (
      user.dailyMood.length > 0 &&
      differenceInDays(
        new Date(),
        new Date(user.dailyMood[user.dailyMood.length - 1]?.date),
      ) === 0
    )
      return;

    const timer = setTimeout(() => {
      setShowMoodPopup(true);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [user]);

  // Close the Know More popup when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowKnowMorePopup(false);
        setShowMoodPopup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetchData("get", `${BACKEND_API_URL}/auth/logout`);
  //     if (response.status === 200) {
  //       console.log("Logout successful");
  //       setUser(null);
  //       navigate("/auth");
  //     } else {
  //       console.error("Logout failed:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };

  // Get workout recommendations based on cycle phase
  const getWorkoutRecommendations = () => {
    switch (userInfo?.cyclePhase) {
      case CYCLE_PHASES.MENSTRUAL:
        return [
          "Gentle yoga or stretching",
          "Walking or light cardio",
          "Restorative exercises",
        ];
      case CYCLE_PHASES.FOLLICULAR:
        return [
          "High-intensity interval training",
          "Strength training",
          "Cardio classes",
        ];
      case CYCLE_PHASES.OVULATORY:
        return [
          "Circuit training",
          "Endurance workouts",
          "Group fitness classes",
        ];
      case CYCLE_PHASES.LUTEAL:
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
      case CYCLE_PHASES.MENSTRUAL:
        return [
          "Iron-rich foods (leafy greens, lentils)",
          "Anti-inflammatory foods (berries, nuts)",
          "Stay hydrated with water and herbal teas",
        ];
      case CYCLE_PHASES.FOLLICULAR:
        return [
          "Complex carbs for energy (oats, brown rice)",
          "Lean proteins (chicken, fish, tofu)",
          "Vitamin B-rich foods (whole grains, eggs)",
        ];
      case CYCLE_PHASES.OVULATORY:
        return [
          "Magnesium-rich foods (dark chocolate, avocados)",
          "Antioxidant-rich foods (colorful fruits and vegetables)",
          "Healthy fats (olive oil, nuts, seeds)",
        ];
      case CYCLE_PHASES.LUTEAL:
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
      case CYCLE_PHASES.MENSTRUAL:
        return "text-red-600";
      case CYCLE_PHASES.FOLLICULAR:
        return "text-green-600";
      case CYCLE_PHASES.OVULATORY:
        return "text-yellow-600";
      case CYCLE_PHASES.LUTEAL:
        return "text-blue-600";
      default:
        return "text-purple-600";
    }
  };

  const getPhaseIcon = () => {
    switch (!!userInfo && userInfo.cyclePhase) {
      case CYCLE_PHASES.MENSTRUAL:
        return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      case CYCLE_PHASES.FOLLICULAR:
        return <Activity className={`h-6 w-6 ${getPhaseColor()}`} />;
      case CYCLE_PHASES.OVULATORY:
        return <Sun className={`h-6 w-6 ${getPhaseColor()}`} />;
      case CYCLE_PHASES.LUTEAL:
        return <Moon className={`h-6 w-6 ${getPhaseColor()}`} />;
      default:
        return <Calendar className="h-6 w-6 text-purple-600" />;
    }
  };

  // const getPhaseBackgroundColor = () => {
  //   switch (cyclePhase) {
  //     case CYCLE_PHASES.MENSTRUAL: return "bg-red-50";
  //     case CYCLE_PHASES.FOLLICULAR: return "bg-green-50";
  //     case CYCLE_PHASES.OVULATORY: return "bg-yellow-50";
  //     case CYCLE_PHASES.LUTEAL: return "bg-blue-50";
  //     default: return "bg-purple-50";
  //   }
  // };

  // const getPhaseBorderColor = () => {
  //   switch (cyclePhase) {
  //     case CYCLE_PHASES.MENSTRUAL: return "border-red-100";
  //     case CYCLE_PHASES.FOLLICULAR: return "border-green-100";
  //     case CYCLE_PHASES.OVULATORY: return "border-yellow-100";
  //     case CYCLE_PHASES.LUTEAL: return "border-blue-100";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md">
          <div className="animate-in fade-in zoom-in relative flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-6 shadow-lg">
            <div className="flex justify-between">
              <h3 className="text-center text-2xl font-semibold text-purple-800">
                How are you feeling today?
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMoodPopup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

      {showKnowMorePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md"
          onClick={() => setShowKnowMorePopup(false)}
        >
          <div
            className="animate-in fade-in zoom-in relative z-10 flex w-full max-w-md flex-col gap-5 rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-center text-2xl font-semibold text-purple-800">
                Know more about your cycle
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKnowMorePopup(false)}
                className="self-start text-gray-400 hover:text-gray-600"
              >
                <X className="size-6" />
              </Button>
            </div>
            <div className="border-brand-dark rounded-lg border-2 p-4 shadow-lg">
              <h3 className="text-xl font-semibold text-purple-400">
                Phase Superpowers
              </h3>
              <p className="text-sm text-gray-600">{cycleInfo?.superpower}</p>
            </div>
            <div className="border-brand-dark rounded-lg border-2 p-4 shadow-lg">
              <h3 className="text-xl font-semibold text-purple-400">
                Fun Science Fact
              </h3>
              <p className="text-sm text-gray-600">{cycleInfo?.fact}</p>
            </div>
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
                Welcome, {user?.fullName}!
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
              className="gradient-primary h-auto px-2 py-2 text-sm font-semibold shadow-lg"
              onClick={() => navigate("/update")}
            >
              Update <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-col space-y-4">
            {!!user && user.onboardingAnswers?.lastPeriod ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="">
                    <span className="text-sm text-gray-500">Current phase</span>
                    <div className="flex items-center">
                      {getPhaseIcon()}
                      <span
                        className={`ml-2 text-lg font-medium ${getPhaseColor()}`}
                      >
                        {!!userInfo && userInfo.cyclePhase}
                      </span>
                    </div>
                    <div className="mt-1 max-w-xl text-sm text-gray-600">
                      {!!cycleInfo && cycleInfo.description}
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
                </div>

                <div>
                  {/* // Hormone Levels Section */}
                  <div className="mt-2">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">
                      HORMONE LEVELS
                    </h4>
                    <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
                      {/* // Estrogen */}
                      <div className="max-h-28 w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-pink-500">
                            Estrogen
                          </span>
                          {/* <span className="text-xs text-pink-400">rising</span> */}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-pink-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-pink-100 to-pink-300"
                            style={{
                              width: cycleInfo?.estrogen.percentage + "%",
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {/* Peaks during ovulation, boosting energy */}
                          {cycleInfo?.estrogen.notes}
                        </p>
                      </div>
                      {/* // Progesterone */}
                      <div className="max-h-28 w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-400">
                            Progesterone
                          </span>
                          {/* <span className="text-xs text-gray-500">stable</span> */}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-100 to-blue-300"
                            style={{
                              width: cycleInfo?.progesterone.percentage + "%",
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {/* Low during ovulation, rises in luteal phase */}
                          {cycleInfo?.progesterone.notes}
                        </p>
                      </div>
                      {/* // Testosterone */}
                      <div className="max-h-28 w-full">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-amber-500">
                            Testosterone
                          </span>
                          {/* <span className="text-xs text-amber-400">rising</span> */}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-amber-50">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-100 to-amber-300"
                            style={{
                              width: cycleInfo?.testosterone.percentage + "%",
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {/* Increases during ovulation, boosts libido */}
                          {cycleInfo?.testosterone.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="gradient-primary mt-6 w-full py-6 text-lg uppercase shadow-lg hover:opacity-90"
                    onClick={() => setShowKnowMorePopup(true)}
                  >
                    Know more about your cycle
                  </Button>
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
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.FOLLICULAR && (
                    <p>
                      The Follicular phase is a great time to build muscle as
                      your energy increases. Your body naturally has more
                      stamina now.
                    </p>
                  )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.OVULATORY && (
                    <p>
                      During Ovulation, your energy is at its peak, making it
                      ideal for high-intensity workouts and setting new personal
                      records.
                    </p>
                  )}
                {!!userInfo && userInfo.cyclePhase === CYCLE_PHASES.LUTEAL && (
                  <p>
                    In the Luteal phase, your body is winding down. Focus on
                    moderate activity and active recovery to support this
                    transition.
                  </p>
                )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.MENSTRUAL && (
                    <p>
                      During Menstruation, your energy is lower. Gentle movement
                      supports your body's natural recovery process.
                    </p>
                  )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.AWAITING_CYCLE_START && (
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
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.FOLLICULAR && (
                    <p>
                      During your follicular phase, focus on foods that support
                      rising estrogen levels. Your metabolism is increasing and
                      your body needs more nutrients.
                    </p>
                  )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.OVULATORY && (
                    <p>
                      During ovulation, your body benefits from antioxidant-rich
                      foods that support hormone balance and cellular health.
                    </p>
                  )}
                {!!userInfo && userInfo.cyclePhase === CYCLE_PHASES.LUTEAL && (
                  <p>
                    In the luteal phase, your body needs foods that help balance
                    mood and reduce bloating as progesterone rises.
                  </p>
                )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.MENSTRUAL && (
                    <p>
                      During menstruation, your body needs extra iron and
                      anti-inflammatory foods to replenish what's lost and
                      reduce discomfort.
                    </p>
                  )}
                {!!userInfo &&
                  userInfo.cyclePhase === CYCLE_PHASES.AWAITING_CYCLE_START && (
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
      <footer className="mt-auto bg-white/10 py-6 pb-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} FemFit. All rights reserved.</p>
          <p className="mt-1 text-sm">Built by Women for Women</p>
          {/* <Button
            variant="outline"
            className="mx-auto mt-4 mb-6 flex items-center gap-2 border border-purple-200 bg-white/10 px-5 py-2 font-medium text-white shadow-sm hover:bg-white/30"
            onClick={handleLogout}
          >
            Logout
          </Button> */}
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
