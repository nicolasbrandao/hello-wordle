import { useReducer, useRef } from "react";
import VirtualKeyboard from "../components/qwertKeyboard";
import { Button, Container, InputBox, Key } from "../components/styleds";
import {
  GameStateProvider,
  useActions,
  useViewState,
} from "../context/gameState";

const wordsJson = { words: ["apple", "banana", "cherry"] };
const targetWord =
  wordsJson.words[Math.floor(Math.random() * wordsJson.words.length)];

export default function Home() {
  const state = useViewState();
  const { guess, attempts } = state;
  const dispatch = useActions();
  const inputRefs = useRef([]);

  const handleKeyPress = (letter: string) => {
    const index = state.guess.findIndex((g) => g === "");
    if (index !== -1) {
      dispatch({ type: "SET_GUESS", payload: { index, letter } });
      if (index < targetWord.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const getBestColorForKey = (letter: string) => {
    let bestColor = "#555";
    state.attempts.forEach((attempt) => {
      if (attempt.includes(letter)) {
        const index = attempt.indexOf(letter);
        if (targetWord[index] === letter) bestColor = "green";
        else if (targetWord.includes(letter)) bestColor = "yellow";
        else bestColor = "red";
      }
    });
    return bestColor;
  };

  const handleGuess = () => {
    const cleanedGuess = guess.filter((char) => char !== "");
    const guessCompleted = cleanedGuess.length === targetWord.length;

    if (!guessCompleted) {
      alert("Guess is not complete");
      return;
    }

    dispatch({ type: "ADD_ATTEMPT" });
    inputRefs.current[0]?.focus();
  };

  return (
    <Container>
      <h1>Developer Wordle</h1>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {state.guess.map((g, index) => (
          <InputBox
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={g}
            maxLength={1}
            onChange={(e) =>
              dispatch({
                type: "SET_GUESS",
                payload: { index, letter: e.target.value },
              })
            }
          />
        ))}
        <Button onClick={handleGuess}>Guess</Button>
      </div>
      <div>
        {state.attempts.map((attempt, index) => (
          <div
            key={`${attempt} ${index}`}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {attempt.split("").map((letter, index) => (
              <Key
                key={`${letter} ${index}`}
                color={getBestColorForKey(letter)}
              >
                {letter}
              </Key>
            ))}
          </div>
        ))}
      </div>
      <Button onClick={() => dispatch({ type: "RESTART_GAME" })}>
        Restart
      </Button>

      <VirtualKeyboard
        getBestColorForKey={getBestColorForKey}
        handleKeyPress={handleKeyPress}
      />
    </Container>
  );
}
