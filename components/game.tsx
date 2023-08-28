import React, { useEffect } from "react";
import { useRef } from "react";
import VirtualKeyboard from "../components/qwertKeyboard";
import {
  Button,
  Container,
  DebugContainer,
  InputBox,
  Key,
} from "./styled";
import { GameStatus, useActions, useViewState } from "../context/gameState";

export default function Home() {
  const totalAttempts = 5;

  const state = useViewState();
  const { guess, attempts, targetWord } = state;
  const dispatch = useActions();
  const inputRefs = useRef([]);

  const won = guess.join("").toLowerCase() === targetWord;
  const lost = attempts.length >= totalAttempts;
  const end = won || lost;
  const gameStatus = !end
    ? GameStatus.InProgress
    : won
    ? GameStatus.Won
    : GameStatus.Failed;

  const handleKeyPress = (letter: string) => {
    const index = state.guess.findIndex((g) => g === "");
    const nextIndex = index < state.targetWord.length - 1 ? index + 1 : index;
    const foundIndex = index !== -1;

    if (foundIndex) {
      dispatch({ type: "SET_GUESS", payload: { index, letter } });
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const currentAttemptIndex = attempts.length;
  const currentAttempts = attempts.slice(0, currentAttemptIndex);

  const getBestColorForAttemptKey = (letter: string) => {
    return currentAttempts.reduce((bestColor, attempt) => {
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

  const getBestColorForKey = (letter: string) => {
    let bestColor = "#555"; // Default color (no color)

    state.attempts.forEach((attempt) => {
      attempt.forEach((item) => {
        if (item.letter.toLowerCase() === letter.toLowerCase()) {
          if (item.color === "green") return (bestColor = "green");
          else if (item.color === "yellow" && bestColor !== "green")
            bestColor = "yellow";
          else if (item.color === "red" && bestColor !== "yellow")
            bestColor = "red";
        }
      });
    });

    return bestColor;
  };

  const handleGuess = () => {
    console.log("handleGuess");
    console.log({ state });

    if (state.status !== GameStatus.InProgress)
      return alert("Game is over, Please Restart");

    const cleanedGuess = guess.filter((char) => char !== "");
    const guessCompleted = cleanedGuess.length === state.targetWord.length;

    if (!guessCompleted) return alert("Guess is not complete");

    dispatch({ type: "ADD_ATTEMPT" });
    inputRefs.current[0]?.focus();

    dispatch({
      type: "SET_STATUS",
      payload: gameStatus,
    });
  };

  useEffect(() => {
    console.log({ state });
  }, [state]);

  const filledAttempts = state.attempts.filter((attempt) =>
    attempt.every((item) => item.letter !== "")
  );

  const emptyAttempts = Array.from(
    { length: 5 - filledAttempts.length },
    (_, index) => index
  );

  console.log({
    filledAttempts,
    emptyAttempts,
    attempts: state.attempts,
  });

  return (
    <Container>
      {/* <DebugContainer>
        Debug Area
        <div>targetWord : {state.targetWord}</div>
        <div>gameStatus : {state.status}</div>
        <div>attemps : {JSON.stringify(state.attempts)}</div>
        <div>guesss : {state.guess}</div>
      </DebugContainer> */}
      <h1>Hello Wordle!</h1>
      {state.status === GameStatus.Won && <h2>You Won</h2>}
      {state.status === GameStatus.Failed && <h2>You Lost</h2>}
      <div>
        <div>
          {filledAttempts.map((attempt, index) => (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {(
                attempts[index] ||
                Array(targetWord.length).fill({ letter: "", color: "#555" })
              ).map(({ letter, color }, index) => (
                <Key key={`${letter} ${index}`} color={color}>
                  {letter}
                </Key>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {state.status === GameStatus.InProgress && (
            <div>
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
            </div>
          )}
        </div>
        <div>
          {emptyAttempts.map((_, index) => (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {Array(targetWord.length)
                .fill({ letter: "", color: "#555" })
                .map(({ letter, color }, index) => (
                  <Key key={`${letter} ${index}`} color={color}>
                    {letter}
                  </Key>
                ))}
            </div>
          ))}
        </div>

      </div>
      <div>
        {state.status === GameStatus.InProgress && (
            <Button onClick={handleGuess}>Guess</Button>
        )}
        <Button
          onClick={() => {
            dispatch({ type: "RESTART_GAME" });
          }}
        >
          Restart
        </Button>
      </div>
      <VirtualKeyboard
        getBestColorForKey={getBestColorForKey}
        handleKeyPress={handleKeyPress}
      />
    </Container>
  );
}
