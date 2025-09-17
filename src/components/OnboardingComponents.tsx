import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

const OnboardingQuestionCard: React.FC<{
  type: "numberInput" | "date" | "singleSelect" | "multiSelect" | "bmi";
  questionKey?: string;
  question: string;
  text?: string;
  placeholder?: string;
  label?: string;
  options?: { value: string; title: string; text?: string }[];
  answer?: string | string[] | number;
  otherTextAnswer?: string;
  setNumberInput?: (value: number | undefined) => void;
  setDateInput?: (value: Date | undefined) => void;
  setSingleSelect?: (value: string) => void;
  setMultiSelect?: (value: string[]) => void;
  setBmiInput?: (value: number) => void;
}> = (props) => {
  switch (props.type) {
    case "numberInput":
      return (
        <OnboardingQuestionWraper question={props.question} text={props?.text}>
          <NumberInputCard
            questionKey={props.questionKey ?? "number-input"}
            placeholder={props?.placeholder}
            label={props?.label}
            answer={props?.answer ? Number(props.answer) : undefined}
            setNumberInput={props?.setNumberInput}
          />
        </OnboardingQuestionWraper>
      );
    case "date":
      return (
        <OnboardingQuestionWraper question={props.question} text={props?.text}>
          <DateCard
            setDateInput={props?.setDateInput}
            placeholder={props?.placeholder}
            answer={props?.answer ? (props.answer as string) : undefined}
          />
        </OnboardingQuestionWraper>
      );
    case "singleSelect":
      return (
        <OnboardingQuestionWraper question={props.question} text={props?.text}>
          <SingleSelectCard
            options={props?.options ?? [{ value: "", title: "" }]}
            setSingleSelect={props?.setSingleSelect}
            answer={props?.answer ? String(props.answer) : undefined}
          />
        </OnboardingQuestionWraper>
      );
    case "multiSelect":
      return (
        <OnboardingQuestionWraper question={props.question} text={props?.text}>
          <MultiSelectCard
            options={props?.options ?? [{ value: "", title: "" }]}
            placeholder={props?.placeholder}
            setMultiSelect={props?.setMultiSelect}
            otherTextAnswer={props?.otherTextAnswer}
            answer={
              Array.isArray(props?.answer)
                ? props.answer
                : props?.answer
                  ? [String(props.answer)]
                  : []
            }
          />
        </OnboardingQuestionWraper>
      );
    case "bmi":
      return (
        <OnboardingQuestionWraper question={props.question} text={props?.text}>
          <BmiCard
            questionKey={props.questionKey ?? "bmi-input"}
            options={props?.options ?? [{ value: "", title: "" }]}
            setBmiInput={props?.setBmiInput}
          />
        </OnboardingQuestionWraper>
      );
    default:
      return null;
  }
};

const OnboardingQuestionWraper: React.FC<{
  question: string;
  text?: string;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded-md p-3 text-center sm:w-[500px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-purple-700">{props.question}</h2>
        {props?.text && (
          <p className="text-sm text-purple-700/80">{props.text}</p>
        )}
      </div>
      {props.children}
    </div>
  );
};

const NumberInputCard: React.FC<{
  answer?: number;
  questionKey: string;
  placeholder?: string;
  label?: string;
  setNumberInput?: (value: number | undefined) => void;
}> = (props) => {
  const [num, setNum] = useState<number | undefined>(
    props?.answer ? props.answer : undefined,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center">
      {props?.label && (
        <Label
          htmlFor={props.questionKey + "-number-input"}
          className="text-brand-dark min-h-5 self-start font-semibold"
        >
          {props.label}
        </Label>
      )}
      <Input
        id={props.questionKey + "-number-input"}
        type="number"
        value={num ?? ""}
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          setNum(Number.isNaN(value) ? undefined : value);
          if (props?.setNumberInput)
            props.setNumberInput(Number.isNaN(value) ? undefined : value);
        }}
        placeholder={props?.placeholder}
        className="text-brand-dark shadow-brand-text-brand-dark/25 placeholder:text-brand-dark/50 border-2 border-white bg-white py-6 text-center text-lg shadow-md"
        min={13}
        max={100}
        ref={inputRef}
      />
    </div>
  );
};

