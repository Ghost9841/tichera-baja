import type { TabsProps } from '@/features/converter/types/types'
import { Film, Music } from 'lucide-react'

const Tabs = ({setActiveTab, activeTab, sounds}:TabsProps) => {
  return (
    <div>
      <div className="flex border-b">
          <button
            onClick={() => setActiveTab('converter')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'converter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Film className="w-5 h-5 inline mr-2" />
            Converter
          </button>
          <button
            onClick={() => setActiveTab('soundboard')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 'soundboard'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Music className="w-5 h-5 inline mr-2" />
            Soundboard ({sounds})
          </button>
        </div>
    </div>
  )
}

export default Tabs
