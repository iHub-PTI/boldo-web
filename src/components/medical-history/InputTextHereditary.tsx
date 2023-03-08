import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'

type Props = {
    show?: boolean,
    setShow?: (value: boolean) => void,
    addInput: (value: { description: string, relationship: string }) => void,
}

const InputTextHereditary: React.FC<Props> = ({ show, setShow, addInput, ...props }) => {

    const [isFocusFirst, setIsFocusFirst] = useState(false)
    const [isFocusSecond, setIsFocusSecond] = useState(false)
    const [disease, setDisease] = useState("")
    const [relationShip, setRelationShip] = useState("")


    const handleClickAdd = () => {
        if (disease.split(' ').every((value) => value === '')) return
        addInput({ description: disease, relationship: relationShip })
        setDisease("")
        setRelationShip("")
    }

    const handleClickClose = () => {
        setShow(false)
        setDisease("")
        setRelationShip("")
    }

    const handleKeyPress = (event) => {
        if (event.target.value === '') return
        let temp = event.target.value.split(' ')
        //check that there are no spaces
        if (temp.every((value) => value === '')) return
        if (event.key === 'Enter') {
            handleClickAdd()
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsFocusFirst(false)
            setIsFocusSecond(false)
            setShow(false)
            setDisease('')
            setRelationShip('')
        }
    }

    return (
        <Transition
            show={show}
            enter="transform transition duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform duration-500 transition linear"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className='flex flex-row flex-no-wrap justify-between items-center w-full bg-white h-11 py-2 px-3 rounded-lg shadow my-1'
                {...props}
            >
                <div className={`flex flex-row flex-no-wrap`}>
                    <input
                        className={`font-medium text-base input-add-placeholder truncate focus:outline-none pr-3 ease-in-out duration-200 ${isFocusFirst ? 'w-full' : isFocusSecond ? 'w-3/12' : 'w-full'}`}
                        type="text"
                        value={disease}
                        onChange={(event) => { setDisease(event.target.value) }}
                        onFocus={() => setIsFocusFirst(true)}
                        onBlur={() => setIsFocusFirst(false)}
                        placeholder="Problema"
                        style={{ transitionProperty: 'width' }}
                        onKeyPress={(event) => handleKeyPress(event)}
                        onKeyDown={(event) => handleKeyDown(event)}
                    />
                    <div className='flex flex-col'>
                        <span className='border border-r h-full' style={{ borderRightColor: '#ABAFB6' }}></span>
                    </div>
                    <input
                        className={`font-medium text-base input-add-placeholder truncate focus:outline-none ease-in-out duration-200 pl-3 ${isFocusSecond ? 'w-full' : isFocusFirst ? 'w-3/12' : 'w-full'}`}
                        type="text"
                        value={relationShip}
                        onChange={(event) => { setRelationShip(event.target.value) }}
                        onFocus={() => setIsFocusSecond(true)}
                        onBlur={() => setIsFocusSecond(false)}
                        placeholder="Parentezco"
                        style={{ transitionProperty: 'width' }}
                        onKeyPress={(event) => handleKeyPress(event)}
                        onKeyDown={(event) => handleKeyDown(event)}
                    />
                </div>
                <div className='flex flex-row flex-no-wrap gap-3 items-center'>
                    <button className='focus:outline-none' onClick={() => handleClickAdd()}>
                        <CheckIcon active={true} />
                    </button>
                    <button className='focus:outline-none' onClick={() => handleClickClose()}>
                        <CloseCrossIcon />
                    </button>
                </div>
            </div>
        </Transition>
    )
}

export default InputTextHereditary