const players = ["Player 1", "Player 2", "Player 3", "Player 4"];

renderPlayers();

function renderPlayers() {
    const playerList = document.getElementById("player-list");

    players.forEach((player, index) => {
        const row = document.createElement("div");

        const seed = document.createElement("span");
        seed.textContent = index + 1;

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = player;

        const remove = document.createElement("button");
        remove.textContent = "✕";

        row.append(seed, nameInput, remove);
        playerList.appendChild(row);
    });
}