const DateCard: React.FC<{
  placeholder?: string;
  answer?: string;
  setDateInput?: (value: Date | undefined) => void;
}> = (props) => {
  const [dateVal, setDateVal] = useState<Date | undefined>(
    props?.answer ? new Date(props.answer) : undefined,
  );
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-4">
          <div className="flex w-full justify-center">
            <Calendar
              mode="single"
              selected={dateVal}
              onSelect={(date) => {
                setDateVal(date);
                if (props?.setDateInput) props.setDateInput(date);
              }}
              className="w-full"
              styles={{
                root: { width: "100%", color: "#6b21a8" },
                month: { width: "100%" },
                table: { width: "100%" },
              }}
              disabled={(date) => date > new Date()}
            />
          </div>

          {/* {dateVal && (
            <p className="py-2 text-center text-lg font-semibold text-purple-700">
              Selected: {format(dateVal, "MMMM d, yyyy")}
            </p>
          )} */}

          {props?.placeholder && (
            <p className="mt-5 rounded-lg border-2 border-purple-700/50 p-2 text-center text-sm text-purple-700">
              {props.placeholder}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const SingleSelectCard: React.FC<{
  options: { value: string; title: string; text?: string }[];
  answer?: string;
  setSingleSelect?: (value: string) => void;
}> = (props) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    props?.answer
      ? props.options.findIndex((item) => item.value === props.answer)
      : undefined,
  );
  return props.options.map((item, index) => {
    return (
      <div
        key={index}
        className={`flex w-full max-w-md cursor-pointer flex-col gap-1 rounded-lg border-2 px-4 py-3 text-left text-black transition-all duration-500 ease-out ${
          selectedOption === index
            ? "border-purple-700 bg-purple-200 text-purple-700 shadow-md shadow-purple-700/50"
            : "border-white bg-white shadow-md shadow-white/25"
        }`}
        onClick={() => {
          if (selectedOption === index) {
            setSelectedOption(undefined);
            if (props?.setSingleSelect) {
              props.setSingleSelect("");
            }
          } else {
            setSelectedOption(index);
            if (props?.setSingleSelect) {
              props.setSingleSelect(item.value);
            }
          }
        }}
      >
        <p
          className={`text-[14px] font-semibold ${item?.text && "text-black"}`}
        >
          {item.title}
        </p>
        {selectedOption === index && item?.text && (
          <p className="text-xs">{item.text}</p>
        )}
      </div>
    );
  });
};

const MultiSelectCard: React.FC<{
  options: { value: string; title: string; text?: string }[];
  placeholder?: string;
  answer?: string[];
  otherTextAnswer?: string;
  setMultiSelect?: (value: string[]) => void;
}> = (props) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    props?.answer || [],
  );
  const toggleSelectedOption = (option: string) => {
    setSelectedOptions((prev) => {
      const selected = prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];

      if (option === "none") {
        if (props?.setMultiSelect) {
          props.setMultiSelect(prev.includes("none") ? [] : ["none"]);
        }
        return prev.includes("none") ? [] : ["none"];
      }

      if (option === "other") {
        setOtherText("");
        if (selected.includes("other") && !otherText) selected.push("");
        else selected.splice(selected.indexOf(""), 1);
      }

      if (props?.setMultiSelect) {
        props.setMultiSelect(selected.filter((item) => item !== "none"));
      }
      return selected.filter((item) => item !== "none");
    });
  };
  const [otherText, setOtherText] = useState<string>(
    props?.otherTextAnswer ?? "",
  );
  const otherInputRef = useRef<HTMLInputElement>(null);
  console.log("Selected Options:", selectedOptions);
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 overflow-y-auto">
      {props.options.map((item) => (
        <div
          key={item.value}
          className={`flex w-full max-w-md cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-black transition-all duration-500 ease-out ${
            selectedOptions.includes(item.value)
              ? "border-purple-700 bg-purple-200 text-purple-700 shadow-md shadow-purple-700/50"
              : "border-white bg-white shadow-md shadow-white/25"
          }`}
          onClick={() => toggleSelectedOption(item.value)}
        >
          <Checkbox
            checked={selectedOptions.includes(item.value)}
            className="size-5 border-2 border-purple-700 text-white data-[state=checked]:bg-purple-700 sm:h-5 sm:w-5"
          />
          <p className="pl-3 text-left font-semibold select-none">
            {item.title}
          </p>
        </div>
      ))}

      {selectedOptions.includes("other") && (
        <Input
          ref={otherInputRef}
          placeholder={props?.placeholder || "Write more things here..."}
          value={otherText}
          onChange={(e) => {
            setOtherText(e.target.value);
            if (props?.setMultiSelect) {
              props.setMultiSelect(
                selectedOptions.includes(otherText)
                  ? selectedOptions.map((item) =>
                      item === otherText ? e.target.value : item,
                    )
                  : [...selectedOptions, e.target.value],
              );
              setSelectedOptions((prev) =>
                prev.includes(otherText)
                  ? prev.map((item) =>
                      item === otherText ? e.target.value : item,
                    )
                  : [...prev, e.target.value],
              );
            }
          }}
          className="w-full border-2 border-purple-700 bg-white px-3 py-5 text-xs text-purple-700 placeholder-purple-700 select-none"
        />
      )}
    </div>
  );
};

