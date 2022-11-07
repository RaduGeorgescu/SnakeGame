import { useRef, useEffect, useState } from "react";
import "./styles/global.css";

function App() {
  const board_border = "black";
  const board_background = "white";
  const food_background = "lightgreen";
  const food_border = "darkgreen";
  let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ];

  let score = 0;
  const [game, setGame] = useState(true);
  let changing_direction = false;
  let food_x: number;
  let food_y: number;
  let dx = 10;
  let dy = 0;

  const snakeBoardRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const snakeBoard: HTMLCanvasElement = snakeBoardRef.current!;

    const snakeBoard_ctx = snakeBoard.getContext("2d")!;
    main(snakeBoard, snakeBoard_ctx, snakeBoardRef);
    generateFood(snakeBoard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const main = (
    snakeBoard: HTMLCanvasElement,
    snakeBoard_ctx: CanvasRenderingContext2D,
    snakeBoardRef: React.RefObject<HTMLCanvasElement>
  ) => {
    if (hasGameEnded(snakeBoard)) {
      setGame(false);
      return;
    }
    changing_direction = false;
    setTimeout(function onTick() {
      clearCanvas(snakeBoard_ctx);
      drawFood(snakeBoard_ctx);
      moveSnake(snakeBoard);
      drawSnake(snakeBoard_ctx);
      main(snakeBoard, snakeBoard_ctx, snakeBoardRef);
    }, 140);
  };

  const clearCanvas = (snakeBoard_ctx: CanvasRenderingContext2D) => {
    snakeBoard_ctx.fillStyle = board_background;
    snakeBoard_ctx.strokeStyle = board_border;
    snakeBoard_ctx.fillRect(
      0,
      0,
      snakeBoard_ctx.canvas.width,
      snakeBoard_ctx.canvas.height
    );
    snakeBoard_ctx.strokeRect(
      0,
      0,
      snakeBoard_ctx.canvas.width,
      snakeBoard_ctx.canvas.height
    );
  };
  const drawFood = (snakeBoard_ctx: CanvasRenderingContext2D) => {
    snakeBoard_ctx.fillStyle = food_background;
    snakeBoard_ctx.strokeStyle = food_border;
    snakeBoard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeBoard_ctx.strokeRect(food_x, food_y, 10, 10);
  };

  const drawSnake = (snakeBoard_ctx: CanvasRenderingContext2D) => {
    snake.forEach((segment) => {
      snakeBoard_ctx.fillStyle = "hsl(" + 360 * Math.random() + ", 50%, 50%)";
      snakeBoard_ctx.strokeStyle = "#000000";
      snakeBoard_ctx.fillRect(segment.x, segment.y, 10, 10);
      snakeBoard_ctx.strokeRect(segment.x, segment.y, 10, 10);
    });
  };
  const moveSnake = (snakeBoard: HTMLCanvasElement) => {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const hasEatenFood = snake[0].x === food_x && snake[0].y === food_y;
    if (hasEatenFood) {
      score += 1;
      const elem = document.getElementById("score")!;
      elem.innerHTML = score.toString();
      generateFood(snakeBoard);
    } else {
      snake.pop();
    }
  };

  const randomFood = (min: number, max: number) => {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  };
  const generateFood = (snakeBoard: HTMLCanvasElement) => {
    food_x = randomFood(0, snakeBoard.width - 10);
    food_y = randomFood(0, snakeBoard.height - 10);
    snake.forEach(function has_snake_eaten_food(part) {
      const hasEaten = part.x === food_x && part.y === food_y;
      if (hasEaten) generateFood(snakeBoard);
    });
  };

  const hasGameEnded = (snakeBoard: HTMLCanvasElement) => {
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeBoard.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeBoard.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
  };

  const changeDirection = (event: KeyboardEvent) => {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changing_direction) return;

    changing_direction = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -10;
      dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = 10;
      dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = 10;
    }
  };
  document.addEventListener("keydown", changeDirection);

  return (
    <div className="container flex flex-col items-center mx-auto">
      <h1 className="mt-4 text-xl">Let's play snake game</h1>
      <p className="mt-4"> You play with your arrow keys </p>
      <h5 className="mt-4 text-5xl" id="score">
        0
      </h5>
      <button
        className="mt-4 p-2 bg-amber-300 text-black font-bold rounded"
        onClick={() => {
          window.location.reload();
        }}
      >
        Restart game
      </button>
      <canvas ref={snakeBoardRef} width="400" height="400" className="mt-4 " />
      <p
        className={
          game === false ? "text-red-600 text-xl font-bold mt-4" : "invisible "
        }
      >
        You Lost
      </p>
    </div>
  );
}

export default App;
