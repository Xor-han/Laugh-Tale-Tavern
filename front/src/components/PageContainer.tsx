import type { Page as PageType } from "../interfaces/page.interface"
import { PageCard } from "./PageCard";

interface Props {
    pages : PageType[];
}
export const PagesContainer = ({pages} : Props) => {

    return (
        <div className="px-10 grid gap-15">
            <h2 className="text-6xl font-bold">Pages</h2>
            <div className="grid grid-cols-5 gap-15">
                {
                    pages.map((page) => (
                        <PageCard key={page.id} page={page}/>
                    ))
                }
            </div>
        </div>
    )
}
