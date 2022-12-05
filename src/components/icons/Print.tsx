import React from 'react';


// in case of not receiving props we use these values
const Print = ({ iconColor="#ABAFB6", bgColor="#F7F4F4", height="4.5rem", width="4.5rem" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 101 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_261_22152)">
        <circle cx="50.6667" cy="48.5846" r="44.4167" fill={bgColor}/>
        <path d="M63.6215 41.1832H37.7118C34.6396 41.1832 32.1597 43.6631 32.1597 46.7352V54.138C32.1597 56.1738 33.8253 57.8394 35.8611 57.8394H39.5624V61.5408C39.5624 63.5766 41.2281 65.2422 43.2638 65.2422H58.0694C60.1052 65.2422 61.7708 63.5766 61.7708 61.5408V57.8394H65.4722C67.5079 57.8394 69.1736 56.1738 69.1736 54.138V46.7352C69.1736 43.6631 66.6936 41.1832 63.6215 41.1832ZM56.2187 61.5408H45.1145C44.0966 61.5408 43.2638 60.708 43.2638 59.6901V52.2873H58.0694V59.6901C58.0694 60.708 57.2366 61.5408 56.2187 61.5408ZM63.6215 48.5859C62.6036 48.5859 61.7708 47.7531 61.7708 46.7352C61.7708 45.7174 62.6036 44.8845 63.6215 44.8845C64.6394 44.8845 65.4722 45.7174 65.4722 46.7352C65.4722 47.7531 64.6394 48.5859 63.6215 48.5859ZM59.9201 31.9297H41.4131C40.3953 31.9297 39.5624 32.7625 39.5624 33.7804V37.4818C39.5624 38.4997 40.3953 39.3325 41.4131 39.3325H59.9201C60.938 39.3325 61.7708 38.4997 61.7708 37.4818V33.7804C61.7708 32.7625 60.938 31.9297 59.9201 31.9297Z" fill={iconColor}/>
      </g>
      <defs>
        <filter id="filter0_dd_261_22152" x="0.697916" y="0.466579" width="99.9375" height="99.9362" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1.85069"/>
          <feGaussianBlur stdDeviation="2.77604"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_261_22152"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1.85069"/>
          <feGaussianBlur stdDeviation="1.85069"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
          <feBlend mode="normal" in2="effect1_dropShadow_261_22152" result="effect2_dropShadow_261_22152"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_261_22152" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}


export default Print;