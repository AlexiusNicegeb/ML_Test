interface PlayIconProps {
  height: string;
  width: string;
  showHide?: string;
}

export const PlayIcon = ({ height, width, showHide }: PlayIconProps) => {
  return (
    <svg
      height={height}
      version="1.1"
      viewBox="0 0 24 32"
      width={width}
      style={{ display: showHide }}
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Layer_1" />
      <g id="play">
        <polygon
          points="0,0 24,16 0,32"
          style={{ fill: "#18A1F7" }}
        />
      </g>
    </svg>
  );
};
