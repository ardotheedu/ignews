import { useEffect, useState } from "react";

export function Async() {
    const [isButtonVisible, setIsButtonVisible] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setIsButtonVisible(false)
        }, 1000)
    }, [])

    return (
        <div>
            <div>Hello world</div>
            {isButtonVisible && <button>Button</button>}
        </div>
    )
}