const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

const tileSize = 32
const gridSize = 16;
const padding = 2;
canvas.width = padding + gridSize * (tileSize + padding)
canvas.height = padding + gridSize * (tileSize + padding)
console.log(canvas)

const t = document.getElementById("gridSize")

for(let i = 0; i < gridSize; i++) {
    for(let j = 0; j < gridSize; j++) {
        context.fillStyle = "black"
        context.fillRect(padding + i * (tileSize + padding), padding + j * (tileSize + padding), tileSize, tileSize)
        if(i == 0) context.fillStyle = "red"
        else context.fillStyle = "white"
        context.fillText(i + j * gridSize, padding + i * (tileSize + padding) + 3, padding + j * (tileSize + padding) + 12)
    }
}