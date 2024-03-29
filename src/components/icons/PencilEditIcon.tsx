import React from "react";

function PencilEditIcon({fill='#27BEC2', ...props}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={fill}
        d="M3 17.459v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15l10.92-10.91-3.75-3.75-10.91 10.91c-.1.1-.15.22-.15.36zm17.71-10.42a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
      ></path>
    </svg>
  );
}

export default PencilEditIcon;
