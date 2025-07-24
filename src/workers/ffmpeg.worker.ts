// // Create a new file: src/workers/ffmpeg.worker.ts
// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { fetchFile } from '@ffmpeg/util';

// self.addEventListener('message', async (e) => {
//   const { file, command } = e.data;
//   const ffmpeg = new FFmpeg();
  
//   try {
//     await ffmpeg.load({
//       coreURL: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
//     });
    
//     // ... conversion logic
    
//     self.postMessage({ result: convertedData });
//   } catch (error) {
//     self.postMessage({ error });
//   }
// });