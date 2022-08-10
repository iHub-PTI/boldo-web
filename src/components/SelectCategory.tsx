import React, { useState } from "react";
import { ChangeEvent } from "react"
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { ReactComponent as IconLab } from "../assets/laboratory-icon.svg";
import { ReactComponent as IconImg } from "../assets/img-icon.svg";
import { ReactComponent as IconOther } from "../assets/icon-other.svg";


const SelectCategory = (props) => {

    const [categorySelect, setCategory] = useState("")

    //Handle Change Event Select
    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setCategory(event.target.value as string);
        console.log(categorySelect)
    };

    
    return (
        <FormControl>
            <Select 
                value={categorySelect}
                onChange={handleChange}
                className={props.classes.select}
                displayEmpty
            >
                <MenuItem className={props.classes.menuItem} value="">
                    Categoría
                </MenuItem>
                <MenuItem  className={props.classes.menuItem} value={'LABORATORY'}><span className="pl-2 pr-2"><IconLab></IconLab></span>Laboratorio</MenuItem>
                <MenuItem  className={props.classes.menuItem} value={'IMAGE'}><span className="pl-2 pr-2"><IconImg></IconImg></span>Imágenes</MenuItem>
                <MenuItem  className={props.classes.menuItem} value={'OTHER'}><span className="pl-2 pr-2"><IconOther></IconOther></span>Otros</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectCategory;