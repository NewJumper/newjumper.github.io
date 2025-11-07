document.addEventListener("DOMContentLoaded", function () {
    // Get the grid container
    const gridContainer = document.getElementById("grid-container");

    // Create a 4x4 grid
    for (let i = 0; i < 16; i++) {
        const square = document.createElement("div");
        square.className = "square";

        // Add a click event listener to change the color on click
        square.addEventListener("click", function () {
            changeColor(square);
        });

        gridContainer.appendChild(square);
    }

    // Function to change the color of a square
    function changeColor(square) {
        // Generate a random color
        const randomColor = getRandomColor();

        // Change the background color of the square
        square.style.backgroundColor = randomColor;
    }

    // Function to generate a random color
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
