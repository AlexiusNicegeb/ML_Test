import { useEffect, useMemo } from "react";
import { useTransitionState } from "react-transition-state";

interface TransitionElementProps {
  id?: string;
  children: React.ReactNode;
  duration: number;
  show: boolean;
}

export const TransitionElement = ({
  id,
  children,
  duration,
  show,
}: TransitionElementProps) => {
  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: duration,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });

  useEffect(() => {
    setTimeout(() => {
      toggle(show);
    }, 0);
  }, [show]);

  const getStyle = useMemo(() => {
    if (status === "preEnter" || status === "entering") {
      return {
        position: "absolute" as const,
        top: 0,
        transform: "scale(0.9)",
        opacity: 0,
        transition: `all ${duration}ms ease-in-out`,
      };
    }

    if (status === "exiting") {
      return {
        transform: "scale(1.1)",
        opacity: 0,
        transition: `all ${duration}ms ease-in-out`,
      };
    }

    return {
      transition: `all ${duration}ms ease-in-out`,
    };
  }, [status, duration]);

  return (
    isMounted && (
      <div id={id} style={getStyle}>
        {children}
      </div>
    )
  );
};
