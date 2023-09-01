import { useViewState } from "../context/gameState";
import { GameStatus } from "../context/gameState";

type Props = {
  message?: string
}

export default function Dialog({ message }: Props) {
  const state = useViewState();
  return (
    <div style={{height: "50px"}}>
      {state.status === GameStatus.Won && <h2>You Won</h2>}
      {state.status === GameStatus.Failed && <h2>You Lost</h2>}
      {message && <h2>{message}</h2>}
    </div>
  );
}
