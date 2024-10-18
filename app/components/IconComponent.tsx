import React, {useEffect, useState} from "react";

interface Props {
    type: string,
}

export const IconComponent: React.FC<Props> = (props: Props) => {
    const [icon, setIcon] = useState("")


    useEffect(() => {
        if(props.type === 'food'){
            setIcon('utensils')
        }
        if(props.type === "wifi"){
            setIcon('wifi')
        }
        if(props.type === "stuff"){
            setIcon('blender')
        }
    }, [props.type]);

    return (
        <i className={"w-[25px] text-center fa-solid fa-" + icon}></i>
    )
}