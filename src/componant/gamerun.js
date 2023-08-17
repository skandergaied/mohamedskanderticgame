import React, { useState, useEffect } from "react";
import Cell from "./cell";
import {Navigate, useLocation} from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    database,
    fetchAndFindIdByEmail,
    updatePlayerData,
    fetchAndFiDndataByEmail,
    colRefformess, colrefroom,

} from './Firebase';
import {useNavigate } from "react-router-dom";
import {doc, getDocs, serverTimestamp, updateDoc,onSnapshot} from "firebase/firestore";
import {db } from './Firebase';
import {
    collection,
    addDoc,
} from "firebase/firestore";
const Game = () => {
    const [cells, setCells] = useState(["", "", "", "", "", "", "", "", ""]);
    const [go, setGo] = useState("circle");
    const [winningMessage, setWinningMessage] = useState(null);
    const [ScoreX, setScoreX] = useState(0);
    const [ScoreO, setScoreO] = useState(0);
    const [numberofgame, setnumberofgame] = useState(0);
    const [showscorebored,setShowscorebored]=useState(false)
    const message = "It is now " + go + "'s go.";
    const playerNameInput = localStorage.getItem("playerName");
    const playerName = localStorage.getItem("playerName");
    const playerDataString = localStorage.getItem(playerName);
    const playerData = JSON.parse(playerDataString);
    const emaill = playerData.email;
    const history = useNavigate()
    const [seconds,setseconds]=useState(0);
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();
    const messagesRef = collection(db, "message");
    useEffect(() => {
        async function fetch2(email,code1) {
            try {
                const snapshot = await getDocs(colRefformess);
                let books = [];
                snapshot.docs.forEach((doc) => {
                    books.push({ ...doc.data() });
                    let mess = [];
                    for (let i = 0; i < books.length; i++) {
                        if(books[i].code==code1){
                            mess.push(books[i]);
                        }
                    }
                    mess.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
                    setMessages(mess);
                });
            } catch (error) {
                console.error("Error getting documents:", error);
                return null;
            }
        }
        fetch2(emaill,location.state.ID);

        //------------------------------------
    }, [location.state.name==='Player']); // Use location.state.room as the dependency

    useEffect(() => {
        fetchAndFiDndataByEmail(emaill)
            .then((userData) => {
                if (userData) {
                    setScoreO(userData.numberOfWins);
                    setScoreX(userData.numberOfLosses);
                    setnumberofgame(userData.numberOfGames);
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }, [location.state.name==="cpu"]);



    useEffect(() => {
        const mot=location.state.player2ac;
        if(mot===true){
            const playerRef = doc(db, "room",location.state.roomID);
            updateDoc(playerRef, {
                Player2: playerName,
                cells,
            });
        }
    }, []);
    useEffect(() => {
        async function fetch2(email,code1) {
            try {
                const snapshot = await getDocs(colRefformess);
                let books = [];
                snapshot.docs.forEach((doc) => {
                    books.push({ ...doc.data() });
                    let mess = [];
                    for (let i = 0; i < books.length; i++) {
                        if(books[i]?.code==code1){
                            mess.push(books[i]);
                        }
                    }
                    mess.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
                    setMessages(mess);
                });
            } catch (error) {
                console.error("Error getting documents:", error);
                return null;
            }
        }
        fetch2(emaill,location.state.ID);

        //------------------------------------
    }, [newMessage, setNewMessage,cells,location.state.name==="Player"]);


    useEffect(() => {
        let timer;
        if (go === "circle" && seconds < 30) { // Only start the timer if it's circle's turn and timer is less than 30 seconds
            timer = setInterval(() => {
                setseconds((seconds) => seconds + 1);
            }, 1000);
        } else {
            clearInterval(timer);
            setseconds(0);
            if (go === "circle" && seconds >= 30) {
                setScoreX((ScoreX) => ScoreX + 1);
                setCells(["", "", "", "", "", "", "", "", ""]);
                setGo("circle");
                setWinningMessage(null);
                setnumberofgame((numberofgame) => numberofgame + 1);
                const initialPlayerData = { score: ScoreO, numberOfGames: numberofgame };
                localStorage.setItem(playerNameInput, JSON.stringify(initialPlayerData));
                const updatedPlayerData = {
                    ...playerData,
                    score: ScoreO,
                    numberOfGames: numberofgame,
                };
                localStorage.setItem(playerNameInput, JSON.stringify(updatedPlayerData));

                fetchAndFindIdByEmail(emaill)
                    .then((result) => {
                        updatePlayerData(result, ScoreO, numberofgame + 1,ScoreX);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        return () => clearInterval(timer); // Cleanup when component unmounts or effect reruns
    }, [go, seconds]);


    const chekscore =()=>{
        const winningCombos=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        if (winningCombos.some(array => array.every(cell => cells[cell] === "circle"))) {
            setWinningMessage("Circle wins!");
            setGo(' ');
            setScoreO((ScoreO) => ScoreO + 1);
            return;
        }

        if (winningCombos.some(array => array.every(cell => cells[cell] === "cross"))) {
            setWinningMessage("Cross wins!");
            setGo(' ');
            setScoreX((ScoreX) => ScoreX + 1);
            return;
        }


    };
    //message
    const handleSubmit1 = async (event) => {
        event.preventDefault();

        if (newMessage === "") return;
        //------------
        await addDoc(messagesRef, {
            room: location.state.room,
            code: location.state.ID,
            createdAt:serverTimestamp(),
            text:newMessage,
            user:playerName
        });
        setNewMessage("");
    };

    const resetGame = () => {
        setCells(["", "", "", "", "", "", "", "", ""]);
        setGo("circle");
        setWinningMessage(null);
        setScoreO(0);
        setScoreX(0);
        setnumberofgame(0);
        const initialPlayerData = { score: ScoreO, numberOfGames: numberofgame };
        localStorage.setItem(playerNameInput, JSON.stringify(initialPlayerData));
        const updatedPlayerData = {
            ...playerData,
            score: ScoreO,
            numberOfGames: numberofgame,
        };
        localStorage.setItem(playerNameInput, JSON.stringify(updatedPlayerData));

        fetchAndFindIdByEmail(emaill)
            .then((result) => {
                updatePlayerData(result, 0, 0,0);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const playAgain = (e) => {
        setCells(["", "", "", "", "", "", "", "", ""]);
        setGo("circle");
        setWinningMessage(null);
        setnumberofgame((numberofgame) => numberofgame + 1);
        e.preventDefault();
        const playerRef = doc(db, "room",location.state.roomID);
        if(location.state.name==="Player"){
            updateDoc(playerRef, {
                cells,
                turn:'circle',
            });
        }

        const initialPlayerData = { score: ScoreO, numberOfGames: numberofgame };
        localStorage.setItem(playerNameInput, JSON.stringify(initialPlayerData));
        const updatedPlayerData = {
            ...playerData,
            score: ScoreO,
            numberOfGames: numberofgame,
        };
        localStorage.setItem(playerNameInput, JSON.stringify(updatedPlayerData));

        fetchAndFindIdByEmail(emaill)
            .then((result) => {
                updatePlayerData(result, ScoreO, numberofgame + 1,ScoreX);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const handleClick = () =>{
        signOut(database).then(val=>{
            history('/')
        })
    }

    const scorebored = () => {
        setShowscorebored(true)
    };
    //----------------------------------
    useEffect(() => {
        async function fetchforroom233() {
            try {
                const snapshot = await getDocs(colrefroom);
                let books = [];
                snapshot.docs.forEach((doc) => {
                    books.push({...doc.data(), id: doc.id});
                });
                for (const book of books) {
                    if (book.id === location.state.roomID) {
                        setCells(book.cells);
                    }
                }
                return null;

            } catch (error) {
                console.error("Error getting documents:", error);
                return null;
            }
        }
        fetchforroom233()
        //------------------------------------------------
        async function updatego() {
            try {
                const snapshot = await getDocs(colrefroom);
                let books = [];
                snapshot.docs.forEach((doc) => {
                    books.push({...doc.data(), id: doc.id});
                });
                for (const book of books) {
                    if (book.id === location.state.roomID) {
                        setGo(book.turn);
                    }
                }
                return null;

            } catch (error) {
                console.error("Error getting documents:", error);
                return null;
            }
        }
        updatego();

    }, [go,setGo,cells,location.state.name==='Player']);
    useEffect(() => {
        chekscore();
        if(location.state.name==='Player'){
            const playerRef = doc(db, "room",location.state.roomID);
            updateDoc(playerRef, {
                cells
            });
        }

    }, [cells]);
    if(showscorebored){
        return <Navigate to="/scoreboard" />;

    }

    const cheek=location.state.name;
    return (
        <div className="app">
            <h1>Tic tac toe </h1>
            <div className="score-container">
                {cheek === 'Player' && location.state.check===false &&(
                    <div className="score-container">
                        <p>Welcome to: {location.state.room.toUpperCase()} </p>
                    </div>
                )}

                <p>Score X: {ScoreX}</p>
                <p>Score O: {ScoreO}</p>
                <p>number of games: {numberofgame}</p>
                <div className="timer-container">
                    <p>Timer: {seconds} seconds</p>
                </div>
                <button onClick={scorebored} className="game-button">
                    Scoreboard
                </button>

                <div className="chat-and-game-container">
                    {cheek === 'Player' && (  <div className="chat-app">
                        <div className="messages">
                            {messages.map((message) => (
                                <div key={message.name} className="message">
                                    <span className="user">{"   "}{message.user}:</span>{"    "} {/* Add a space character */} {message.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit1} className="new-message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(event) => setNewMessage(event.target.value)}
                                className="new-message-input"
                                placeholder="Type your message here..."
                            />
                            <button type="submit" className="send-button">
                                Send
                            </button>
                        </form>
                    </div>)}

                    <div className="game-container">
                        <div className="gamebored">

                            {cells.map((cell, index) => (
                                <Cell
                                    key={index}
                                    id={index}
                                    cell={cell}
                                    setCells={setCells}
                                    go={go}
                                    setGo={setGo}
                                    cells={cells}
                                    winningMessage={winningMessage}
                                />
                            ))}
                        </div>
                        <p>{winningMessage || message}</p>
                        <button onClick={playAgain} className="game-button">
                            Play Again
                        </button>
                        <button onClick={resetGame} className="game-button">Reset Game</button>
                        <button onClick={handleClick} className="logout-button">Log out</button>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default Game;
