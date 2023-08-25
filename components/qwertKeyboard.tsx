import { FC } from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
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

interface Props {
  getBestColorForKey: (letter: string) => string;
  handleKeyPress: (letter: string) => void;
}

const VirtualKeyboard: FC<Props> = ({ getBestColorForKey, handleKeyPress }) => {
  const qwertyLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  return (
    <KeyboardContainer>
      {qwertyLayout.map((row) => (
        <Row>
          {row.map((letter) => (
            <Key
              key={letter}
              color={getBestColorForKey(letter)}
              onClick={() => handleKeyPress(letter)}
            >
              {letter}
            </Key>
          ))}
        </Row>
      ))}
    </KeyboardContainer>
  );
};

export default VirtualKeyboard;
