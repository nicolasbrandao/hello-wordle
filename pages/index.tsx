import Game from "../components/game";
import { GameStateProvider } from "../context/gameState";
import wordsJson from "../words.json";

export async function getStaticProps() {
  return {
    props: {
      targetWord:
        wordsJson.words[Math.floor(Math.random() * wordsJson.words.length)],
    },
  };
}

export default function Home({ targetWord }) {
  return (
    <GameStateProvider targetWord={targetWord} words={wordsJson.words}>
      <Game />
    </GameStateProvider>
  );
}
