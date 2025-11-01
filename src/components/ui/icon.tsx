import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Icon component that accepts SVG content as children
 */
export const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  className,
  width,
  height,
}) => {
  return (
    <span
      className={className}
      style={{
        width: width || "1rem",
        height: height || "1rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
};

/**
 * AskAI Icon
 */
export const AskAIIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.54455 9.38219C1.39224 8.79633 0.816083 8.5034 0.76467 8.27359C0.74526 8.18682 0.74526 8.14204 0.76467 8.05527C0.816083 7.82545 1.39224 7.53253 2.54455 6.94667C4.52624 5.93914 5.93926 4.52612 6.94679 2.54443C7.53265 1.39212 7.82558 0.815961 8.05539 0.764549C8.14216 0.745138 8.18694 0.745138 8.27371 0.764549C8.50352 0.815961 8.79645 1.39212 9.38231 2.54442C10.3898 4.52612 11.8029 5.93914 13.7846 6.94667C14.9369 7.53253 15.513 7.82545 15.5644 8.05527C15.5838 8.14204 15.5838 8.18682 15.5644 8.27359C15.513 8.5034 14.9369 8.79633 13.7846 9.38219C11.8029 10.3897 10.3898 11.8027 9.38231 13.7844C8.79645 14.9367 8.50352 15.5129 8.27371 15.5643C8.18694 15.5837 8.14216 15.5837 8.05539 15.5643C7.82558 15.5129 7.53265 14.9367 6.94679 13.7844C5.93926 11.8027 4.52624 10.3897 2.54455 9.38219Z"
        fill="#D8D8E1"
        stroke="#363447"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);

/**
 * MakeResearch Icon
 */
export const MakeResearchIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.75 8.13366C0.75 12.2115 4.05538 15.5173 8.13277 15.5173C10.1718 15.5173 12.0179 14.6906 13.3539 13.3539C14.6895 12.0178 15.5155 10.1722 15.5155 8.13366C15.5155 4.05578 12.2102 0.75 8.13277 0.75C4.05538 0.75 0.75 4.05578 0.75 8.13366Z"
        fill="#B4D8FF"
      />
      <path
        d="M16.75 16.75L13.3539 13.3539M13.3539 13.3539C14.6895 12.0178 15.5155 10.1722 15.5155 8.13366C15.5155 4.05578 12.2102 0.75 8.13277 0.75C4.05538 0.75 0.75 4.05578 0.75 8.13366C0.75 12.2115 4.05538 15.5173 8.13277 15.5173C10.1718 15.5173 12.0179 14.6906 13.3539 13.3539Z"
        stroke="#5E52C6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </Icon>
);

/**
 * TodoList Icon
 */
export const TodoListIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.55 0.75H7.95C4.95021 0.75 3.45032 0.75 2.39886 1.51393C2.05928 1.76065 1.76065 2.05928 1.51393 2.39886C0.75 3.45032 0.75 4.95021 0.75 7.95V9.55C0.75 12.5498 0.75 14.0497 1.51393 15.1011C1.76065 15.4407 2.05928 15.7393 2.39886 15.9861C3.45032 16.75 4.95021 16.75 7.95 16.75H9.55C12.5498 16.75 14.0497 16.75 15.1011 15.9861C15.4407 15.7393 15.7393 15.4407 15.9861 15.1011C16.75 14.0497 16.75 12.5498 16.75 9.55V7.95C16.75 4.95021 16.75 3.45032 15.9861 2.39886C15.7393 2.05928 15.4407 1.76065 15.1011 1.51393C14.0497 0.75 12.5498 0.75 9.55 0.75Z"
        fill="#FFDBA1"
      />
      <path
        d="M5.75 8.75L7.75 10.75L11.75 6.75M7.95 16.75H9.55C12.5498 16.75 14.0497 16.75 15.1011 15.9861C15.4407 15.7393 15.7393 15.4407 15.9861 15.1011C16.75 14.0497 16.75 12.5498 16.75 9.55V7.95C16.75 4.95021 16.75 3.45032 15.9861 2.39886C15.7393 2.05928 15.4407 1.76065 15.1011 1.51393C14.0497 0.75 12.5498 0.75 9.55 0.75H7.95C4.95021 0.75 3.45032 0.75 2.39886 1.51393C2.05928 1.76065 1.76065 2.05928 1.51393 2.39886C0.75 3.45032 0.75 4.95021 0.75 7.95V9.55C0.75 12.5498 0.75 14.0497 1.51393 15.1011C1.76065 15.4407 2.05928 15.7393 2.39886 15.9861C3.45032 16.75 4.95021 16.75 7.95 16.75Z"
        stroke="#8F7448"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);

