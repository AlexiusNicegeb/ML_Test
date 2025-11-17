"use client";

import { createContext, useContext, useState } from "react";

export type ValeFeedback = {
  id: number;
  line: number;
  message: string;
  rule: string;
  match: string;
  span: [number, number];
};

type ValeContextType = {
  feedbacks: ValeFeedback[];
  setFeedbacks: (f: ValeFeedback[]) => void;
  showErrors: boolean;
  setShowErrors: (s: boolean) => void;
};

const ValeContext = createContext<ValeContextType | null>(null);

export const useVale = () => {
  const ctx = useContext(ValeContext);
  if (!ctx) throw new Error("useVale must be used inside ValeProvider");
  return ctx;
};

export const ValeProvider = ({ children }: { children: React.ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<ValeFeedback[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  return (
    <ValeContext.Provider
      value={{
        feedbacks,
        setFeedbacks,
        showErrors,
        setShowErrors,
      }}
    >
      {children}
    </ValeContext.Provider>
  );
};
