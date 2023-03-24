import React from "react";

function CloseCrossIcon({ fill = '#EB8B76', ...props }) {
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
                d="M18.3 5.709a.996.996 0 00-1.41 0L12 10.589l-4.89-4.89a.996.996 0 10-1.41 1.41l4.89 4.89-4.89 4.89a.996.996 0 101.41 1.41l4.89-4.89 4.89 4.89a.996.996 0 101.41-1.41l-4.89-4.89 4.89-4.89c.38-.38.38-1.02 0-1.4z"
                {...props}
            ></path>
        </svg>
    );
}

export default CloseCrossIcon;