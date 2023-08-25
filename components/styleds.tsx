import styled from "styled-components";

export const Container = styled.div`
  text-align: center;
  background-color: #333;
  color: #f0f0f0;
  min-height: 100vh;
`;

export const Key = styled.div`
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

export const InputBox = styled.input`
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

export const Button = styled.button`
  background: #555;
  border: none;
  color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #000, -5px -5px 10px #888;
  margin: 10px;
`;
