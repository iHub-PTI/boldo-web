import React, { useState, useContext, useEffect } from "react";
import { ChangeEvent } from "react"
import { FormControl, MenuItem, Select, InputBase } from '@material-ui/core';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { ReactComponent as IconLab } from "../../assets/laboratory-icon.svg";
import { ReactComponent as IconImg } from "../../assets/img-icon.svg";
import { ReactComponent as IconOther } from "../../assets/icon-other.svg";
import { CategoriesContext } from "./Provider";


const SelectCategory = ({ error = false, value = "", ...props }) => {

  const SelectStyled = withStyles((theme: Theme) =>
    createStyles({
      root: {
        'label + &': {
          marginTop: theme.spacing(3),
        },
      },
      input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: error ? '1px solid red' : '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
          borderRadius: 4,
          borderColor: 'black',
          boxShadow: '0 0 0 0.2rem rgba(19,165,169,.25)',
        },
      },
    }),
  )(InputBase);

  const [categorySelect, setCategory] = useState(value)
  const { orders, setOrders } = useContext(CategoriesContext)

  //Handle Change Event Select
  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setCategory(event.target.value as string);
    let update = [...orders]
    update[props.index].category = event.target.value as string
    setOrders([...update])
    //console.table(orders)
  };

  useEffect(() => {
    setCategory(value)
  }, [value])


  return (
    <FormControl>
      <Select
        value={categorySelect}
        onChange={handleChange}
        className={props.classes.select}
        displayEmpty
        input={props.variant === 'outlined' ? <SelectStyled></SelectStyled> : undefined}
      >
        <MenuItem value="">
          Categoría
        </MenuItem>
        <MenuItem className={props.classes.menuItem} value={'LAB'}><span className=" pr-1"><IconLab></IconLab></span>Laboratorio</MenuItem>
        <MenuItem className={props.classes.menuItem} value={'IMG'}><span className=" pr-1"><IconImg></IconImg></span>Imágenes</MenuItem>
        <MenuItem className={props.classes.menuItem} value={'OTH'}><span className="pr-1"><IconOther></IconOther></span>Otros</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SelectCategory;