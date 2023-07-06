import * as React from "react";

/**
 * LabIcon Component
 * 
 * This component displays a lab icon in an SVG format. It allows customization of the color, hover behavior, width, height, and other props.
 *
 * @param {string} color - The color of the icon in hexadecimal format. Default: '#364152'
 * @param {boolean} hoverDarkMode - Determines whether the icon should change color on hover when in dark mode. Default: false
 * @param {number} width - The width of the SVG icon. Default: 36
 * @param {number} height - The height of the SVG icon. Default: 36
 * @param {object} props - Additional props to be passed to the SVG element
 *
 * @returns {JSX.Element} LabIcon component
 */

const LabIcon = ({ fill = '#364152', hoverDarkMode = false, width = 36, height = 36, ...props }) => {

  const styleDarkMode = `
    .group:hover .fill-color {
      fill: ${fill}
    }
    .fill-color {
      fill: #ffffff;
    }
  `

  const styleColor = `.fill-color {
    fill: ${fill}
    }
  `

  const style = hoverDarkMode ? styleDarkMode : styleColor

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      width={width}
      height={height}
      {...props}
    >
      <style>
        {style}
      </style>
      <path
        className="fill-color"
        fillRule="evenodd"
        d="M3 0a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3Zm11.8 10h7.4v1c0 .286.223.721.65 1.204a6.096 6.096 0 0 0 .744.706l.008.006.398.3V15h-2v-.82a8.019 8.019 0 0 1-.65-.652c-.317-.359-.727-.892-.962-1.528h-3.843c-.052.11-.106.21-.157.3-.205.36-.465.716-.706 1.02-.244.306-.485.579-.664.774l-.018.02V25.5a3.5 3.5 0 0 0 6.663 1.5h2.13A5.5 5.5 0 0 1 13 25.5V13.302l.29-.293.003-.002.012-.013.051-.052a12.713 12.713 0 0 0 .761-.868c.21-.263.4-.529.532-.762.103-.182.136-.282.146-.313.003-.008.004-.012.005-.011v.005V10ZM26 22.09c0 1.608-1.343 2.91-3 2.91s-3-1.302-3-2.91c0-2.544 3-5.09 3-5.09s3 2.546 3 5.09ZM23 4h-9v4h9V4Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default LabIcon;
