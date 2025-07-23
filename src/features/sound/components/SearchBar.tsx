import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react'

const SearchBar = () => {
    const [search, setSearch] = useState('');
  return (
    <div className='p-4 w-72'>
        <div className="relative mb-4">

        <Search className='absolute left-3 top-2.5 w-4 h-4'/>
      <Input 
      type='text'
      placeholder='Search your meme sound...'
      className='w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-8'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
        />

      </div>
      
    </div>
  )
}

export default SearchBar
