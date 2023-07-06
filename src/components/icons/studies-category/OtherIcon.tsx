import * as React from "react";

/**
 * OtherIcon Component
 *
 * This component displays another type of icon in SVG format. It allows customization of the fill color, width, height, and other props.
 * It also supports a hoverDarkMode, which changes the fill color on hover.
 *
 * @param {string} fill - The fill color of the icon in hexadecimal format. Default: '#364152'
 * @param {boolean} hoverDarkMode - Determines if the hover dark mode is enabled. Default: false
 * @param {number} width - The width of the SVG icon. Default: 36
 * @param {number} height - The height of the SVG icon. Default: 36
 * @param {object} props - Additional props to be passed to the SVG element
 *
 * @returns {JSX.Element} OtherIcon component
 */
const OtherIcon = ({ fill = '#364152', hoverDarkMode = false, width = 36, height = 36, ...props }) => {
  const styleDarkMode = `
    .group:hover .fill-color {
      fill: ${fill};
    }
    .fill-color {
      fill: #ffffff;
    }
  `;

  const styleColor = `.fill-color {
    fill: ${fill};
  }`;

  const style = hoverDarkMode ? styleDarkMode : styleColor;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <style>{style}</style>
      <path
        className="fill-color"
        fillRule="evenodd"
        d="M0 3a3 3 0 0 1 3-3h30a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Zm13 3h-3a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2Zm3.064 22.649L18.557 22H15a1 1 0 0 1 0-2h10.301a1 1 0 1 1 0 2h-2.858l2.493 6.649a1 1 0 1 1-1.872.702l-1.259-3.355h-2.61l-1.259 3.355a1 1 0 1 1-1.872-.702ZM11 13.24h14v-2H11v2Zm5 4.16h-5v-2h5v2Zm4.5 1.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM15 6h6v2h-6V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default OtherIcon;

