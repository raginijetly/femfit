const Numbering: React.FC<{
  number: number;
  classname?: string;
  fontColor?: string;
  bgColor?: string;
}> = (props) => {
  return (
    <span
      className={`flex size-6 items-center justify-center rounded-full ${props?.bgColor ?? "bg-purple-500"} text-xs font-bold ${props?.fontColor ?? "text-white"} ${props?.classname || ""}`}
    >
      {props.number}
    </span>
  );
};

export default Numbering;
