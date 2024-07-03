const songs = [
    {
        "title": "song 1",
        "lyrics": [
            "line 1 of song 1",
            "line 2 of song 1",
            "line 3 of song 1"
        ]
    },
    {
        "title": "song 2",
        "artist": "blur",
        "lyrics": [
            "I got my head checked",
            "By a jumbo jet",
            "It wasn't easy",
            "But nothing is",
            "Woo-hoo",
            "When I feel heavy metal",
            "(Woo-hoo) And I'm pins and I'm needles",
            "(Woo-hoo) Well, I lie and I'm easy",
            "All of the time but I'm never sure why I need you",
            "Pleased to meet you",
            "I got my head done",
            "When I was young",
            "It's not my problem",
            "Yeah, yeah"
        ]
    }
]

let currentSong;
let currentLineIndex;
let guessHistory;
let guessIndex;

function startGame() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    currentLineIndex = Math.floor(Math.random() * currentSong.lyrics.length);
    guessHistory = [];
    guessIndex = -1;

    document.getElementById('lyrics-container').innerHTML = '';
    displayLyrics();
}

function displayLyrics() {
    const container = document.getElementById('lyrics-container');
    const nextLine = currentSong.lyrics[currentLineIndex];
    const newLine = document.createElement('div');
    newLine.textContent = nextLine;
    container.appendChild(newLine);
    if (container.childNodes.length > 16) container.removeChild(container.firstChild)
    
    container.scrollTop = container.scrollHeight;
}

document.getElementById('submit-guess').addEventListener('click', () => {
    submitGuess();
});

document.getElementById('guess-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

document.getElementById('guess-input').addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        cycleGuesses('up')
    } else if (event.key === 'ArrowDown') {
        cycleGuesses('down')
    }
});

function submitGuess() {
    const guess = document.getElementById('guess-input').value;

    if (guess.toLowerCase() === currentSong.title.toLowerCase()) {
        console.log("correct!")
        startGame();
    } else {
        currentLineIndex = Math.floor(Math.random() * currentSong.lyrics.length);
        displayLyrics();
        if(guess !== '') {
            guessHistory.unshift(guess);
        }
    }
    document.getElementById('guess-input').value = '';
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

// Start the game when the page loads
startGame();
