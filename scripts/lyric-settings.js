function toggleSettings() {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.classList.toggle('open');
}

function editFilters() {
    document.getElementById('game-container').style.alignItems = 'center';
    document.getElementById('lyrics-container').style.display = 'none';
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('filter-container').style.display = 'block';
    document.getElementById('filter-container').innerHTML = '';
    document.getElementById('filter-accept').style.display = 'block';

    const container = document.getElementById('filter-container');
    artists.forEach(artist => {
        const artistSelection = document.createElement('div');
        artistSelection.className = 'artist-selection';

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'filter-' + artist;
        checkbox.checked = selectedArtists.includes(artist);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(artist));
        artistSelection.appendChild(label);
        container.appendChild(artistSelection);
    })
}

function acceptFilter() {
    document.getElementById('game-container').style.alignItems = 'normal';
    document.getElementById('lyrics-container').style.display = 'block';
    document.getElementById('input-container').style.display = 'block';
    document.getElementById('filter-container').style.display = 'none';
    document.getElementById('filter-accept').style.display = 'none';

    selectedArtists = Array.from(document.querySelectorAll('#filter-container input:checked')).map(checkbox => checkbox.id.replace('filter-', ''));
    localStorage.setItem('selectedArtists', JSON.stringify(selectedArtists));
    loadSongs();
}
