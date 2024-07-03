const theMaybeMan = 'https://raw.githubusercontent.com/NewJumper/newjumper.github.io/master/resources/lyrics_guess/ajr/the%20maybe%20man.txt'

commenceTesting(-1)

function commenceTesting(index) {
    fetch(theMaybeMan).then(response => response.text()).then(data => {
        songs = data.split(/(?:^|\n)(?=\w.*?=)/)
        const container = document.getElementById('testing-container');
        if(index == -1) {
            container.innerText = 'hi'
        } else {
            index = index % songs.length
            console.log(index)
            container.innerText = songs[index]
        }
    })
}

document.getElementById('test-button').addEventListener('click', () => {
    const value = document.getElementById('test-input').value;
    commenceTesting(value);
});
