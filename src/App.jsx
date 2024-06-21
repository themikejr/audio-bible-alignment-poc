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
        audioSrc="mark-sample.mp3"
      />
    </div>
  );
}

export default App;
