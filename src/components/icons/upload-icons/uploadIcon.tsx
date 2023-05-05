import React from 'react';


type Props = {
  width?: string;
  height?: string;
  fromVirtual: boolean;
}


const UploadStudyIcon = (props: Props) => {
  const {fromVirtual=false, width=54, height=54} = props

  return (
    <svg width={width} height={height} viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_4565_15611)">
        <circle cx="27" cy="26" r="24" fill={fromVirtual ? "black" : ""} fill-opacity="0.5" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.1429 18C21.835 18 21.5427 18.1206 21.3294 18.3307C21.1167 18.5403 21 18.8213 21 19.1111V33.8889C21 34.1787 21.1167 34.4597 21.3294 34.6693C21.5427 34.8794 21.835 35 22.1429 35H32.8571C33.165 35 33.4573 34.8794 33.6706 34.6693C33.8833 34.4597 34 34.1787 34 33.8889V23.7705C34 23.7607 33.9962 23.7481 33.9844 23.7365L33.9843 23.7364L28.1835 18.0216L28.1834 18.0215C28.1712 18.0094 28.1514 18 28.1276 18H22.1429ZM19.9258 16.906C20.5163 16.3242 21.3141 16 22.1429 16H28.1279H28.1281C28.6726 16.0001 29.1977 16.2131 29.5872 16.5969M29.5873 16.597L35.3878 22.3116C35.3878 22.3116 35.3878 22.3117 35.3879 22.3117C35.7779 22.6959 35.9999 23.2202 36 23.7701V23.7703V33.8889C36 34.7189 35.6652 35.5118 35.0742 36.094C34.4837 36.6758 33.6859 37 32.8571 37H22.1429C21.3141 37 20.5163 36.6758 19.9258 36.094C19.3348 35.5118 19 34.7189 19 33.8889V19.1111C19 18.2811 19.3348 17.4882 19.9258 16.906M27.5 22.7703C27.7935 22.7703 28.0723 22.8993 28.2623 23.1231L31.4765 26.9083C31.834 27.3293 31.7825 27.9603 31.3616 28.3178C30.9406 28.6753 30.3095 28.6238 29.952 28.2028L28.5 26.4929V30.7222C28.5 31.2745 28.0523 31.7222 27.5 31.7222C26.9477 31.7222 26.5 31.2745 26.5 30.7222V26.4929L25.048 28.2028C24.6905 28.6238 24.0594 28.6753 23.6384 28.3178C23.2175 27.9603 23.166 27.3293 23.5235 26.9083L26.7377 23.1231C26.9277 22.8993 27.2065 22.7703 27.5 22.7703Z" fill="white" />
      </g>
      <defs>
        <filter id="filter0_dd_4565_15611" x="0" y="0" width="54" height="54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4565_15611" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_4565_15611" result="effect2_dropShadow_4565_15611" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_4565_15611" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}


export default UploadStudyIcon;