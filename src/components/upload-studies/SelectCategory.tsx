import React from 'react';
import { Transition, Popover } from '@headlessui/react';
import { Categories } from './TableOfStudies';
import FilterIcon from '../icons/upload-icons/FilterIcon';


type Props = {
  categorySelected: Categories;
  setCategorySelected: React.Dispatch<React.SetStateAction<Categories>>;
}


// map the name of the category
const CategoryNameMap = {
  "": "Categoría",
  "Laboratory": "Laboratorio",
  "Diagnostic Imaging": "Imágenes",
  "Other": "Otros"
}
// list of the categories
const categories = Object.keys(CategoryNameMap)


const SelectCategory = (props: Props) => {
  const { categorySelected = "", setCategorySelected } = props

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            as='button'
            className='flex flex-row justify-center items-center space-x-2 focus:outline-none'
          >
            <span>{CategoryNameMap[categorySelected]}</span>
            <FilterIcon />
          </Popover.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            // fixed and z-50 allow the component to be displayed on top of the rest
            enterTo="transform scale-100 opacity-100 fixed z-50"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel
              className="absolute rounded-2xl shadow-xl bg-white"
            >
              <Popover.Button></Popover.Button>

              {categories.map((category, idx) => (
                <Popover.Button
                  className='relative w-full px-4 py-2 rounded-2xl focus:outline-none hover:bg-gray-100'
                  key={idx}
                  value={category}
                  onClick={() => setCategorySelected(category as Categories)}
                >
                  <span
                    className={`font-semibold ${categorySelected === category ? 'text-primary-500' : ''} block truncate`}
                  >
                    {CategoryNameMap[category]}
                  </span>
                </Popover.Button>
              ))}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}


export default SelectCategory;