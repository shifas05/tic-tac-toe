import React, {useEffect, useState} from 'react';
import './App.css';

function Square({value, onSquareClick, isWinner}) {
    return (
        <button className={isWinner ? 'square winning-square' : 'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({squares, onPlay, winner}) {

    function handleClick(i) {
        if(!winner) {
            const nextSquares = squares.slice();
            onPlay(nextSquares, i)
        }
    }

    return (
        <>
            {[0, 1, 2].map(row => {
                return (
                    <div className="board-row" key={row}>
                        {[0, 1, 2].map(col => {
                            const i = row * 3 + col;
                            return (
                                <Square
                                    key={i}
                                    value={squares[i]}
                                    onSquareClick={() => handleClick(i)}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState(generateNumbers());
    const [time, setTime] = useState(0);
    const [winner, setWinner] = useState(false);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        if(winner) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [time])

    function handlePlay(nextSquares, index) {

        const row = Math.floor(index/3);
        const col = index % 3;

        if(isOrderedArray(nextSquares)) {
            setWinner(true);
        }

        // Check if square above is adjacent to null
        if(row > 0 && nextSquares[index - 3] === null) {
            nextSquares[index - 3] = nextSquares[index];
            nextSquares[index] = null;
            setHistory(nextSquares)
            setMoves(moves + 1);
        }

        // Check if square below is adjacent to null
        if(row < 2 && nextSquares[index + 3] === null) {
            nextSquares[index + 3] = nextSquares[index];
            nextSquares[index] = null;
            setHistory(nextSquares)
            setMoves(moves + 1);
        }

        // Check if square to the left is adjacent to null
        if (col > 0 && nextSquares[index - 1] === null) {
            nextSquares[index - 1] = nextSquares[index];
            nextSquares[index] = null;
            setHistory(nextSquares)
            setMoves(moves + 1);
        }

        // Check if square to the right is adjacent to null
        if (col < 2 && nextSquares[index + 1] === null) {
            nextSquares[index + 1] = nextSquares[index];
            nextSquares[index] = null;
            setHistory(nextSquares)
            setMoves(moves + 1);
        }
    }

    function onReset() {
        setHistory(generateNumbers());
        setTime(0);
        setWinner(false);
        setMoves(0);
    }

    let winnerMessage = '';
    if(winner) {
        winnerMessage = 'Congrats 🎉🥳';
    }

    return (
        <div className="game">
            <div><b>Time elapsed :</b> {time}</div>
            <div className="game-board">
                <Board
                    squares={history}
                    winner={winner}
                    onPlay={handlePlay}
                />
            </div>
            <div><b>Moves :</b> {moves}</div>
            <div>{winnerMessage}</div>
            <div className="btn-set">
                <button className="reset-btn" onClick={onReset}>Reset</button>
            </div>
        </div>
    );
}

function generateNumbers() {
    const arr = Array(9).fill(null);
    for (let i=1; i<=8; i++) {
        arr[i] = i;
    }
    return arr.sort(() => Math.random() - 0.5);
}

function isOrderedArray(array) {
    const arr = array.slice();
    arr[arr.indexOf(null)] = 9;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i-1]) {
            return false;
        }
    }
    return true;
}
