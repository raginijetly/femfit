import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, User } from "lucide-react";
import {
  fetchData,
  getOthersAnswer,
  parseOnboardingAnswers,
} from "@/utils/commonFunction";
import { BACKEND_API_URL, UI_DELAY } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import {
  type FormattedAnswers,
  type OnboardingQuestionsType,
  type UserType,
} from "@/utils/types";
import { Button } from "@/components/ui/button";
import { OnboardingQuestionCard } from "@/components/OnboardingComponents";

const UpdatePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [onboardingQuestions, setOnboardingQuestions] = useState<
    OnboardingQuestionsType[]
  >([]);
  const [onboardingAnswers, setOnboardingAnswers] = useState<FormattedAnswers>(
    {},
  );
  const [currentQuestion, setCurrentQuestion] = useState<
    OnboardingQuestionsType | undefined
  >(undefined);
  const [currentAnswer, setCurrentAnswer] = useState<
    Record<string, string | string[] | number> | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch Home page data
  useEffect(() => {
    const fetchUpdateData = async () => {
      try {
        const response = await fetchData(
          "get",
          `${BACKEND_API_URL}/users/onboarding-questions`,
        );
        if (response.status === 200) {
          console.log("Update data fetched successfully:", response);
          // User has not completed onboarding
          if (!response.data.completedOnboarding) navigate("/onboarding");
          // User is logged in and has completed onboarding
          setOnboardingQuestions(response.data.questions);
          setOnboardingAnswers(parseOnboardingAnswers(response.data.questions));
          setUser(response.data.user);
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
      fetchUpdateData();
    }, UI_DELAY);
    return () => clearTimeout(timer);
  }, [refresh]);

  const updateAnswer = async () => {
    if (!currentAnswer && !currentQuestion) return;
    try {
      const response = await fetchData(
        "put",
        `${BACKEND_API_URL}/users/onboarding-answers`,
        {
          onboardingAnswers: currentAnswer,
        },
      );
      if (response.status === 200) {
        console.log("Answer updated successfully:", response);
        setLoading(true);
        // Refresh the page to reflect changes
        setRefresh((prev) => !prev);
        setCurrentAnswer(undefined);
        setCurrentQuestion(undefined);
      } else {
        console.error("Failed to update answer:", response);
      }
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  // Close the Know More popup when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrentQuestion(undefined);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      {/* Update Answer Popup */}
      {!!currentQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md"
          onClick={() => {
            setCurrentQuestion(undefined);
            setCurrentAnswer(undefined);
          }}
        >
          <div
            className="animate-in fade-in zoom-in from-brand-light to-brand-dark relative z-10 flex w-fit flex-col gap-5 rounded-xl bg-gradient-to-br p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <OnboardingQuestionCard
              key={currentQuestion.key}
              type={currentQuestion.type}
              questionKey={currentQuestion.key}
              question={currentQuestion.question}
              text={currentQuestion?.text}
              placeholder={currentQuestion?.placeholder}
              label={currentQuestion?.label}
              options={currentQuestion?.options || []}
              answer={currentQuestion?.answer}
              otherTextAnswer={getOthersAnswer(
                currentQuestion.options,
                currentQuestion.answer as string[],
              )}
              setNumberInput={(value) =>
                setCurrentAnswer({
                  [currentQuestion.key]: value ?? "",
                })
              }
              setDateInput={(value) =>
                setCurrentAnswer({
                  [currentQuestion.key]: value?.toISOString() ?? "",
                })
              }
              setSingleSelect={(value) =>
                setCurrentAnswer({
                  [currentQuestion.key]: value?.toString() ?? "",
                })
              }
              setMultiSelect={(value) =>
                setCurrentAnswer({
                  [currentQuestion.key]: value ?? "",
                })
              }
              setBmiInput={(value) =>
                setCurrentAnswer({
                  [currentQuestion.key]: value ?? "",
                })
              }
            />
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-purple-900 hover:bg-purple-50"
                onClick={() => {
                  setCurrentQuestion(undefined);
                  setCurrentAnswer(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-50 text-purple-900 hover:bg-transparent"
                onClick={updateAnswer}
                disabled={((): boolean => {
                  if (
                    !!currentQuestion &&
                    !!currentAnswer &&
                    (currentAnswer[currentQuestion.key] === undefined ||
                      currentAnswer[currentQuestion.key] === null ||
                      currentAnswer[currentQuestion.key] === "" ||
                      (Array.isArray(currentAnswer[currentQuestion.key]) &&
                        ((currentAnswer[currentQuestion.key] as string[])
                          ?.length === 0 ||
                          (
                            currentAnswer[currentQuestion.key] as string[]
                          ).includes(""))))
                  ) {
                    return true;
                  }
                  return false;
                })()}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="container mx-auto px-4 pt-24 pb-10 sm:pb-8">
        {/* User greeting */}
        <div className="-mt-3 mb-8 flex flex-col-reverse items-center justify-between gap-5 sm:mt-2 sm:flex-row sm:gap-0">
          <div className="mb-2 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="shrink-0">
              <h2 className="text-xl font-semibold text-white">
                Hey, {user?.fullName}!
              </h2>
              <p className="text-white/80">
                Update your profile and preferences here.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="ml-auto bg-white px-10 py-4 text-lg text-purple-600"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="mr-1 size-4" /> Back to Home
          </Button>
        </div>
        {/* Onboarding Questions */}
        <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {onboardingQuestions.map((question, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-lg bg-white p-4 text-black shadow-md"
            >
              <h3 className="text-md leading-6 font-semibold text-purple-700">
                {question.question}
              </h3>
              <div className="flex items-end justify-between">
                {!!question.answer ? (
                  <p className="">{onboardingAnswers[question.key]}</p>
                ) : (
                  <p className="">Please provide your answer below.</p>
                )}
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1 text-sm text-purple-900 hover:bg-purple-50"
                  onClick={() => {
                    setCurrentQuestion(question);
                  }}
                >
                  {!!question.answer ? "Update" : "Add Answer"}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UpdatePage;
