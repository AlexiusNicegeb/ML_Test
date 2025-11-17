export const StepSection = ({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="bg-white text-blue-500 font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full shadow-inner">
        {number}
      </div>
      <h3 className="text-xl font-bold text-[#003366]">{title}</h3>
    </div>
    {children}
  </div>
);
