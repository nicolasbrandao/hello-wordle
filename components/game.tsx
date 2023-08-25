import { useRef } from "react";
import VirtualKeyboard from "../components/qwertKeyboard";
import {
  Button,
  Container,
  DebugContainer,
  InputBox,
  Key,
} from "../components/styleds";
import { GameStatus, useActions, useViewState } from "../context/gameState";

export default function Home() {
  const totalAttempts = 5;

  const state = useViewState();
  const { guess, attempts } = state;
  const dispatch = useActions();
  const inputRefs = useRef([]);

  const won = guess.join("").toLowerCase() === state.targetWord;
  const lost = attempts.length >= totalAttempts;
  const end = won || lost;

  const handleKeyPress = (letter: string) => {
    const index = state.guess.findIndex((g) => g === "");
    console.log(state);

    const nextIndex = index < state.targetWord.length - 1 ? index + 1 : index;
    const foundIndex = index !== -1;

    if (foundIndex) {
      dispatch({ type: "SET_GUESS", payload: { index, letter } });
      inputRefs.current[nextIndex]?.focus();
    }
  };
  const getBestColorForKey = (letter: string) => {
    return state.attempts.reduce((bestColor, attempt) => {
      const attemptLetter = attempt.find(
        (item) => item.letter.toLowerCase() === letter.toLowerCase()
      );
      if (!attemptLetter) return bestColor;
      if (state.targetWord.includes(letter)) return "yellow";
      if (state.targetWord[attempt.indexOf(attemptLetter)] === letter)
        return "green";

      return "red";
    }, "#555");
  };

  const handleGuess = () => {
    if (state.status !== GameStatus.InProgress)
      return alert("Game is over, Please Restart");

    const cleanedGuess = guess.filter((char) => char !== "");
    const guessCompleted = cleanedGuess.length === state.targetWord.length;

    if (!guessCompleted) return alert("Guess is not complete");

    dispatch({ type: "ADD_ATTEMPT" });
    inputRefs.current[0]?.focus();

    const gameStatus = !end
      ? GameStatus.InProgress
      : won
      ? GameStatus.Won
      : GameStatus.Failed;

    dispatch({
      type: "SET_STATUS",
      payload: gameStatus,
    });
  };

  return (
    <Container>
      <DebugContainer>
        Debug Area
        <div>targetWord : {state.targetWord}</div>
      </DebugContainer>
      <h1>Developer Wordle</h1>
      {state.status === GameStatus.Won && <h2>You Won</h2>}
      {state.status === GameStatus.Failed && <h2>You Lost</h2>}

      <div>
        {state.attempts.map((attempt, index) => (
          <div
            key={`${index}`}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {attempt.map(({ letter, color }, index) => (
              <Key key={`${letter} ${index}`} color={color}>
                {letter}
              </Key>
            ))}
          </div>
        ))}
      </div>
      {!end && (
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
      )}
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
