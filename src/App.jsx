// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

import AudioScriptureAlignmentPlayer from "./AudioScriptureAlignmentPlayer";
import audioTokens from "../data/audio-tokens";
import sourceTokens from "../data/source-tokens";

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center my-4">
        Audio Scripture Alignment Tool
      </h1>
      <AudioScriptureAlignmentPlayer
        audioTokens={audioTokens}
        sourceTokens={sourceTokens}
        audioSrc="../data/mark-sample.mp3"
      />
    </div>
  );
}

export default App;
