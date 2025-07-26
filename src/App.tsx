// src/App.tsx

import MainPage from "./alltogether/MainPage";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Music Extension</h1>
        <MainPage/>
      </div>
    </div>
  );
}