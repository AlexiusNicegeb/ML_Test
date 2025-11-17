import { useEffect, useState } from "react";

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  );

  useEffect(() => {
    // Set current path
    setCurrentPath(window.location.pathname);
  }, []);

  return currentPath;
};
