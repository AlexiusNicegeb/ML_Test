import { useState } from "react";

type FeedbackItem = {
  line: number;
  message: string;
  rule: string;
  match: string;
  span: [number, number];
};

const mockFeedback: FeedbackItem[] = [
  {
    line: 1,
    message: "Avoid using 'actually'; consider 'truly' instead.",
    rule: "matura.custom-style",
    match: "actually",
    span: [9, 16],
  },
  {
    line: 1,
    message: "Avoid using 'really'; consider 'very' instead.",
    rule: "matura.custom-style",
    match: "really",
    span: [18, 23],
  },
];

export const useValeFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  const checkText = (text: string) => {
    // Here you can implement the logic to check the text with Vale
    setFeedback(mockFeedback);
  };

  return { feedback, checkText };
};
