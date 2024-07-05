const theMaybeMan = 'https://raw.githubusercontent.com/NewJumper/newjumper.github.io/master/resources/lyrics_guess/AJR/The%20Maybe%20Man.txt'
const okOrchestra = 'https://raw.githubusercontent.com/NewJumper/newjumper.github.io/master/resources/lyrics_guess/AJR/OK%20ORCHESTRA.txt'

commenceTesting(-1)

let allSongs = ["test"]

function commenceTesting(index) {
    fetch(theMaybeMan).then(response => response.text()).then(data => {
        albumName = getAlbumName(theMaybeMan)
        console.log(albumName)

        songs = data.split(/(?:^|\n)(?=\w.*?=)/)
        songs.unshift(albumName)
        const container = document.getElementById('testing-container')
        allSongs.push(songs)
        console.log(allSongs)
        if(index == -1) {
            container.innerText = 'hi'
        } else {
            index = index % allSongs.length
            console.log(index)
            container.innerText = allSongs[index]
        }
    })
}

function getAlbumName(fileName) {
    songName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'))
    return songName.replaceAll('%20', ' ')
}

document.getElementById('test-button').addEventListener('click', () => {
    const value = document.getElementById('test-input').value
    commenceTesting(value)
});
