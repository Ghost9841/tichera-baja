import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className='p-4 w-72'>
      <div className="relative mb-4">
        <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400'/>
        <Input 
          type='text'
          placeholder='Search your sounds...'
          className='w-full pl-10 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={search}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;