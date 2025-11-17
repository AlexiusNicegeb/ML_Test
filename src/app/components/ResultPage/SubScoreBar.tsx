export interface SubScore {
  label: string;
  value: number;
}

export const SubScoreBar = ({ label, value }: SubScore) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <div className="w-full">
      <div className="text-slate-700 font-medium mb-1">{label}</div>
      <div className="bg-slate-200 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
    <div className="min-w-[40px] text-slate-600 font-semibold">{value}%</div>
  </div>
);
