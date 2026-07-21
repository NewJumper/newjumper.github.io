import { Delaunay } from "https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm";
import { THEMES } from "./constants.js";

document.getElementById("theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    theme = dark ? THEMES.light : THEMES.dark;
    for(let i = 0; i < points.length; i++) {
        points[i].color = theme.secondary;
    }
});

const saved = localStorage.getItem("theme");
if(saved) {
    document.documentElement.dataset.theme = saved;
} else {
    document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const css = getComputedStyle(document.documentElement);
const canvas = document.getElementById("background");
const context = canvas.getContext("2d");
let theme = document.documentElement.dataset.theme === "dark" ? THEMES.dark : THEMES.light;

let width;
let height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const CELL_COUNT = 11;
const points = [];

for(let i = 0; i < CELL_COUNT; i++) {
    points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.1) * 0.2,
        vy: (Math.random() - 0.1) * 0.2,
        color: theme.secondary,
        opacity: Math.random() * 0.7
    });
}

function update() {
    for(const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
    }
}

function draw() {
    context.clearRect(0, 0, width, height);

    context.strokeStyle = theme.outline;
    context.lineWidth = 1;

    const delaunay = Delaunay.from(
        points,
        p => p.x,
        p => p.y
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    for(let i = 0; i < points.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if(!cell) continue;

        context.beginPath();
        context.moveTo(cell[0][0], cell[0][1]);
        for(let j = 1; j < cell.length; j++) {
            context.lineTo(cell[j][0], cell[j][1]);
        }
        context.closePath();

        context.fillStyle = `rgb(${points[i].color} / ${points[i].opacity})`;
        context.fill();
        context.stroke();
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();
