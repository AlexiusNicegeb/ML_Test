import { useEffect } from "react";

let timeout: NodeJS.Timeout;

export const useDelayed = (
  field: string,
  onChanged: () => void,
  originalValue?: string
) => {
  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (field && field !== originalValue) {
        onChanged();
      }
    }, 500);
  }, [field]);
};
