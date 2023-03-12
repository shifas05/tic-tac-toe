import React, {useEffect, useState} from 'react';
import './App.css';

function Square({value, onSquareClick, isWinner}) {
    return (
        <button className={isWinner ? 'square winning-square' : 'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({clickable, squares, onPlay, moves, winner, time, loser, data}) {

    function handleClick(i) {
        if(clickable) {
            const nextSquares = squares.slice();
            nextSquares[i] = data[i];
            onPlay(nextSquares, i);
        }
    }

    let status = '';
    if (winner) {
        status = 'Congrats 🎉🥳';
    }

    if (loser) {
        status = 'Your time is over 😔';
    }


    return (
        <>
            <div><b>Moves:</b>&nbsp;{moves}</div><div><b>Time remaining:</b> {time}</div>
            <br/>
            {[0, 1, 2, 3].map(row => {
                return (
                    <div className="board-row" key={row}>
                        {[0, 1, 2, 3].map(col => {
                            const i = row * 4 + col;
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
            <br/>
            <div>{status}</div>
            <br/>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState(Array(16).fill(null));
    const [prevId, setPrevId] = useState(null);
    const [prevValue, setPrevValue] = useState(null);
    const [prevClicked, setPrevClicked] = useState(false);
    const [clickable, setClickable] = useState(true);
    const [matches, setMatches] = useState([]);
    const [moves, setMoves] = useState(0);
    const [winner, setWinner] = useState(false);
    const [loser, setLoser] = useState(false);
    const [time, setTime] = useState(31);
    const [data, setData] = useState(generateNumbers());


    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 1 && !winner) {
                    setLoser(true);
                    setClickable(false);
                    clearInterval(interval);
                }
                if (winner) {
                    clearInterval(interval);
                    setClickable(false);
                }
                return prevTime - 1
            });
        }, 1000);

        if(winner) {
            clearInterval(interval);
            setClickable(false);
        }

        if ((time+1) === 0) {
            clearInterval(interval);
            setClickable(false);
            setLoser(true);
        }

        return () => clearInterval(interval);
    }, [time]);

    function handlePlay(nextSquares, index) {
        const clickableValue = false;
        setClickable(clickableValue);

        if (!prevClicked) {
            setHistory(nextSquares);
            setPrevId(index);
            setPrevValue(nextSquares[index]);
            setPrevClicked(true);
            setClickable(true);
        } else {
            setMoves(moves + 1);
            if (nextSquares[index] === prevValue && index !== prevId) {
                const match = [...matches, [index, nextSquares[index]], [prevId, nextSquares[prevId]]];
                if(match.length === 16) {
                    setWinner(true);
                }
                setMatches(match)
                setHistory(nextSquares);
                setClickable(true);
            } else {
                setHistory(nextSquares);
                setTimeout(() => {
                    const newBoard2 = Array(16).fill(null);
                    matches.forEach((val, idx) => {
                        newBoard2[val[0]] = val[1];
                    });
                    setHistory(newBoard2);
                    setClickable(true);
                }, 1000);
            }
            setPrevClicked(false);
        }
    }

    function onReset() {
        setHistory(Array(16).fill(null));
        setData(generateNumbers());
        setPrevId(null);
        setPrevValue(null);
        setPrevClicked(false);
        setClickable(true);
        setMatches([]);
        setMoves(0);
        setTime(31);
        setWinner(false);
        setLoser(false);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    clickable={clickable}
                    squares={history}
                    onPlay={handlePlay}
                    moves={moves}
                    winner={winner}
                    time={time}
                    loser={loser}
                    data={data}
                />
                <button onClick={onReset}>RESET</button>
            </div>
        </div>
    );
}

function generateNumbers() {
    const numbers = [];
    for (let i = 1; i <= 8; i++) {
        numbers.push(i);
        numbers.push(i);
    }
    return numbers.sort(() => Math.random() - 0.5);
}
