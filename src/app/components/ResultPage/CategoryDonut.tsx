import { motion } from "framer-motion";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

interface DonutProps {
  title: string;
  score: number;
}

const COLORS = ["#3b82f6", "#e5e7eb"];

export const CategoryDonut = ({ title, score }: DonutProps) => {
  const maxScore = 25;
  const normalizedScore = Math.min((score / maxScore) * 100, 100);

  const data = [
    { name: "Erreicht", value: normalizedScore },
    { name: "Fehlt", value: 100 - normalizedScore },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/50 backdrop-blur-md border border-[#d0e7ff] rounded-2xl px-4 py-6 sm:px-2 sm:py-2 shadow-md w-full h-full flex flex-col items-center justify-center"
    >
      <div className="font-bold text-md sm:text-sm text-[#0f172a] mb-4 text-center">
        {title}
      </div>

      <div className="w-28 h-28 sm:scale-90 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={50}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
              <Label
                value={`${score}%`}
                position="center"
                fill="#1e3a8a"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
