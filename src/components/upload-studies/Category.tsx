import React from 'react';
import { ReactComponent as OtherIcon } from "../../assets/icon-other.svg";
import { ReactComponent as ImgIcon } from "../../assets/img-icon.svg";
import { ReactComponent as LabIcon } from "../../assets/laboratory-icon.svg";


type Props = {
  category: string;
}
// map the name of the category
const CategoryNameMap = {
  "Laboratory": "Laboratorio",
  "Diagnostic Imaging": "Imágenes",
  "Other": "Otros",
  "": "Categoría desconocida"
}
// map the icon of the category
export const CategoryIconMap = {
  "Laboratory": <LabIcon />,
  "Diagnostic Imaging": <ImgIcon />,
  "Other": <OtherIcon />,
  "": <></>
}


const Category = (props:Props) => {
  // for default set in ''
  const {category=''} = props

  return (
    // space-x-2 put horizontal space between the children
    <div className='flex flex-row space-x-2 items-center'>
      <div className='flex items-center'>{CategoryIconMap[category]}</div>
      <p className='flex items-center'>{CategoryNameMap[category]}</p>
    </div>
  );
}


export default Category;