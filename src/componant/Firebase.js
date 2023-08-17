
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Corrected imports
import { doc } from "firebase/firestore";
import {updateDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJp8e9k7KM4EBxWzE8h7lvzV5-LKNHay4",
    authDomain: "lastone-e3208.firebaseapp.com",
    projectId: "lastone-e3208",
    storageBucket: "lastone-e3208.appspot.com",
    messagingSenderId: "636313119587",
    appId: "1:636313119587:web:186b5d98b28c4b40e40156",
    measurementId: "G-YVFPK90BXX"
};

const app = initializeApp(firebaseConfig);
const database  = getAuth(app);
const db = getFirestore(app);


const colRef = collection(db, 'players');
const colRefformess= collection(db, 'message');
const colrefroom=collection(db, 'room');
async function getDocumentIDs() {
    try {
        const snapshot = await getDocs(colRef);
        let book = []; // Initialize the array outside the loop
        snapshot.docs.forEach((doc) => {
            // Push only the data of the document into the book array
            book.push({ ...doc.data() });

        });
        return book; // Return the array after the loop finishes
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error; // Propagate the error further
    }
}


// Call the fetchData function


//*******************************************
function fetchAndProcessDocuments(){
    getDocs(colRef)
        .then((snapshot) => {
            let books = [];
            snapshot.docs.forEach((doc) => {
                books.push({ ...doc.data(), id: doc.id });
            });
        })
        .catch((error) => {
            console.error("Error getting documents:", error);
        });
}
//*****************************************************
function findIdByEmail(email, books) {
    for (const book of books) {
        if (book.email === email) {
            return book.id;
        }
    }
    return null;
}

async function fetchAndFindIdByEmail(email) {
    try {
        const snapshot = await getDocs(colRef);
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        const foundId = findIdByEmail(email, books);
        if (foundId) {
            return foundId;
        } else {
            console.log("No document found with the email " + email + ".");
            return null; // Return null to indicate that no document was found
        }
    } catch (error) {
        console.error("Error getting documents:", error);
        return null;
    }
}
//fetchformess
async function fetchAndFindIdByEmailmess(email) {
    try {
        const snapshot = await getDocs(colRefformess);
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        const foundId = findIdByEmail(email, books);
        if (foundId) {
            return foundId;

        } else {
            console.log("No document found with the email " + email + ".");
            return null; // Return null to indicate that no document was found
        }
    } catch (error) {
        console.error("Error getting documents:", error);
        return null;
    }
}
//

const updatePlayerData = async (playerName, newScore, newNumberOfGames,loose) => {
    const playerRef = doc(db, "players",playerName);
    try {
        await updateDoc(playerRef, {
            numberOfWins: newScore,
            numberofgames: newNumberOfGames,
            numberoflosing:loose
        });
        console.log("Player data updated successfully in Firestore.");
    } catch (error) {
        console.error("Error updating player data in Firestore:", error);
    }
};
//******************************
const updatePlayerDataformess = async (playerName, room, password,time,meesagetext,name) => {
    const playerRef = doc(db, "message",playerName);
    try {
        await updateDoc(playerRef, {
            room: room,
            code: password,
            createdAt:time,
            text:meesagetext,
            user:name
        });
        console.log("Player data updated successfully in Firestore.");
    } catch (error) {
        console.error("Error updating player data in Firestore:", error);
    }
};
//***************************************
const updatePlayerDataroom = async (playerName, room, password) => {
    const playerRef = doc(db, "message",playerName);
    try {
        await updateDoc(playerRef, {
            room: room,
            code: password,
        });
        console.log("Player data updated successfully in Firestore.");
    } catch (error) {
        console.error("Error updating player data in Firestore:", error);
    }
};

//message
function findDataByEmail(email, books) {
    for (const book of books) {
        if (book.email === email) {
            return {
                numberOfGames: book.numberofgames,
                numberOfWins: book.numberOfWins,
                numberOfLosses: book.numberoflosing,
            };
        }
    }
    return null;
}

async function fetchAndFiDndataByEmail(email) {
    try {
        const snapshot = await getDocs(colRef);
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        const userData = findDataByEmail(email, books);
        if (userData) {
            return userData;
        } else {
            console.log("No document found with the email " + email + ".");
            return null; // Return null to indicate that no document was found
        }
    } catch (error) {
        console.error("Error getting documents:", error);
        return null;
    }
}
//roommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
function findDatabycode(code, books) {
    for (const book of books) {
        if (book.code === code) {
            return book.id;
        }
    }
    return null;
}

async function fetchforroom(code) {
    try {
        const snapshot = await getDocs(colrefroom);
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        });
        const userData = findDatabycode(code, books);
        if (userData) {
            return userData;
        } else {
            console.log("No document found with the email " + code + ".");
            return null; // Return null to indicate that no document was found
        }

    } catch (error) {
        console.error("Error getting documents:", error);
        return null;
    }
}
//------------------------rommupdate
function findgo(roomID, books,setGo1) {
    for (const book of books) {
        //  console.log(book.turn);
        if (book.id === roomID) {
            setGo1(book.turn);
            return book.turn;

        }
    }
    return null;
}

//---------------------

export { database, db ,colrefroom,fetchforroom,colRefformess,fetchAndFindIdByEmailmess,updatePlayerDataformess,updatePlayerDataroom, getDocumentIDs,fetchAndProcessDocuments,fetchAndFindIdByEmail,updatePlayerData,fetchAndFiDndataByEmail};

