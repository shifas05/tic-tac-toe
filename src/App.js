import { useState } from 'react';
import  './App.css';

function Square({ value, onSquareClick, isWinner }) {
    return (
        <button className={isWinner ? 'square winning-square' : 'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + squares[winner[0]];
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="status">{status}</div>
            {[0, 1 ,2].map(row => {
                return <div className="board-row">
                    {[0,1,2].map(col => {
                        const i = row * 3 + col;
                        return <Square
                            value={squares[i]}
                            onSquareClick={() => handleClick(i)}
                            isWinner={winner && winner.includes(i)}
                        />;
                    })}
                </div>
            })}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const [sortAscending, setMovesAsc] = useState(true);

    let moves = history.map((squares, move) => {
        let description;
        if (move === currentMove) {
            description = 'You are at move #' + move;
        } else if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                {move === currentMove ? description : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });


    moves = sortAscending
        ? moves
        : moves.slice().reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <button onClick={() => setMovesAsc(!sortAscending)}>{sortAscending ? 'ASC' : 'DESC' }</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}
