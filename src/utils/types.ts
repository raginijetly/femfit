export interface OnboardingQuestionsType {
  key: string; // Unique identifier for the question
  stage: number; // Stage of the onboarding process (1, 2, or 3)
  priority: number; // Priority of the question to sort when in same stage
  type: "numberInput" | "date" | "singleSelect" | "multiSelect" | "bmi"; // Type of question
  question: string; // The question text to be displayed
  text?: string; // Additional text to be displayed below the question
  placeholder?: string; // Placeholder text for number input field
  label?: string; // Label for the input field, displayed above the input
  options?: {
    // Options for singleSelect or multiSelect questions
    value: string; // The value of the option
    title: string; // The title of the option to be displayed
    text?: string; // Additional text for the option, displayed below the title
  }[];
  answer?: number | string | string[] | Date | undefined; // The answer to the question, can be number, string, array of strings, or date
}

export interface OnboardingAnswersType {
  age?: number;
  lastPeriod?: string | "idk";
  regularPeriod?: "yes" | "no" | "idk";
  currentFitnessLevel?:
    | "justStarting"
    | "gettingBack"
    | "alreadyActive"
    | "veryExperienced";
  dietaryPreferences?: string[];
  healthGoals?: string[];
  healthConditions?: string[];
  lifeStages?: "prenatal" | "postpartum" | "menopause" | "none";
  symptoms?: string[];
  bmi?: number;
}

export interface UserType {
  id: string;
  fullName: string;
  email: string;
  completedOnboarding: boolean;
  onboardingAnswers: OnboardingAnswersType;
  dailyMood: { date: string; mood: string }[];
}

export interface UserInfoType {
  cycleDay: number;
  cyclePhase:
    | "menstruation"
    | "follicular"
    | "ovulation"
    | "luteal"
    | "unknown";
  nextPhaseIn: number; // -1 => unknown
  cyclePercentage: number;
  cycleLength: number; // default 28
}