/**
 * Templates Icon
 */
export const TemplatesIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="21"
      height="18"
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.25 3.75C11.0784 3.75 11.75 3.07843 11.75 2.25C11.75 1.42157 11.0784 0.75 10.25 0.75C9.42157 0.75 8.75 1.42157 8.75 2.25C8.75 3.07843 9.42157 3.75 10.25 3.75ZM10.25 3.75C14.6683 3.75 18.25 7.33172 18.25 11.75V12.75H2.25V11.75C2.25 7.33172 5.83172 3.75 10.25 3.75ZM17.75 12.75H2.75M17.75 12.75H2.75M17.75 12.75C18.8546 12.75 19.75 13.6454 19.75 14.75C19.75 15.8546 18.8546 16.75 17.75 16.75H2.75C1.64543 16.75 0.75 15.8546 0.75 14.75C0.75 13.6454 1.64543 12.75 2.75 12.75"
        stroke="#363447"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);

/**
 * Import Icon
 */
export const ImportIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.750001 6.75L0.750001 3.75C0.750001 2.09314 2.09315 0.749999 3.75 0.749999L11.75 0.75C13.4069 0.75 14.75 2.09315 14.75 3.75L14.75 6.75M7.75 5.75L7.75 14.75M7.75 14.75L10.75 11.75M7.75 14.75L4.75 11.75"
        stroke="#363447"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);

/**
 * ImportImage Icon
 */
export const ImportImageIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
  width,
  height,
}) => (
  <Icon className={className} width={width} height={height}>
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.75 7.75V9.26429C18.75 10.6465 18.75 11.3376 18.581 11.9004C18.1945 13.1875 17.1875 14.1945 15.9004 14.581C15.3376 14.75 14.6465 14.75 13.2643 14.75C13.1283 14.75 13.0603 14.75 12.9965 14.7611C12.8519 14.7862 12.7179 14.8533 12.611 14.9538C12.5638 14.9982 12.523 15.0526 12.4414 15.1614L12.4414 15.1614L11.91 15.87C11.0366 17.0345 10.6 17.6167 10.0266 17.7243C9.84379 17.7586 9.65621 17.7586 9.4734 17.7243C8.90003 17.6167 8.46335 17.0345 7.59 15.87L7.05857 15.1614L7.05856 15.1614C6.97696 15.0526 6.93615 14.9982 6.88901 14.9538C6.78214 14.8533 6.64811 14.7862 6.50352 14.7611C6.43974 14.75 6.37173 14.75 6.23571 14.75C4.8535 14.75 4.16239 14.75 3.5996 14.581C2.3125 14.1945 1.3055 13.1875 0.918997 11.9004C0.75 11.3376 0.75 10.6465 0.75 9.26429V7.75C0.75 4.94108 0.75 3.53661 1.42412 2.52772C1.71596 2.09096 2.09096 1.71596 2.52772 1.42412C3.53661 0.75 4.94108 0.75 7.75 0.75H11.75C14.5589 0.75 15.9634 0.75 16.9723 1.42412C17.409 1.71596 17.784 2.09096 18.0759 2.52772C18.75 3.53661 18.75 4.94108 18.75 7.75Z"
        fill="white"
        stroke="#363447"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </Icon>
);
