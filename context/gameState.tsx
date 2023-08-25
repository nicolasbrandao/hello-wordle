import React, { createContext, useReducer, useContext, Dispatch } from "react";

const wordsJson = { words: ["apple", "banana", "cherry"] };
const targetWord =
  wordsJson.words[Math.floor(Math.random() * wordsJson.words.length)];

interface State {
  guess: string[];
  attempts: string[];
}

type Action =
  | { type: "SET_GUESS"; payload: { index: number; letter: string } }
  | { type: "ADD_ATTEMPT" }
  | { type: "RESTART_GAME" };

const initialState: State = {
  guess: Array(targetWord.length).fill(""),
  attempts: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_GUESS":
      const newGuess = [...state.guess];
      newGuess[action.payload.index] = action.payload.letter;
      return { ...state, guess: newGuess };
    case "ADD_ATTEMPT":
      return {
        ...state,
        attempts: [...state.attempts, state.guess.join("").toLowerCase()],
        guess: Array(targetWord.length).fill(""),
      };
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

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
