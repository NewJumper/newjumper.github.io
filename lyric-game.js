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
let currentLineIndex = 0;
let previousGuesses = [];

function startGame() {
    currentSong = songs[Math.floor(Math.random() * songs.length)];
    currentLineIndex = Math.floor(Math.random() * currentSong.lyrics.length);
    previousGuesses = [];
    displayCurrentLine();
    updatePreviousGuesses();
}

function displayCurrentLine() {
    document.getElementById('lyrics').innerText = currentSong.lyrics[currentLineIndex];
}

function updatePreviousGuesses() {
    document.getElementById('previous-guesses').innerText = previousGuesses.join(', ');
}

document.getElementById('submit-guess').addEventListener('click', () => {
    submitGuess();
});

document.getElementById('guess-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

function submitGuess() {
    const userGuess = document.getElementById('guess-input').value;

    if (userGuess.toLowerCase() === currentSong.title.toLowerCase()) {
        console.log("correct!")
        startGame();
    } else {
        currentLineIndex = Math.floor(Math.random() * currentSong.lyrics.length);
        displayCurrentLine();
        if(userGuess !== '') {
            previousGuesses.push(userGuess);
            updatePreviousGuesses();
        }
    }
    document.getElementById('guess-input').value = '';
}

// Start the game when the page loads
startGame();
