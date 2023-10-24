import * as React from 'react'

/**
 * ImgIcon Component
 *
 * This component displays an image icon in an SVG format. It allows customization of the fill color, width, height, and other props.
 * It also supports a hoverDarkMode, which changes the fill color on hover.
 *
 * @param {number} width - The width of the SVG icon. Default: 36
 * @param {number} height - The height of the SVG icon. Default: 36
 * @param {object} props - Additional props to be passed to the SVG element
 *
 * @returns {JSX.Element} ImgIcon component
 */
const ImgIcon = ({ width = 48, height = 48, ...props }) => {
  return (
    <svg
      width={width}
      height={height}
      className='text-cool-gray-700'
      viewBox='0 0 48 48'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9 6C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6H9ZM20.8 16L28.2 16.0002V17.0001C28.2 17.2855 28.4226 17.7213 28.8491 18.2037C29.0393 18.4187 29.2325 18.6011 29.3792 18.7302C29.4519 18.7941 29.5114 18.8434 29.5511 18.8755C29.5708 18.8915 29.5856 18.9031 29.5944 18.9099L29.6024 18.9161L30 19.2159V21H28V20.1802C27.8169 20.016 27.5851 19.7935 27.3509 19.5285C27.033 19.1691 26.6234 18.6359 26.3884 18L22.5447 18.0001C22.493 18.1099 22.4389 18.2107 22.3881 18.3C22.1834 18.6601 21.9233 19.0165 21.6825 19.3192C21.4385 19.6258 21.197 19.8987 21.0178 20.0938L21 20.1132V31.5C21 33.433 22.567 35 24.5 35C25.8962 35 27.1015 34.1825 27.6632 33H29.793C29.14 35.3085 27.0176 37 24.5 37C21.4624 37 19 34.5376 19 31.5V19.3017L19.2907 19.0095L19.2934 19.0067L19.3054 18.9944C19.3166 18.983 19.3338 18.9654 19.3561 18.9421C19.4009 18.8955 19.466 18.8268 19.5447 18.7411C19.703 18.5687 19.9115 18.3327 20.1175 18.0738C20.3266 17.811 20.5166 17.5453 20.6494 17.3117C20.7524 17.1304 20.785 17.0302 20.7953 16.9986C20.7977 16.991 20.7989 16.9874 20.7995 16.9875C20.7996 16.9875 20.7994 16.9872 20.7995 16.9875C20.7995 16.9877 20.7999 16.9886 20.7999 16.989L20.8 16.9932V16ZM32 28.0909C32 29.6976 30.6569 31 29 31C27.3431 31 26 29.6976 26 28.0909C26 25.5455 29 23 29 23C29 23 32 25.5455 32 28.0909ZM29 10H20V14H29V10Z'
      />
    </svg>
  )
}

export default ImgIcon
