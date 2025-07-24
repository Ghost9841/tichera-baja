import { Music } from "lucide-react"

const Header = () => {
  return (
    <div>
              {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-8 h-8" />
            Convert Gar ani Baja
          </h1>
          <p className="mt-2 opacity-90">Convert MP4, WebM, and other video formats to MP3</p>
        </div>
    </div>
  )
}

export default Header
