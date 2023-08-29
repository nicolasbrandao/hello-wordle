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
  width: 25px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color || "#555"};
  cursor: pointer;
`;

type Props = {
  // FIXME: fix this eslint error
  // eslint-disable-next-line no-unused-vars
  getBestColorForKey: (letter: string) => string,
  // eslint-disable-next-line no-unused-vars
  handleKeyPress: (letter: string) => void
}

function VirtualKeyboard({ getBestColorForKey, handleKeyPress }: Props) {
  const qwertyLayout = [
    [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P"
    ],
    [
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L"
    ],
    [
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M"
    ],
  ];

  return (
    <KeyboardContainer>
      {qwertyLayout.map((row, index) => (
        <Row key={index}>
          {row.map((letter) => (
            <Key
              color={getBestColorForKey(letter)}
              key={letter}
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
