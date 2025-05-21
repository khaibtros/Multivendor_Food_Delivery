import React from "react";
import CheckIcon from "../../../assets/icons/CheckIcon.svg";

interface TickProps {
  heading: string;
  text: string;
  toggleColor?: boolean;
}

const Tick: React.FC<TickProps> = ({ heading, text, toggleColor = false }) => {
  const color = toggleColor ? "white" : "#667085";
  const iconBg = toggleColor ? "white" : "#EFF9EA";
  const headingColor = toggleColor ? "white" : "black";

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
      <div
        style={{
          backgroundColor: iconBg,
          borderRadius: "50%",
          padding: 3,
          width: 24,
          height: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          marginTop: 4,
        }}
      >
        <img
          src={CheckIcon}
          alt="tick icon"
          style={{
            width: 14,
            height: 14,
            objectFit: "contain",
          }}
        />
      </div>

      <div style={{ lineHeight: "1.5", color }}>
        <span style={{ fontWeight: 600, color: headingColor }}>{heading}</span>{" "}
        <span style={{ fontWeight: 400 }}>{text}</span>
      </div>
    </div>
  );
};

export default Tick;
