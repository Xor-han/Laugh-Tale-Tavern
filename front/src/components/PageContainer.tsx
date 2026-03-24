import type { Page as PageType } from "../interfaces/page.interface"
import { PageCard } from "./PageCard";

interface Props {
    pages : PageType[];
    title : string;
}
export const PagesContainer = ({pages, title} : Props) => {

    return (
        <div className="py-14 px-10 grid gap-15">
            <h2 className="text-6xl font-bold">{title}</h2>
            <div className="grid grid-cols-5 gap-15 wrap">
                {
                    pages.map((page) => (
                        <PageCard key={page.id} page={page}/>
                    ))
                }
            </div>
        </div>
    )
}
