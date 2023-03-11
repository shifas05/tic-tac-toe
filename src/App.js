import React, {useState} from 'react';
import './App.css';

const data = [
    1, 1, 2, 5,
    2, 3, 3, 6,
    4, 4, 5, 6,
    7, 7, 8, 8
];

function Square({value, onSquareClick, isWinner}) {
    return (
        <button className={isWinner ? 'square winning-square' : 'square'} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({clickable, squares, onPlay}) {

    function handleClick(i) {
        if(clickable) {
            const nextSquares = squares.slice();
            nextSquares[i] = data[i];
            onPlay(nextSquares, i);
        }
    }

    return (
        <>
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

    function handlePlay(nextSquares, index) {
        if(index === prevId){
            return ;
        }
        const clickableValue = false;
        setClickable(clickableValue);





        if (!prevClicked) {
            setHistory(nextSquares);
            setPrevId(index);
            setPrevValue(nextSquares[index]);
            setPrevClicked(true);
            setClickable(true);
        } else {
            if (nextSquares[index] === prevValue && index !== prevId) {
                const match = [...matches, [index, nextSquares[index]], [prevId, nextSquares[prevId]]]
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

    return (
        <div className="game">
            <div className="game-board">
                <Board clickable={clickable} squares={history} onPlay={handlePlay}/>
            </div>
        </div>
    );
}
