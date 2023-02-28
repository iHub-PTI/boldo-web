import { Transition } from '@headlessui/react'
import React, { useState } from 'react'
import CheckIcon from '../icons/CheckIcon'
import CloseCrossIcon from '../icons/CloseCrossIcon'

type Props = {
    show?: boolean,
}

const InputTextHereditary: React.FC<Props> = ({ show = false, ...props }) => {

    const [isFocusFirst, setIsFocusFirst] = useState(false)
    const [isFocusSecond, setIsFocusSecond] = useState(false)

    const handleClickAdd = () => {

    }

    const handleClickClose = () => {

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
                        className={`truncate focus:outline-none pr-3 ease-in-out duration-200 ${isFocusFirst ? 'w-full' : isFocusSecond ? 'w-1/5' : 'w-full'}`}
                        type="text"
                        onFocus={() => setIsFocusFirst(true)}
                        onBlur={() => setIsFocusFirst(false)}
                        placeholder="Problema"
                        style={{transitionProperty: 'width'}}
                    />
                    <div className='flex flex-col'>
                        <span className='border border-r h-full' style={{ borderRightColor: '#ABAFB6' }}></span>
                    </div>
                    <input
                        className={`truncate focus:outline-none ease-in-out duration-200 pl-3 ${isFocusSecond ? 'w-full' : isFocusFirst ? 'w-1/5' : 'w-full'}`}
                        type="text"
                        onFocus={() => setIsFocusSecond(true)}
                        onBlur={() => setIsFocusSecond(false)}
                        placeholder="Parentezco"
                        style={{transitionProperty: 'width'}}
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