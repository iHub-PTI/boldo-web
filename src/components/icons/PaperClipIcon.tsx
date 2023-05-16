import * as React from "react"
const PaperClipIcon = ({ stroke = "#364152", width = 19, height = 20, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#364152"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m12.171 5-6.585 6.586a2 2 0 1 0 2.828 2.828l6.414-6.586a4 4 0 0 0-5.656-5.656L2.757 8.757a6 6 0 0 0 8.486 8.486L17.5 11"
    />
  </svg>
)
export default PaperClipIcon
