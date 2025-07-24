import React, { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { UploadCloud, Download } from 'lucide-react';

const ffmpeg = new FFmpeg();

const VideoConverter = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioUrl(null);
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const convertToMp3 = async () => {
    if (!videoFile) return;
    setConverting(true);

    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp3';

    await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));
    await ffmpeg.exec(['-i', inputFileName, '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', outputFileName]);

    const data = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([data], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);

    setAudioUrl(url);
    setConverting(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-3">🎞️ MP4 to MP3 Converter</h2>

      <label className="flex items-center justify-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded cursor-pointer hover:bg-blue-200">
        <UploadCloud className="w-5 h-5" />
        Upload Video (MP4)
        <input
          type="file"
          accept="video/mp4"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {videoFile && (
        <p className="mt-2 text-sm text-gray-600">{videoFile.name}</p>
      )}

      <button
        disabled={!videoFile || converting}
        onClick={convertToMp3}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {converting ? 'Converting...' : 'Convert to MP3'}
      </button>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="converted.mp3"
            className="flex items-center justify-center gap-1 text-blue-600 mt-2"
          >
            <Download className="w-4 h-4" />
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoConverter;
