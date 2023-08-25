import React, { createContext, useReducer, useContext, Dispatch } from "react";

type AttemptWithColor = { letter: string; color: string }[];

export enum GameStatus {
  InProgress = "IN_PROGRESS",
  Won = "WON",
  Failed = "FAILED",
}

interface State {
  guess: string[];
  attempts: AttemptWithColor[];
  status: GameStatus;
  words: string[];
  targetWord: string;
}

type Action =
  | { type: "SET_GUESS"; payload: { index: number; letter: string } }
  | { type: "ADD_ATTEMPT" }
  | { type: "RESTART_GAME" }
  | { type: "SET_STATUS"; payload: GameStatus }
  | { type: "CHANGE_TARGET_WORD" };

const initialState: State = {
  guess: Array(5).fill(""),
  attempts: [],
  status: GameStatus.InProgress,
  words: [],
  targetWord: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_GUESS":
      const newGuess = [...state.guess];
      newGuess[action.payload.index] = action.payload.letter;
      return { ...state, guess: newGuess };
    case "ADD_ATTEMPT":
      const attemptWithColor: AttemptWithColor = state.guess.map(
        (letter, index) => ({
          letter,
          color:
            state.targetWord[index] === letter
              ? "green"
              : state.targetWord.includes(letter)
              ? "yellow"
              : "red",
        })
      );
      return {
        ...state,
        attempts: [...state.attempts, attemptWithColor],
        guess: Array(state.targetWord.length).fill(""),
      };

    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "RESTART_GAME":
      return initialState;
    case "CHANGE_TARGET_WORD":
      const newTargetWord =
        state.words[Math.floor(Math.random() * state.words.length)];
      return { ...state, targetWord: newTargetWord };
    default:
      return state;
  }
};

interface GameStateContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const GameStateContext = createContext<GameStateContextProps | undefined>(
  undefined
);
export const GameStateProvider: React.FC<{
  children: React.ReactNode;
  words: string[];
  targetWord: string;
}> = ({ children, words, targetWord }) => {
  const initState = {
    ...initialState,
    words: words,
    targetWord: targetWord,
  };

  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};
export const useViewState = (): State => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useViewState must be used within a GameStateProvider");
  }
  return context.state;
};

export const useActions = (): Dispatch<Action> => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useActions must be used within a GameStateProvider");
  }
  return context.dispatch;
};
