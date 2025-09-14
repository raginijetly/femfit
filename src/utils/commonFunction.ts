import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import type { FormattedAnswers, OnboardingQuestionsType } from "./types";

export async function fetchData(
  type: "get" | "post" | "put",
  url: string,
  data?: any,
  headers?: Record<string, string>,
) {
  try {
    const response = await axios({
      method: type,
      url: url,
      data: type !== "get" && data ? data : undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` || "",
        ...(headers ?? {}),
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Checks if a string is a valid ISO 8601 date format.
 * * @param {string} dateString The string to validate.
 * @returns {boolean} True if the string is a valid date, false otherwise.
 */
export function isValidISOString(dateString: string): boolean {
  // 1. Check if the input is actually a string and not empty
  if (typeof dateString !== "string" || !dateString) {
    return false;
  }

  // 2. parseISO attempts to convert the ISO string into a Date object.
  const date = parseISO(dateString);

  // 3. isValid checks if the resulting object is a valid, logical date.
  return isValid(date);
}

/**
 * Parses the raw onboarding answers into a formatted, human-readable object.
 * @param {OnboardingQuestionsType[]} questions - The array of typed question objects.
 * @returns {FormattedAnswers} An object with question keys and formatted answers.
 */
export function parseOnboardingAnswers(
  questions: OnboardingQuestionsType[],
): FormattedAnswers {
  return questions.reduce<FormattedAnswers>((acc, question) => {
    const { key, type, answer, options } = question;

    // Skip if there's no answer.
    if (!answer) {
      return acc;
    }

    switch (type) {
      case "date":
        if (typeof answer === "string" && isValidISOString(answer))
          acc[key] = format(parseISO(answer), "dd/MM/yyyy");
        break;

      case "numberInput":
      case "bmi":
        acc[key] = String(answer);
        break;

      case "singleSelect":
        if (!!options) {
          const selectedOption = options.find((opt) => opt.value === answer);
          acc[key] = selectedOption?.title ?? "";
        }
        break;

      case "multiSelect":
        if (Array.isArray(answer) && options) {
          const parsedValues = answer
            .map((value) => {
              if (value === "other") return null;
              const selectedOption = options.find((opt) => opt.value === value);
              return selectedOption ? selectedOption.title : value;
            })
            .filter(Boolean);

          acc[key] = parsedValues.join(", ");
        }
        break;
    }

    return acc;
  }, {});
}

export function getOthersAnswer(
  options?: { value: string; title: string; text?: string }[],
  answer?: number | string | string[],
): string {
  if (!options || !answer) return "";

  const validValues = new Set(options.map((opt) => opt.value));

  const answerArray: string[] =
    typeof answer === "string"
      ? [answer]
      : Array.isArray(answer)
        ? answer
        : [answer.toString()]; // handle number

  return answerArray.filter((ans) => !validValues.has(ans))[0] || "";
}

