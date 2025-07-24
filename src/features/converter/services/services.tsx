import { FFmpeg } from "@ffmpeg/ffmpeg";

 export const downloadAudio = (url: string, filename: string) => {

    const a = document.createElement('a');

    a.href = url;

    a.download = `${filename}.mp3`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

  };


export const ffmpeg = new FFmpeg();
