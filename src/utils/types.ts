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
  answer?: number | string | string[] | undefined; // The answer to the question, can be number, string, array of strings, or date
}

export interface OnboardingAnswersType {
  age?: number;
  lastPeriod?: string;
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
  cyclePhase: CyclePhaseType;
  nextPhaseIn: number; // -1 => unknown
  cyclePercentage: number;
  cycleLength: number; // default 28
}

export interface PerDayCycleDataType {
  name: string;
  overview: string;
  description: string;
  superpower: string;
  fact: string;
  estrogen: { percentage: number; notes: string };
  progesterone: { percentage: number; notes: string };
  testosterone: { percentage: number; notes: string };
}

export interface PerDayCycleDataObjType {
  [key: number]: PerDayCycleDataType; // Key is the cycle day as a number
}

/**
 * A lookup object for consistent naming of menstrual cycle phases.
 * Using "as const" makes the object readonly and its properties literal types,
 * which is excellent for type safety and autocompletion.
 */
export const CYCLE_PHASES = {
  MENSTRUAL: "Menstrual",
  FOLLICULAR: "Follicular",
  OVULATORY: "Ovulatory",
  LUTEAL: "Luteal",
  PRE_MENSTRUAL: "Pre-Menstrual",
  AWAITING_CYCLE_START: "Awaiting Cycle Start",
} as const;

/**
 * To make it easy to use these values as a type in your application,
 * you can derive a type directly from the object's values.
 *
 * This type will be a union of all possible phase names:
 * "Menstrual" | "Follicular" | "Ovulatory" | "Luteal" | "Pre-Menstrual" | "Awaiting Cycle Start"
 */
export type CyclePhaseType = (typeof CYCLE_PHASES)[keyof typeof CYCLE_PHASES];

// The return type for our function: an object with string keys and string values.
export type FormattedAnswers = Record<string, string>;
