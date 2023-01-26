import * as React from "react"

const SvgComponent = ({ fill = "#27BEC2", ...props }) => (
    <svg
        width={24}
        height={25}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect y={0.699} width={24} height={24} rx={12} fill="#F7F4F4" />
        <path
            d="M18.299 6.408a.996.996 0 0 0-1.41 0l-4.89 4.88-4.89-4.89a.996.996 0 1 0-1.41 1.41l4.89 4.89-4.89 4.89a.996.996 0 1 0 1.41 1.41l4.89-4.89 4.89 4.89a.996.996 0 1 0 1.41-1.41l-4.89-4.89 4.89-4.89c.38-.38.38-1.02 0-1.4Z"
            fill={fill}
        />
    </svg>
)

export default SvgComponent