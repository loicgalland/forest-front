import Link from "next/link";

interface LongCardData {
    title: string,
    description: string,
    image: string,
    id: number,
    type: string
}

export function LongCard({title, description, image, id, type}: LongCardData) {
    return (
        <div className="rounded-lg overflow-hidden shadow-lg relative h-[150px] w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black flex flex-col justify-end p-4 text-white">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="my-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{ description }</p>
                <Link href={'/' + type  +  '/' + id} className="p-2 rounded-lg bg-primary w-fit">En savoir plus</Link>
            </div>
            <img src={image} alt="" className="h-full w-full object-cover object-center" />
        </div>
    )
}