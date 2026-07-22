import { Delaunay } from "https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm";

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width;
let height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const DEBUG = true;
const CELL_COUNT = 11;
const points = [];

for(let i = 0; i < CELL_COUNT; i++) {
    const m = Math.random() * 2 - 1;
    points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.1) * 0.2,
        vy: (Math.random() - 0.1) * 0.2,
        magnetism: -1,
        // color: "152 120 193",
        color: "255 255 255",
        opacity: Math.random() * (m + 1) / 20
    });
}

function update() {
    for(let i = 0; i < points.length; i++) {
        const a = points[i];
        for(let j = i + 1; j < points.length; j++) {
            const b = points[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distSqr = dx * dx + dy * dy;
            if(distSqr <= 200 || distSqr > 650000) continue;
            const dist = Math.sqrt(distSqr);

            const force = 0.5 / distSqr;
            const fx = dx / dist * force;
            const fy = dy / dist * force;

            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
        }
    }

    for(const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    const delaunay = Delaunay.from(
        points,
        p => p.x,
        p => p.y
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    for(let i = 0; i < points.length; i++) {
        ctx.strokeStyle = "#689ed4";
        const cell = voronoi.cellPolygon(i);
        if(!cell) continue;

        ctx.beginPath();
        ctx.moveTo(cell[0][0], cell[0][1]);
        for(let j = 1; j < cell.length; j++) {
            ctx.lineTo(cell[j][0], cell[j][1]);
        }
        ctx.closePath();

        const p = points[i];
        ctx.fillStyle = `rgb(${p.color} / ${p.opacity})`;
        ctx.fill();
        ctx.stroke();

        if(DEBUG) {
            // velocity vector
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.vx * 200, p.y + p.vy * 200);
            ctx.strokeStyle = "#000";
            ctx.stroke();

            // position dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = `#fff`;
            ctx.fill();
        }
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();
