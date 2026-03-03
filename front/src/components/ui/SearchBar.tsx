import { Search } from 'lucide-react';

export const SearchBar = () => {
    return (
        <div className='flex items-center gap-2 text-slate-900 bg-slate-200 p-2 rounded-lg w-full'>
            <div className='w-8 h-8 flex items-center justify-center'>
                <Search className='w-5 text-slate-900'/>
            </div>
            <input type="text" placeholder='Recherche' className="flex-1 outline-none placeholder:text-slate-500 bg-transparent"/>
        </div>
    )
}