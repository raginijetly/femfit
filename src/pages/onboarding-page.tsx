import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { OnboardingQuestionCard } from "@/components/OnboardingComponents";
import type {
  OnboardingAnswersType,
  OnboardingQuestionsType,
} from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL, UI_DELAY } from "@/utils/constants";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // My New onboarding states
  const [onboardingAnswers, setOnboardingAnswers] = useState<{
    [key: string]: number | string | string[] | Date | undefined;
  }>({});

  // Fetch ONBOARDING QUESTIONNAIRE from db
  const [onboardingQuestions, setOnboardingQuestions] = useState<
    OnboardingQuestionsType[]
  >([]);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const extractAndSetOnboardingAnswers = (
    questions: OnboardingQuestionsType[],
  ): OnboardingAnswersType => {
    const answers: {
      [key: string]: number | string | string[] | Date | undefined;
    } = {};
    questions?.forEach((question) => {
      if (question.answer !== undefined) {
        answers[question.key] = question.answer;
      }
    });
    setOnboardingAnswers(answers);
    return answers;
  };

  useEffect(() => {
    const fetchOnboardingQuestions = async () => {
      try {
        const response = await fetchData(
          "get",
          `${BACKEND_API_URL}/users/onboarding-questions`,
        );

        if (response.status === 200) {
          console.log("Onboarding questions:", response);
          // If user has completed onboarding
          setOnboardingQuestions(response.data.questions);
          setTotalSteps(response.data.totalQuestions);
          if (response.data.completedOnboarding === true) {
            // navigate("/");
            const ans = extractAndSetOnboardingAnswers(response.data.questions);
            // Calculate cycle info based on last period date
            calculateCycleInfo(ans.lastPeriod as Date | undefined);
            setCurrentStep(response.data.totalQuestions + 1); // Set to completion step
          }
          setLoading(false);
        } else {
          // User is not logged in
          navigate("/auth");
          return;
        }
      } catch (error) {
        console.error("Error fetching onboarding questions:", error);
        // navigate("/auth");
        return;
      }
    };
    const timer = setTimeout(() => {
      fetchOnboardingQuestions();
    }, UI_DELAY); // Simulate loading delay for better UX
    return () => clearTimeout(timer);
  }, []);

  // Current step in the onboarding process
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Helper function to get completion percentage
  const getCompletionPercentage = (): number => {
    return Math.min(
      (currentStep - 1) * (100 / totalSteps),
      // currentStep * (100 / totalSteps),
      100,
    );
  };

  // Calculate cycle information for the completion screen
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [cyclePhase, setCyclePhase] = useState<string | null>(null);
  // const [bmi, setBmi] = useState<number | null>(null);

  const calculateCycleInfo = (dateInput: Date | undefined) => {
    if (dateInput) {
      // Calculate days since period started
      const today = new Date();
      const daysSincePeriod = differenceInDays(today, dateInput);

      // Assume a 28-day cycle for demo purposes
      const cycleDayNum = (daysSincePeriod % 28) + 1;
      setCycleDay(cycleDayNum);

      // Determine cycle phase
      if (cycleDayNum <= 5) {
        setCyclePhase("Menstruation");
      } else if (cycleDayNum <= 13) {
        setCyclePhase("Follicular");
      } else if (cycleDayNum <= 16) {
        setCyclePhase("Ovulation");
      } else {
        setCyclePhase("Luteal");
      }
    } else {
      // Default values if no date is selected
      setCycleDay(1);
      setCyclePhase("Menstruation");
    }
  };

  // Handle onboarding submission
  const handleSubmit = () => {
    console.log("Submitting onboarding data...");
    setLoading(true);
    const saveOnboardingAnswers = async () => {
      try {
        const response = await fetchData(
          "post",
          `${BACKEND_API_URL}/users/onboarding-answers`,
          {
            onboardingAnswers: onboardingAnswers,
          },
        );

        if (response.status === 200) {
          console.log("Onboarding answers:", response);
          // setOnboardingQuestions(response.data.questions);
          // setTotalSteps(response.data.totalQuestions);
          setLoading(false);
          navigate("/home");
        }
      } catch (error) {
        console.error("Error submitting onboarding questions:", error);
        // navigate("/auth");
        return;
      }
    };
    const timer = setTimeout(() => {
      saveOnboardingAnswers();
    }, UI_DELAY); // Simulate loading delay for better UX
    return () => clearTimeout(timer);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="gradient-primary flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="gradient-primary flex min-h-screen flex-col p-6">
      {currentStep <= totalSteps && (
        <div className="mb-6">
          <div className="mb-2 flex items-center">
            <div className="font-medium text-purple-900">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress
            value={getCompletionPercentage()}
            className="h-2 bg-purple-200 text-red-500"
          />
        </div>
      )}

      {currentStep <= totalSteps &&
        onboardingQuestions
          .filter((elements) => elements.stage === currentStep)
          .map((question) => (
            <div
              className="flex flex-col items-center justify-center"
              key={question.key}
            >
              <OnboardingQuestionCard
                key={question.key}
                type={question.type}
                questionKey={question.key}
                question={question.question}
                text={question?.text}
                placeholder={question?.placeholder}
                label={question?.label}
                options={question?.options || []}
                setSingleSelect={(setValue: string | undefined) => {
                  setOnboardingAnswers((prev) => ({
                    ...prev,
                    [question.key]: setValue,
                  }));
                }}
                setMultiSelect={(setValues: string[]) => {
                  setOnboardingAnswers((prev) => ({
                    ...prev,
                    [question.key]: setValues,
                  }));
                }}
                setDateInput={(setValue: Date | undefined) => {
                  setOnboardingAnswers((prev) => ({
                    ...prev,
                    [question.key]: setValue,
                  }));
                  if (setValue) calculateCycleInfo(setValue);
                }}
                setNumberInput={(setValue: number | undefined) => {
                  setOnboardingAnswers((prev) => {
                    return {
                      ...prev,
                      [question.key]: setValue,
                    };
                  });
                }}
                setBmiInput={(setValue: number | undefined) => {
                  setOnboardingAnswers((prev) => {
                    return {
                      ...prev,
                      [question.key]: setValue,
                    };
                  });
                }}
              />
            </div>
          ))}
      {currentStep <= totalSteps && (
        <div className="mx-auto w-full pt-7 sm:w-[500px]">
          <Button
            className="gradient-primary w-full border-2 border-white py-3 text-lg font-medium shadow-lg shadow-purple-800/50"
            onClick={() => {
              if (currentStep <= totalSteps) {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            disabled={
              // !onboardingAnswers[onboardingQuestions[currentStep - 1].key]
              ((): boolean => {
                const currentQuestionsKeys = onboardingQuestions.filter(
                  (el) => el.stage === currentStep,
                );
                let isEmpty = false;
                currentQuestionsKeys.forEach((item) => {
                  if (
                    item &&
                    (onboardingAnswers[item.key] === undefined ||
                      onboardingAnswers[item.key] === null ||
                      onboardingAnswers[item.key] === "" ||
                      (Array.isArray(onboardingAnswers[item.key]) &&
                        ((onboardingAnswers[item.key] as string[])?.length ===
                          0 ||
                          (onboardingAnswers[item.key] as string[]).includes(
                            "",
                          ))))
                  ) {
                    isEmpty = true;
                  }
                });
                return isEmpty;
              })()
            }
          >
            Continue
          </Button>
        </div>
      )}

      {/* Completion Step */}
      {currentStep === totalSteps + 1 && (
        <div className="flex h-full flex-col items-center justify-center space-y-8 py-6">
          <div className="rounded-full bg-purple-100 p-6">
            <CheckCircle className="h-16 w-16 text-purple-800" />
          </div>

          <div className="text-center">
            <h1 className="mb-3 text-3xl font-bold text-purple-900">
              You're all set!
            </h1>
            <p className="mb-8 max-w-md text-purple-800/80">
              We've personalized your fitness journey based on your information
            </p>
          </div>

          <div className="w-full max-w-md rounded-lg bg-purple-50 p-6">
            <h2 className="mb-4 text-xl font-bold text-purple-900">
              Your Cycle Information
            </h2>

            <div className="flex justify-between border-b border-purple-100 py-2">
              <span className="text-gray-700">Current Cycle Day:</span>
              <span className="font-semibold text-purple-900">
                {cycleDay || "N/A"}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-700">Current Phase:</span>
              <span className="font-semibold text-purple-900">
                {cyclePhase || "Unknown"}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-gray-700">BMI:</span>
              <div className="flex flex-col items-end font-semibold text-purple-900">
                <p>
                  {!!onboardingAnswers.bmi
                    ? (onboardingAnswers.bmi as number)
                    : "Unknown"}
                </p>
                <p>
                  {!!onboardingAnswers.bmi
                    ? (onboardingAnswers.bmi as number) < 18.5
                      ? "Underweight"
                      : (onboardingAnswers.bmi as number) < 25
                        ? "Normal weight"
                        : (onboardingAnswers.bmi as number) < 30
                          ? "Overweight"
                          : "Obese"
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="mt-6 h-12 w-full max-w-md bg-white text-lg font-bold text-purple-900 hover:opacity-90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Start Your Journey"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
