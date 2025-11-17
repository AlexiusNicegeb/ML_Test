import { useEffect } from "react";

export const useOutsideClick = (callback: () => void, refs: any[]) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        refs.some((r) => {
          return event.composedPath().some((p) => p === r.current);
        })
      ) {
        return;
      }
      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, callback]);
};
