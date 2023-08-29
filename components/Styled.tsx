import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  background-color: ${props => props.theme.colors.primary};
  color: #f0f0f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Key = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color || props.theme.colors.background};
  margin: 3px;
  cursor: pointer;
  font-weight: bold;
  font-size: 50px;
`;

export const InputBox = styled.input`
  width: 60px;
  height: 60px;
  background-color: #555;
  color: #f0f0f0;
  border: none;
  text-align: center;
  border-radius: 5px;
  margin: 3px;
  font-weight: bold;
  font-size: 50px;
`;

export const Button = styled.button`
  background: #555;
  border: none;
  color: #f0f0f0;
  border-radius: 5px;
  margin: 4px;
  font-size: 20px;
  padding: 10px;
  display: flex;
`;

export const DebugContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px dotted blue;
  * {
    border: 2px dotted red;
  }
`;
