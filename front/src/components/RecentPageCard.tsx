import { PagesContainer } from "./PageContainer"
import { getPages} from "../api/page.api"
import { useEffect, useState } from "react"
import type { Page } from "../interfaces/page.interface"


export const RecentPageCard = () => {
    const [pages, setPages] = useState<Page[]>([])
    const fetchPage = async () => {
        const data = await getPages();
        setPages(data);
    }
    useEffect(() => {
        fetchPage()
    })
    return (
        <PagesContainer
        pages={pages}
        />
    )
}