const BmiCard: React.FC<{
  questionKey: string;
  options: { value: string; title: string; text?: string }[];
  setBmiInput?: (value: number) => void;
}> = (props) => {
  const [heightInput, setHeightInput] = useState<number | undefined>(undefined);
  const [weightInput, setWeightInput] = useState<number | undefined>(undefined);
  const [bmi, setBmi] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!heightInput || !weightInput) return undefined;
    setBmi(+(weightInput / Math.pow(heightInput / 100, 2)).toFixed(1));

    if (props?.setBmiInput) {
      props.setBmiInput(
        +(weightInput / Math.pow(heightInput / 100, 2)).toFixed(1),
      );
    }
  }, [heightInput, weightInput]);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2">
          {props?.options?.[0]?.title && (
            <Label
              htmlFor={props.questionKey + "-bmi-" + props.options[0].value}
              className="min-h-5 self-start text-purple-700"
            >
              {props.options[0].title}
            </Label>
          )}
          <Input
            id={props.questionKey + "-bmi-" + props.options[0].value}
            type="number"
            placeholder={props?.options[0]?.text}
            value={heightInput ?? ""}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              setHeightInput(Number.isNaN(value) ? undefined : value);
            }}
            className="shadow-brand-text-brand-dark/25 placeholder:text-brand-dark/50 border-2 border-white bg-white py-6 text-left text-lg text-purple-700 shadow-md"
            min="100"
            max="250"
          />
        </div>
        <div className="space-y-2">
          {props?.options?.[1]?.title && (
            <Label
              htmlFor={props.questionKey + "-bmi-" + props.options[1].value}
              className="min-h-5 self-start text-purple-700"
            >
              {props.options[1].title}
            </Label>
          )}
          <Input
            id={props.questionKey + "-bmi-" + props.options[1].value}
            type="number"
            placeholder={props?.options[1]?.text}
            value={weightInput}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              setWeightInput(Number.isNaN(value) ? undefined : value);
            }}
            className="shadow-brand-text-brand-dark/25 placeholder:text-brand-dark/50 border-2 border-white bg-white py-6 text-left text-lg text-purple-700 shadow-md"
            min="30"
            max="300"
          />
        </div>

        {heightInput && weightInput && (
          <div className="rounded-lg bg-purple-50 p-4 text-center">
            <p className="text-brand-dark text-lg font-medium">Your BMI</p>
            <p className="text-3xl font-bold text-purple-700">{bmi}</p>
            <p className="text-brand-dark/80 mt-1 text-sm">
              {(() => {
                const bmi = weightInput / Math.pow(heightInput / 100, 2);
                if (bmi < 18.5) return "Underweight";
                if (bmi < 25) return "Normal weight";
                if (bmi < 30) return "Overweight";
                return "Obese";
              })()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { OnboardingQuestionCard };
