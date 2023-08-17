
import { useNavigate } from "react-router-dom";
import './GameModeSelector.css';
import React, {useEffect, useState} from "react";
import {db, fetchAndFiDndataByEmail, fetchAndFindIdByEmail, fetchforroom} from './Firebase';
import {addDoc, collection, serverTimestamp} from "firebase/firestore";

//import {fetchAndFindIdByEmail,updatePlayerDataroom,updatePlayerDataformess,fetchAndFindIdByEmailmess } from './Firebase';

function GameModeSelector(props) {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [room, SelecteRoom] = useState(null);
    const [ID, setSelecteID] = useState(null);
    const [roomID, setSelecteroomID] = useState(null);
    const [check,setcheck]=useState(true);
    const playerName = localStorage.getItem("playerName");
    const playerDataString = localStorage.getItem(playerName);
    const playerData = JSON.parse(playerDataString);
    const emaill = playerData.email;
    const [oxox, setoxox] = useState(null);
    const messagesRef = collection(db, "room");
    const [player2ac,setplayer2ac]=useState(true);
    const [player1ac,setplayer1ac]=useState(false);
    const handleComputerMode = () => {
        navigate('/game', { state: { name: 'cpu' } });
    };
    const handleRoomCodeSubmit = () => {
        addDoc(messagesRef, {
            code: ID,
            Player1:playerName,
            cells:["", "", "", "", "", "", "", "", ""],
            turn:"circle",
        });

        fetchforroom(ID)
            .then((result) => {
                setSelecteroomID(result);
                navigate('/game', {state:{name:'Player',check:check,room:room,ID:ID,roomID:result,player2ac:player1ac}});

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const joingame = () => {
        fetchforroom(oxox)
            .then((result) => {
                setSelecteroomID(result);
                navigate('/game', {state:{name:'Player',ID:oxox,check:check,room:room,roomID:result,player2ac:player2ac}});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePlayerMode = () => {
        setSelectedMode("player");

    };
    useEffect(() => {
        fetchAndFindIdByEmail(emaill)
            .then((result) => {
                setSelecteID(result);
            })
            .catch((error) => {
                console.error(error);
            });


    }, [handlePlayerMode]);


    return (
        <div className="container game-mode-selector">
            <h2>Choose a Game Mode</h2>
            <button onClick={handleComputerMode}>Play against Computer</button>
            <button onClick={handlePlayerMode} >Play against Another Player</button>

            {selectedMode === 'player' && (
                <div>
                    <h3>Create a New Room</h3>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={e => {
                            SelecteRoom(e.target.value);
                            setcheck(false);
                        } }

                    />

                    <h2>code :{ID}</h2>


                    <button onClick={handleRoomCodeSubmit}>Create Room</button>
                </div>
            )}

            {selectedMode === 'player' && (
                <div>
                    <h3>Join an Existing Room</h3>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => SelecteRoom(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter room code"
                        onChange={(e) => setoxox(e.target.value)}

                    />
                    <button onClick={joingame}>Join Room</button>
                </div>
            )}
        </div>
    );
}

export default GameModeSelector;

