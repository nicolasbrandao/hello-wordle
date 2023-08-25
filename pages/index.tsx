import { useReducer, useRef } from "react";
import styled from "styled-components";
import VirtualKeyboard from "../components/qwertKeyboard";

const wordsJson = { words: ["apple", "banana", "cherry"] };
const targetWord =
  wordsJson.words[Math.floor(Math.random() * wordsJson.words.length)];

const Container = styled.div`
  text-align: center;
  background-color: #333;
  color: #f0f0f0;
  min-height: 100vh;
`;

const Row = styled.div`
  border: 2px dotted red;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  border: 2px dotted blue;
`;

const Key = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color || "#555"};
  margin: 3px;
  cursor: pointer;
`;

const InputBox = styled.input`
  width: 20px;
  height: 20px;
  background-color: #555;
  color: #f0f0f0;
  border: none;
  text-align: center;
  border-radius: 5px;
  box-shadow: 5px 5px 10px #000, -5px -5px 10px #888;
  margin: 3px;
`;

const Button = styled.button`
  background: #555;
  border: none;
  color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #000, -5px -5px 10px #888;
  margin: 10px;
`;

const initialState = {
  guess: Array(targetWord.length).fill(""),
  attempts: [],
};

type State = typeof initialState;

const reducer = (state: State, action) => {
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
    case "RESTART_GAME":
      return initialState;
    default:
      return state;
  }
};

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
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
        {state.attempts.map((attempt) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {attempt.split("").map((letter) => (
              <Key color={getBestColorForKey(letter)}>{letter}</Key>
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
