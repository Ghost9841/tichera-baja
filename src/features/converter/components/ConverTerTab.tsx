import { Download, UploadCloud } from 'lucide-react'
import { downloadAudio } from '../services/services'
import type { ConverterTabProps } from '../types/types'




const ConverTerTab = ({
    activeTab, ffmpegLoaded, videoFile, audioUrl, 
    converting, addToSoundboard, progress, 
    handleFileChange, convertToMp3} : ConverterTabProps) => {
  return (
    <div>
      {activeTab === 'converter' && (
          <div className="p-6">
            <div className="max-w-md mx-auto text-center">
              {!ffmpegLoaded && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                  Loading FFmpeg... This may take a moment.
                </div>
              )}

              <label className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
                <UploadCloud className="w-5 h-5" />
                Upload Video File
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <div className="mt-4 text-sm text-gray-600">
                Supports: MP4, WebM, AVI, MOV, MKV, and more
              </div>

              {videoFile && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="font-medium text-gray-800">{videoFile.name}</p>
                  <p className="text-sm text-gray-600">
                    Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <button
                disabled={!videoFile || converting || !ffmpegLoaded}
                onClick={convertToMp3}
                className="mt-4 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {converting ? 'Converting...' : 'Convert to MP3'}
              </button>

              {progress && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{progress}</p>
                </div>
              )}

              {audioUrl && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-3">Conversion Complete!</h3>
                  <audio controls src={audioUrl} className="w-full mb-3" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadAudio(audioUrl, videoFile?.name.replace(/\.[^/.]+$/, "") || "converted")}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={addToSoundboard}
                      className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    >
                      Add to Soundboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export default ConverTerTab
