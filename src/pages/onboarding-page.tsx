import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { OnboardingQuestionCard } from "@/components/OnboardingComponents";
import type { OnboardingQuestionsType } from "@/utils/types";
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

  // const calculateBmi = (
  //   weight: number | undefined,
  //   height: number | undefined,
  // ) => {
  //   if (weight && height) {
  //     const bmiValue = parseFloat(
  //       (weight / Math.pow(height / 100, 2)).toFixed(1),
  //     );
  //     console.log(
  //       "Calculating BMI with weight:",
  //       weight,
  //       "and height:",
  //       height,
  //       "Resulting BMI:",
  //       bmiValue,
  //     );
  //     setBmi(bmiValue);
  //   } else {
  //     setBmi(null);
  //   }
  // };

  // useEffect(() => {
  //   if (onboardingAnswers.weight && onboardingAnswers.height) {
  //     calculateBmi(
  //       onboardingAnswers["weight"] as number,
  //       onboardingAnswers["height"] as number,
  //     );
  //   }
  // }, [onboardingAnswers.weight, onboardingAnswers.height]);

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
          navigate("/");
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
                setDateInput={(setValue: Date | "idk" | undefined) => {
                  setOnboardingAnswers((prev) => ({
                    ...prev,
                    [question.key]: setValue,
                  }));
                  if (setValue)
                    calculateCycleInfo(
                      setValue === "idk" ? undefined : setValue,
                    );
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
                console.log("isEmpty", isEmpty);
                // console.log("current Question", currentQuestionsKeys);
                // console.log("Onboarding answers", onboardingAnswers);
                console.log(
                  "dietaryPreferences",
                  onboardingAnswers.dietaryPreferences,
                );
                return isEmpty;
              })()
            }
          >
            Continue
          </Button>
          {/* <Button
            variant="ghost"
            className="mt-2 w-full text-purple-800 hover:bg-purple-50/50"
            onClick={() => {
              if (currentStep <= totalSteps) {
                setCurrentStep((prev) => prev + 1);
                setOnboardingAnswers((prev) => ({
                  ...prev,
                  [onboardingQuestions[currentStep - 1].key]: undefined,
                }));
              }
            }}
          >
            Skip for now
          </Button> */}
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
            className="gradient-primary mt-6 w-full max-w-md py-3 text-lg hover:opacity-90"
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

  // return (
  //   <div className="gradient-primary flex min-h-screen flex-col p-6">
  //     {currentStep !== "completion" && (
  //       /* Progress indicator - removing percentage and keeping just step count */
  //       <div className="mb-6">
  //         <div className="mb-2 flex items-center">
  //           <div className="font-medium text-purple-900">
  //             Step {getStepNumber(currentStep)} of {TOTAL_STEPS}
  //           </div>
  //         </div>
  //         <Progress value={progressPercentage} className="h-2 bg-purple-200" />
  //       </div>
  //     )}

  //     <div className="flex flex-1 flex-col">
  //       {currentStep === "age" && (
  //         <div className="flex h-full flex-col items-center">
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[0]?.type}
  //             questionKey={onboardingQuestions[0]?.key}
  //             question={onboardingQuestions[0]?.question}
  //             text={onboardingQuestions[0]?.text}
  //             placeholder={onboardingQuestions[0]?.placeholder}
  //             label={onboardingQuestions[0]?.label}
  //             setNumberInput={(setValue: number | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[0].key]: setValue,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={!onboardingAnswers[onboardingQuestions[0].key]}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Period Date Step */}
  //       {currentStep === "period" && (
  //         <div className="flex h-full flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="text-2xl font-bold text-purple-900 mb-2">
  //               When was your last period?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               This helps us personalize your fitness plan based on your cycle
  //             </p>
  //           </div>

  //           {!dontKnowDate ? (
  //             <div className="flex-1 flex items-center justify-center">
  //               <div className="bg-white rounded-lg p-4 w-full max-w-md">
  //                 <div className="flex items-center mb-2">
  //                   <CalendarIcon className="mr-2 h-5 w-5 text-purple-500" />
  //                   <span className="text-gray-700">
  //                     First day of last period
  //                   </span>
  //                 </div>

  //                 <div className="flex justify-center w-full">
  //                   <Calendar
  //                     mode="single"
  //                     selected={dateInput}
  //                     onSelect={setDateInput}
  //                     className="w-full block"
  //                     styles={{
  //                       root: { width: "100%" },
  //                       month: { width: "100%" },
  //                       table: { width: "100%" },
  //                     }}
  //                     disabled={(date) => date > new Date()}
  //                   />
  //                 </div>

  //                 {dateInput && (
  //                   <p className="text-sm text-center text-gray-600 mt-2">
  //                     Selected: {format(dateInput, "MMMM d, yyyy")}
  //                   </p>
  //                 )}

  //                 <Button
  //                   variant="ghost"
  //                   className="w-full mt-3 text-sm py-2 text-purple-800 hover:text-purple-900 hover:bg-purple-50/50 border border-purple-100"
  //                   onClick={() => setDontKnowDate(true)}
  //                 >
  //                   I don't know my last period date
  //                 </Button>
  //               </div>
  //             </div>
  //           ) : (
  //             <div className="flex-1 flex flex-col justify-center items-center">
  //               <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
  //                 <p className="text-gray-700 mb-4">
  //                   You can log the first day of your last period later or log
  //                   the beginning of your new one later.
  //                 </p>
  //                 <Button
  //                   variant="outline"
  //                   className="mt-2"
  //                   onClick={() => setDontKnowDate(false)}
  //                 >
  //                   Back to calendar
  //                 </Button>
  //               </div>
  //             </div>
  //           )} */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[1]?.type}
  //             questionKey={onboardingQuestions[1]?.key}
  //             question={onboardingQuestions[1]?.question}
  //             text={onboardingQuestions[1]?.text}
  //             setDateInput={(setValue: Date | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[1].key]: setValue,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //             >
  //               Continue
  //             </Button>
  //             {/* Skip button shown only if not on the period date selection screen or if on period screen but NOT in "don't know" mode */}
  //             {(currentStep !== "period" ||
  //               (currentStep === "period" && !dontKnowDate)) && (
  //               <Button
  //                 variant="ghost"
  //                 className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //                 onClick={skipStep}
  //               >
  //                 Skip for now
  //               </Button>
  //             )}
  //           </div>
  //         </div>
  //       )}

  //       {/* Period Regularity Step */}
  //       {currentStep === "regularity" && (
  //         <div className="flex h-full flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="text-2xl font-bold text-purple-900 mb-2">
  //               Are your periods regular?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               This helps us better understand your cycle patterns
  //             </p>
  //           </div>

  //           <div className="flex-1 flex flex-col justify-center">
  //             <div className="grid grid-cols-1 gap-4 w-full max-w-md mx-auto">
  //               {PERIOD_REGULARITY.map((option) => (
  //                 <div key={option}>
  //                   <button
  //                     className={`w-full py-3 px-4 text-left border-2 rounded-lg ${
  //                       periodsRegular === option
  //                         ? "border-purple-500 bg-purple-100"
  //                         : "border-white bg-white"
  //                     }`}
  //                     onClick={() => setPeriodsRegular(option)}
  //                   >
  //                     <span className="text-gray-800 font-medium">
  //                       {option}
  //                     </span>

  //                     {periodsRegular === option && (
  //                       <div className="text-sm text-purple-700 mt-2">
  //                         {option === "Yes" &&
  //                           "Great! We can provide insights to help you optimize your lifestyle and habits to better align with your cycle."}
  //                         {option === "No" &&
  //                           "Okay, we can help you track your periods and better understand your body's signals, even if they're irregular."}
  //                         {option === "I'm unsure" &&
  //                           "No problem. We'll help you learn more about your cycle and provide personalized insights."}
  //                       </div>
  //                     )}
  //                   </button>
  //                 </div>
  //               ))}
  //             </div>
  //           </div> */}

  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[2]?.type}
  //             questionKey={onboardingQuestions[2]?.key}
  //             question={onboardingQuestions[2]?.question}
  //             text={onboardingQuestions[2]?.text}
  //             setSingleSelect={(setValue: string | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[2].key]: setValue,
  //                 };
  //               });
  //             }}
  //             options={onboardingQuestions[2]?.options || []}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={!periodsRegular}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Fitness Level Step */}
  //       {currentStep === "fitness" && (
  //         <div className="flex h-full flex-col items-center">
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[3]?.type}
  //             questionKey={onboardingQuestions[3]?.key}
  //             question={onboardingQuestions[3]?.question}
  //             text={onboardingQuestions[3]?.text}
  //             setSingleSelect={(setValue: string | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[3].key]: setValue,
  //                 };
  //               });
  //             }}
  //             options={onboardingQuestions[3]?.options || []}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={!fitnessLevel}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Dietary Preferences Step */}
  //       {currentStep === "dietary" && (
  //         <div className="flex h-full flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="mb-2 text-2xl font-bold text-purple-900">
  //               Do you have any dietary preferences/restrictions?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               Select all that apply to personalize your nutrition guidance
  //             </p>
  //           </div>

  //           <div className="flex flex-1 flex-col overflow-y-auto">
  //             <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3">
  //               {[
  //                 "No restrictions",
  //                 "Vegetarian",
  //                 "Vegan",
  //                 "Gluten-free",
  //                 "Dairy/Lactose free",
  //                 "Other allergies/restrictions",
  //               ].map((preference) => (
  //                 <div
  //                   key={preference}
  //                   className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                     dietaryPreferences.includes(preference)
  //                       ? "border-2 border-purple-500 bg-purple-100"
  //                       : "border-2 border-white bg-white"
  //                   }`}
  //                   onClick={() => toggleDietaryPreference(preference)}
  //                 >
  //                   <Checkbox
  //                     id={`dietary-${preference}`}
  //                     checked={dietaryPreferences.includes(preference)}
  //                     onCheckedChange={() =>
  //                       toggleDietaryPreference(preference)
  //                     }
  //                     className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                   />
  //                   <Label
  //                     htmlFor={`dietary-${preference}`}
  //                     className="w-full cursor-pointer text-gray-700"
  //                   >
  //                     {preference}
  //                   </Label>
  //                 </div>
  //               ))}

  //               {dietaryPreferences.includes(
  //                 "Other allergies/restrictions",
  //               ) && (
  //                 <div className="mt-2">
  //                   <Input
  //                     placeholder="Please specify your allergies/restrictions"
  //                     value={otherDietaryRestriction}
  //                     onChange={(e) =>
  //                       setOtherDietaryRestriction(e.target.value)
  //                     }
  //                     className="w-full"
  //                   />
  //                 </div>
  //               )}
  //             </div>
  //           </div> */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[4]?.type}
  //             questionKey={onboardingQuestions[4]?.key}
  //             question={onboardingQuestions[4]?.question}
  //             text={onboardingQuestions[4]?.text}
  //             options={onboardingQuestions[4]?.options || []}
  //             placeholder={onboardingQuestions[4]?.placeholder}
  //             setMultiSelect={(setValues: string[]) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[4].key]: setValues,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={dietaryPreferences.length === 0}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Health Goals Step */}
  //       {currentStep === "goals" && (
  //         <div className="flex h-full flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="mb-2 text-2xl font-bold text-purple-900">
  //               What are your primary health goals?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               Select all that apply to personalize your journey
  //             </p>
  //           </div>

  //           <div className="flex flex-1 flex-col overflow-y-auto">
  //             <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3">
  //               {HEALTH_GOALS.map((goal) => (
  //                 <div
  //                   key={goal}
  //                   className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                     healthGoals.includes(goal)
  //                       ? "border-2 border-purple-500 bg-purple-100"
  //                       : "border-2 border-white bg-white"
  //                   }`}
  //                   onClick={() => toggleHealthGoal(goal)}
  //                 >
  //                   <Checkbox
  //                     id={`goal-${goal}`}
  //                     checked={healthGoals.includes(goal)}
  //                     onCheckedChange={() => toggleHealthGoal(goal)}
  //                     className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                   />
  //                   <Label
  //                     htmlFor={`goal-${goal}`}
  //                     className="w-full cursor-pointer text-gray-700"
  //                   >
  //                     {goal}
  //                   </Label>
  //                 </div>
  //               ))}
  //             </div>
  //           </div> */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[5]?.type}
  //             questionKey={onboardingQuestions[5]?.key}
  //             question={onboardingQuestions[5]?.question}
  //             text={onboardingQuestions[5]?.text}
  //             options={onboardingQuestions[5]?.options || []}
  //             placeholder={onboardingQuestions[5]?.placeholder}
  //             setMultiSelect={(setValues: string[]) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[5].key]: setValues,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={healthGoals.length === 0}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Health Conditions Step */}
  //       {currentStep === "conditions" && (
  //         <div className="flex h-full flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="mb-2 text-2xl font-bold text-purple-900">
  //               Do you have any health conditions?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               Select all that apply to help us provide safer recommendations
  //             </p>
  //           </div>

  //           <div className="flex flex-1 flex-col overflow-y-auto">
  //             <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3">
  //               {HEALTH_CONDITIONS.map((condition) => (
  //                 <div
  //                   key={condition}
  //                   className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                     healthConditions.includes(condition)
  //                       ? "border-2 border-purple-500 bg-purple-100"
  //                       : "border-2 border-white bg-white"
  //                   }`}
  //                   onClick={() => toggleHealthCondition(condition)}
  //                 >
  //                   <Checkbox
  //                     id={`condition-${condition}`}
  //                     checked={healthConditions.includes(condition)}
  //                     onCheckedChange={() => toggleHealthCondition(condition)}
  //                     className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                   />
  //                   <Label
  //                     htmlFor={`condition-${condition}`}
  //                     className="w-full cursor-pointer text-gray-700"
  //                   >
  //                     {condition}
  //                   </Label>
  //                 </div>
  //               ))}

  //               <div
  //                 className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                   noneHealthCondition
  //                     ? "border-2 border-purple-500 bg-purple-100"
  //                     : "border-2 border-white bg-white"
  //                 }`}
  //                 onClick={() => {
  //                   setNoneHealthCondition(!noneHealthCondition);
  //                   if (!noneHealthCondition) {
  //                     setHealthConditions([]);
  //                   }
  //                 }}
  //               >
  //                 <Checkbox
  //                   id="condition-none"
  //                   checked={noneHealthCondition}
  //                   onCheckedChange={(checked) => {
  //                     setNoneHealthCondition(checked === true);
  //                     if (checked) {
  //                       setHealthConditions([]);
  //                     }
  //                   }}
  //                   className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                 />
  //                 <Label
  //                   htmlFor="condition-none"
  //                   className="w-full cursor-pointer font-medium text-gray-700"
  //                 >
  //                   None of these apply to me
  //                 </Label>
  //               </div>
  //             </div>
  //           </div> */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[6]?.type}
  //             questionKey={onboardingQuestions[6]?.key}
  //             question={onboardingQuestions[6]?.question}
  //             text={onboardingQuestions[6]?.text}
  //             options={onboardingQuestions[6]?.options || []}
  //             placeholder={onboardingQuestions[6]?.placeholder}
  //             setMultiSelect={(setValues: string[]) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[6].key]: setValues,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Life Stage Step */}
  //       {currentStep === "lifestage" && (
  //         <div className="flex h-full flex-col items-center">
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[7]?.type}
  //             questionKey={onboardingQuestions[7]?.key}
  //             question={onboardingQuestions[7]?.question}
  //             text={onboardingQuestions[7]?.text}
  //             setSingleSelect={(setValue: string | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[7].key]: setValue,
  //                 };
  //               });
  //             }}
  //             options={onboardingQuestions[7]?.options || []}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Symptoms Step */}
  //       {currentStep === "symptoms" && (
  //         <div className="flex flex-col items-center">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="mb-2 text-2xl font-bold text-purple-900">
  //               Have you experienced any of these symptoms?
  //             </h2>
  //             <p className="text-purple-800/80">
  //               In the past few months, select all that apply
  //             </p>
  //           </div>

  //           <div className="flex flex-1 flex-col overflow-y-auto">
  //             <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-3">
  //               {SYMPTOMS.map((symptom) => (
  //                 <div
  //                   key={symptom}
  //                   className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                     symptoms.includes(symptom)
  //                       ? "border-2 border-purple-500 bg-purple-100"
  //                       : "border-2 border-white bg-white"
  //                   }`}
  //                   onClick={() => toggleSymptom(symptom)}
  //                 >
  //                   <Checkbox
  //                     id={`symptom-${symptom}`}
  //                     checked={symptoms.includes(symptom)}
  //                     onCheckedChange={() => toggleSymptom(symptom)}
  //                     className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                   />
  //                   <Label
  //                     htmlFor={`symptom-${symptom}`}
  //                     className="w-full cursor-pointer text-gray-700"
  //                   >
  //                     {symptom}
  //                   </Label>
  //                 </div>
  //               ))}

  //               <div
  //                 className={`flex cursor-pointer items-center space-x-2 rounded-md px-3 py-2 transition-colors sm:px-4 sm:py-3 ${
  //                   noneSymptoms
  //                     ? "border-2 border-purple-500 bg-purple-100"
  //                     : "border-2 border-white bg-white"
  //                 }`}
  //                 onClick={() => {
  //                   setNoneSymptoms(!noneSymptoms);
  //                   if (!noneSymptoms) {
  //                     setSymptoms([]);
  //                   }
  //                 }}
  //               >
  //                 <Checkbox
  //                   id="symptom-none"
  //                   checked={noneSymptoms}
  //                   onCheckedChange={(checked) => {
  //                     setNoneSymptoms(checked === true);
  //                     if (checked) {
  //                       setSymptoms([]);
  //                     }
  //                   }}
  //                   className="h-4 w-4 data-[state=checked]:bg-purple-600 sm:h-5 sm:w-5"
  //                 />
  //                 <Label
  //                   htmlFor="symptom-none"
  //                   className="w-full cursor-pointer text-gray-700"
  //                 >
  //                   None of these apply to me
  //                 </Label>
  //               </div>
  //             </div>
  //           </div> */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[8]?.type}
  //             questionKey={onboardingQuestions[8]?.key}
  //             question={onboardingQuestions[8]?.question}
  //             text={onboardingQuestions[8]?.text}
  //             options={onboardingQuestions[8]?.options || []}
  //             placeholder={onboardingQuestions[8]?.placeholder}
  //             setMultiSelect={(setValues: string[]) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[8].key]: setValues,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* BMI Step */}
  //       {currentStep === "bmi" && (
  //         <div className="flex h-full flex-col items-center justify-center gap-6">
  //           {/* <div className="mb-6 text-center">
  //             <h2 className="mb-2 text-2xl font-bold text-purple-900">
  //               Let's calculate your BMI
  //             </h2>
  //             <p className="text-purple-800/80">
  //               This helps us personalize your fitness recommendations
  //             </p>
  //           </div>

  //           <div className="flex flex-1 flex-col justify-center">
  //             <div className="mx-auto w-full max-w-md space-y-6">
  //               <div className="space-y-2">
  //                 <Label
  //                   htmlFor="height"
  //                   className="font-medium text-purple-900"
  //                 >
  //                   Height (cm)
  //                 </Label>
  //                 <Input
  //                   id="height"
  //                   type="number"
  //                   placeholder="e.g., 165"
  //                   value={heightInput}
  //                   onChange={(e) => setHeightInput(e.target.value)}
  //                   className="w-full rounded-lg border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:ring-0"
  //                   min="100"
  //                   max="250"
  //                 />
  //               </div>
  //               <div className="space-y-2">
  //                 <Label
  //                   htmlFor="weight"
  //                   className="font-medium text-purple-900"
  //                 >
  //                   Weight (kg)
  //                 </Label>
  //                 <Input
  //                   id="weight"
  //                   type="number"
  //                   placeholder="e.g., 60"
  //                   value={weightInput}
  //                   onChange={(e) => setWeightInput(e.target.value)}
  //                   className="w-full rounded-lg border-2 border-purple-200 px-4 py-3 text-lg focus:border-purple-500 focus:ring-0"
  //                   min="30"
  //                   max="300"
  //                 />
  //               </div>

  //               {heightInput && weightInput && (
  //                 <div className="rounded-lg bg-purple-50 p-4 text-center">
  //                   <p className="text-lg font-medium text-purple-900">
  //                     Your BMI
  //                   </p>
  //                   <p className="text-3xl font-bold text-purple-600">
  //                     {(
  //                       parseInt(weightInput) /
  //                       Math.pow(parseInt(heightInput) / 100, 2)
  //                     ).toFixed(1)}
  //                   </p>
  //                   <p className="mt-1 text-sm text-purple-800/80">
  //                     {(() => {
  //                       const bmi =
  //                         parseInt(weightInput) /
  //                         Math.pow(parseInt(heightInput) / 100, 2);
  //                       if (bmi < 18.5) return "Underweight";
  //                       if (bmi < 25) return "Normal weight";
  //                       if (bmi < 30) return "Overweight";
  //                       return "Obese";
  //                     })()}
  //                   </p>
  //                 </div>
  //               )}
  //             </div>
  //           </div> */}
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[9]?.type}
  //             questionKey={onboardingQuestions[9]?.key}
  //             question={onboardingQuestions[9]?.question}
  //             text={onboardingQuestions[9]?.text}
  //             placeholder={onboardingQuestions[9]?.placeholder}
  //             label={onboardingQuestions[9]?.label}
  //             setDateInput={(setValue: Date | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[9].key]: setValue,
  //                 };
  //               });
  //             }}
  //           />
  //           <OnboardingQuestionCard
  //             type={onboardingQuestions[10]?.type}
  //             questionKey={onboardingQuestions[10]?.key}
  //             question={onboardingQuestions[10]?.question}
  //             // text={onboardingQuestions[10]?.text}
  //             placeholder={onboardingQuestions[10]?.placeholder}
  //             label={onboardingQuestions[10]?.label}
  //             setDateInput={(setValue: Date | undefined) => {
  //               setOnboardingAnswers((prev) => {
  //                 return {
  //                   ...prev,
  //                   [onboardingQuestions[10].key]: setValue,
  //                 };
  //               });
  //             }}
  //           />

  //           <div className="mt-auto space-y-3 pt-6">
  //             <Button
  //               className="gradient-primary w-full border border-white py-3 text-lg font-medium shadow-lg hover:opacity-90"
  //               onClick={goToNextStep}
  //               disabled={!heightInput || !weightInput}
  //             >
  //               Continue
  //             </Button>
  //             <Button
  //               variant="ghost"
  //               className="w-full py-2.5 text-purple-800 hover:bg-purple-50/50 hover:text-purple-900"
  //               onClick={skipStep}
  //             >
  //               Skip for now
  //             </Button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Completion Step */}
  //       {currentStep === "completion" && (
  //         <div className="flex h-full flex-col items-center justify-center space-y-8 py-6">
  //           <div className="rounded-full bg-purple-100 p-6">
  //             <CheckCircle className="h-16 w-16 text-purple-600" />
  //           </div>

  //           <div className="text-center">
  //             <h1 className="mb-3 text-3xl font-bold text-purple-900">
  //               You're all set!
  //             </h1>
  //             <p className="mb-8 max-w-md text-purple-800/80">
  //               We've personalized your fitness journey based on your
  //               information
  //             </p>
  //           </div>

  //           <div className="w-full max-w-md rounded-lg bg-purple-50 p-6">
  //             <h2 className="mb-4 text-xl font-bold text-purple-900">
  //               Your Cycle Information
  //             </h2>

  //             <div className="flex justify-between border-b border-purple-100 py-2">
  //               <span className="text-gray-700">Current Cycle Day:</span>
  //               <span className="font-semibold text-purple-900">
  //                 {cycleDay || "N/A"}
  //               </span>
  //             </div>

  //             <div className="flex justify-between py-2">
  //               <span className="text-gray-700">Current Phase:</span>
  //               <span className="font-semibold text-purple-900">
  //                 {cyclePhase || "Unknown"}
  //               </span>
  //             </div>
  //           </div>

  //           <Button
  //             className="gradient-primary mt-6 w-full max-w-md py-3 text-lg hover:opacity-90"
  //             onClick={handleSubmit}
  //             disabled={isPending}
  //           >
  //             {isPending ? (
  //               <>
  //                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
  //                 Saving...
  //               </>
  //             ) : (
  //               "Start Your Journey"
  //             )}
  //           </Button>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default OnboardingPage;
