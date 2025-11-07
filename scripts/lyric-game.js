let loadedSongs = [];
let songIndices = [];
let currentSongIndex = -1;
let currentSongName;
let currentSong = [];
let guessHistory = []
let guessIndex = -1

let totalScore;
let correct;
let incorrect;
let skipped;

let artists = ['AJR', 'Sabrina Carpenter', 'Taylor Swift', 'Twenty One Pilots'];
let selectedArtists = ['AJR'];

document.addEventListener('DOMContentLoaded', () => {
    selectedArtists = JSON.parse(localStorage.getItem('selectedArtists')) || ['AJR'];
    loadSongs();
});

async function loadSongs() {
    loadedSongs = [];
    songIndices = [];
    currentSongIndex = -1;
    currentSongName = "";
    currentSong = [];

    totalScore = 0;
    correct = 0;
    incorrect = 0;
    skipped = 0;

    const source = 'https://api.github.com/repos/NewJumper/newjumper.github.io/contents/resources/lyrics_guess/';
    let index = 0;
    
    for (let artist of selectedArtists) {
        const path = `https://raw.githubusercontent.com/NewJumper/newjumper.github.io/master/resources/lyrics_guess/${artist}/`;
        const files = await fetch(source + artist).then(response => response.json());
        const albums = [];
        for (let file of files) {
            albums.push(fetch(path + file.name).then(response => response.text()));
        }

        const queriedAlbums = await Promise.all(albums);
        for (let album of queriedAlbums) {
            splitLines(album, index++);
        }
    }

    shuffleIndices();
    startGame();
}

function splitLines(data, index) {
    let songs = data.split(/(?:^|\n)(?=\w.*?=)/);
    storeIndices(songs.length, index)
    loadedSongs[index] = [];

    for (let song of songs) {
        lines = song.split(/\n/);
        loadedSongs[index].push(lines);
    }
}

function storeIndices(size, a) {
    for (let i = 0; i < size; i++) {
        songIndices.push([a, i])
    }
}

function shuffleIndices() {
    for (let i = songIndices.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        let index = songIndices[i]
        songIndices[i] = songIndices[j]
        songIndices[j] = index
    }
}

function startGame() {
    currentSongIndex++;
    if (currentSongIndex >= songIndices.length) {
        document.getElementById('lyrics-container').innerHTML = 'You did it! W\'s in the chat';
        document.getElementById('guess-input').value = 'WWWWWWWWWWWWWWWW';
        return;
    }
    const index = songIndices[currentSongIndex];
    currentSong = loadedSongs[index[0]][index[1]];
    currentSongName = currentSong[0].replace('=', '');
    console.log(currentSongName);

    document.getElementById('lyrics-container').innerHTML = '';
    displayLyrics();
}

function displayLyrics() {
    let lineIndex = Math.floor(Math.random() * (currentSong.length - 1)) + 1; // [1, song.length], basically excluding the song title

    const container = document.getElementById('lyrics-container');
    const songLine = currentSong[lineIndex];
    const newLine = document.createElement('div');
    newLine.textContent = songLine;
    
    if (container.childNodes.length > 0) {
        const children = Array.from(container.children);
        children[children.length - 1].style.color = 'gray';
        children[children.length - 1].style.fontSize = 15;
    }
    container.appendChild(newLine);
    if (container.childNodes.length > Math.min(15, container.scrollHeight / 22)) container.removeChild(container.firstChild);
    
    container.scrollTop = container.scrollHeight;
}

function skipSong() {
    if (currentSongIndex >= songIndices.length) return;
    skipped++;
    totalScore -= 4;
    document.getElementById('score-container').innerHTML = `Total Score: ${totalScore}<br>Correct: ${correct}<br>Incorrect: ${incorrect}<br>Skipped: ${skipped}`
    startGame();
}

document.getElementById('guess-input').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

document.getElementById('guess-input').addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
        cycleGuesses('up');
    } else if (event.key === 'ArrowDown') {
        cycleGuesses('down');
    }
});

function submitGuess() {
    if (currentSongIndex >= songIndices.length) return;

    const guess = document.getElementById('guess-input').value;
    document.getElementById('guess-input').value = '';

    if (guess.toLowerCase() === currentSongName.toLowerCase()) {
        correct++;
        totalScore += 7;
        startGame();
    } else {
        if(guess !== '') guessHistory.unshift(guess);
        incorrect++;
        totalScore--;
        displayLyrics();
    }

    document.getElementById('score-container').innerHTML = `Total Score: ${totalScore}<br>Correct: ${correct}<br>Incorrect: ${incorrect}<br>Skipped: ${skipped}`
}

function cycleGuesses(direction) {
    if (guessHistory.length === 0) return;
    
    if (direction === 'up' && guessIndex < guessHistory.length - 1) {
        guessIndex++
    } else if (direction === 'down') {
        if (guessIndex > 0) {
            guessIndex--;
        } else {
            guessIndex = -1;
            document.getElementById('guess-input').value = '';
            return;
        }
    }
    
    document.getElementById('guess-input').value = guessHistory[guessIndex];
}

function toggleScores() {
    const scoresMenu = document.getElementById('scores-menu');
    scoresMenu.classList.toggle('open');
}
