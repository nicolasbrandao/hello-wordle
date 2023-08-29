import React from "react";
import { useRef } from "react";
import VirtualKeyboard from "../components/qwertKeyboard";
import {
  Box,
  Button,
  Container,
  DebugContainer,
  InputBox,
  Key,
} from "./styled";
import { GameStatus, useActions, useViewState } from "../context/gameState";
import Navbar from "./navbar";
import { useTheme } from "styled-components";

export default function Home() {
  const theme = useTheme();

  const totalAttempts = 5;

  const state = useViewState();
  const { guess, attempts, targetWord, words } = state;
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

  const getBestColorForKey = (letter: string) => {
    let bestColor = "#555";

    state.attempts.forEach((attempt) => {
      attempt.forEach((item) => {
        if (item.letter.toLowerCase() === letter.toLowerCase()) {
          if (item.color === "green") return (bestColor = theme.colors.success);
          else if (item.color === "yellow" && bestColor !== theme.colors.success)
            bestColor = theme.colors.warning;
          else if (item.color === "red" && bestColor !== theme.colors.warning)
            bestColor = theme.colors.error;
        }
      });
    });

    return bestColor;
  };

  const handleGuess = () => {
    if (state.status !== GameStatus.InProgress)
      return alert("Game is over, Please Restart");

    const cleanedGuess = guess.filter((char) => char !== "");

    const guessCompleted = cleanedGuess.length === state.targetWord.length;

    if (!guessCompleted) return alert("Guess is not complete");

    const isValidGuess = () => {
      const guessString = cleanedGuess.join("").toLowerCase();
      const validWords = [...words5chars, ...words];
      const isGuessValid = validWords.includes(guessString);
      return isGuessValid;
    };

    if (!isValidGuess()) return alert("Guess is not valid");

    dispatch({ type: "ADD_ATTEMPT" });
    inputRefs.current[0]?.focus();

    dispatch({
      type: "SET_STATUS",
      payload: gameStatus,
    });
  };

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
      <Navbar />
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
              ).map(({ letter, color }, innerIndex) => {
                let bestColor = color;
                if (letter.toLowerCase() === letter.toLowerCase()) {
                  if (color === "green") bestColor = theme.colors.success;
                  else if (color === "yellow" && bestColor !== theme.colors.success)
                    bestColor = theme.colors.warning;
                  else if (color === "red" && bestColor !== theme.colors.warning)
                    bestColor = theme.colors.error;
                }
                return (
                  <Key color={bestColor} key={`${letter} ${innerIndex}`}>
                    {letter}
                  </Key>
                );
              })}
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
                  maxLength={1}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_GUESS",
                      payload: { index, letter: e.target.value },
                    })
                  }
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={g}
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
                  <Key color={color} key={`${letter} ${index}`}>
                    {letter}
                  </Key>
                ))}
            </div>
          ))}
        </div>
      </div>
      <Box>
        {state.status === GameStatus.InProgress && (
          <Button onClick={handleGuess}>Submit</Button>
        )}
        <Button
          onClick={() => {
            dispatch({ type: "RESTART_GAME" });
          }}
        >
          Reset
        </Button>
      </Box>
      <VirtualKeyboard
        getBestColorForKey={getBestColorForKey}
        handleKeyPress={handleKeyPress}
      />
    </Container>
  );
}
