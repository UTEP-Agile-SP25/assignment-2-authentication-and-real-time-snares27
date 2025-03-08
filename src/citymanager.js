import { doc, setDoc, collection, getDocs, deleteDoc, query, onSnapshot } from "firebase/firestore";
import { logout } from "./auth";
import { db } from "./config";
import { getAuth } from "firebase/auth";


let unsubscribeSongs = null;


document.addEventListener('DOMContentLoaded', function() {
    const songForm = document.getElementById('songForm');
    if (songForm) {
        songForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSong();
        });
    }

    const refreshButton = document.getElementById('refreshSongs');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            document.getElementById('addMessage').innerHTML = '<p class="success">Song list updates </p>';
            setTimeout(() => {
                document.getElementById('addMessage').innerHTML = '';
            }, 3000);
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (unsubscribeSongs) {
                unsubscribeSongs();
            }
            logout();
            window.location.href = "index.html";
        });
    }

    const songList = document.getElementById('songList');
    if (songList) {
        songList.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-btn')) {
                const songId = e.target.getAttribute('data-id');
                if (songId) {
                    deleteSong(songId);
                }
            }
        });
    }

    setupRealtimeUpdates();
});
async function saveSong() {
    try {
        const songName = document.getElementById('songName').value.trim();
        const authorName = document.getElementById('authorName').value.trim();
        const releaseYear = document.getElementById('releaseYear').value.trim();

        if (!songName || !authorName || !releaseYear) {
            document.getElementById('addMessage').innerHTML = '<p class="error">Please fill out all fields</p>';
            return false;
        }
        
        const songId = songName.toLowerCase() + "-" + authorName.toLowerCase();
        const songRef = doc(db, "songs", songId);
        
        const songData = {
            name: songName,
            author: authorName,
            releaseYear: releaseYear,
            createdAt: new Date()
        };
        
        await setDoc(songRef, songData);
        
        console.log("Song Successfully Created");
        document.getElementById('addMessage').innerHTML = '<p class="success">Song added successfully!</p>';
        
        document.getElementById('songName').value = "";
        document.getElementById('releaseYear').value = "";
        document.getElementById('authorName').value = "";

        
        return true;
    } catch (error) {
        console.error("Error saving song:", error);
        document.getElementById('addMessage').innerHTML = '<p class="error">Error adding song: ' + error.message + '</p>';
        return false;
    }
}

function setupRealtimeUpdates() {
    try {
        const songsRef = collection(db, "songs");
        const q = query(songsRef);

        unsubscribeSongs = onSnapshot(q, (querySnapshot) => {
            
            let songListHTML = "";
            
            if (querySnapshot.empty) {
                songListHTML = "<p>No songs found. Add some!</p>";
            } else {
                querySnapshot.forEach((doc) => {
                    const songData = doc.data();
                    songListHTML += `
                        <div class="song-card">
                            <p><strong>Song:</strong> ${songData.name}</p>
                            <p><strong>Artist:</strong> ${songData.author}</p>
                            <p><strong>Release Year:</strong> ${songData.releaseYear}</p>
                            <button class="delete-btn" data-id="${doc.id}">Delete</button>
                        </div>
                    `;
                });
            }
            
            document.getElementById('songList').innerHTML = songListHTML;
        }, (error) => {
            document.getElementById('songList').innerHTML = '<p class="error">Error fetching songs: ' + error.message + '</p>';
        });
        
    } catch (error) {
        console.error("Error updates:", error);
        document.getElementById('songList').innerHTML = '<p class="error">Error setting updates: ' + error.message + '</p>';
    }
}

async function deleteSong(songId) {
    try {
        if (!confirm("Are you sure you want to delete this song?")) {
            return false;
        }
        
        await deleteDoc(doc(db, "songs", songId));
        console.log("Song successfully deleted");
        document.getElementById('addMessage').innerHTML = '<p class="success">Song deleted successfully!</p>';
        return true;
    } catch (error) {
        console.error("Error deleting song:", error);
        document.getElementById('addMessage').innerHTML = '<p class="error">Error deleting song: ' + error.message + '</p>';
        return false;
    }
}

