import React from "react";

interface HeroProps {
    title: string;
    description: string;
    image: string;
}

export const Hero: React.FC<HeroProps> = (props: HeroProps) => {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col w-full md:w-[65%]">
                <h1 className="text-2xl font-bold">{props.title}</h1>
                <p className="w-full">{props.description}</p>
            </div>
            <img
                className="rounded-xl hidden md:flex w-[35%] h-[250px] object-cover"
                src={props.image}
                alt="alt"
                width={300}
                height={200}
            />
        </div>

    )
}
