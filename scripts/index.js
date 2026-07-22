import { Delaunay } from "https://cdn.jsdelivr.net/npm/d3-delaunay@6/+esm";

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width;
let height;
function resize() {
    const dpr = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const DEBUG = false;
const CELLS = 11;
const points = [];

let introIdle = true;
let transition = false;
let finishTransition = false;
let cId = 0;

for(let i = 0; i < CELLS; i++) {
    points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        ax: 0,
        ay: 0,
        color: "255 255 255",
        opacity: Math.random() * 0.1
    });
}

function update() {
    if(!transition) {
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
    }

    let clean = true;

    for(let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += p.ax;
        p.vy += p.ay;
        
        if(transition) {
            if(i === cId) {
                p.vx -= 0.00005 * (p.x - width / 2);
                if(p.y < height * 0.4) p.ay = 0;
                p.opacity = Math.max(p.opacity - 0.001, 0);
            } else {
                p.ay -= 0.000007 * Math.abs(p.x - width / 2);
                if(p.y > -1.35 * height) clean = false;
            }
        } else {
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
        }
    }

    if(transition && clean) finishTransition = true;
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    const delaunay = Delaunay.from(points, p => p.x, p => p.y);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    for(let i = 0; i < points.length; i++) {
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
        ctx.strokeStyle = "#689ed4";
        ctx.stroke();

        if(DEBUG) {
            // velocity vector
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.vx * 100, p.y + p.vy * 100);
            ctx.strokeStyle = "#000";
            ctx.stroke();

            // position dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = `#fff`;
            ctx.fill();

            // other info
            ctx.fillText(Math.hypot(p.vx, p.vy) * 10, p.x, p.y);
            ctx.fillText(i, p.x, p.y + 12);
        }
    }
}

function animate() {
    if(finishTransition) {
        transition = false;
        finishTransition = false;
        canvas.style.display = "none";
        return;
    }

    update();
    draw();
    requestAnimationFrame(animate);
}
animate();

document.getElementById("transition").addEventListener("click", () => {
    if(!introIdle || transition) return;
    introIdle = false;
    transition = true;

    let minDist = Number.MAX_VALUE;
    for(let i = 0; i < points.length; i++) {
        const p = points[i];
        const dist = Math.hypot(p.x - width / 2, p.y - height / 2);
        if(dist < minDist) {
            minDist = dist;
            cId = i;
        }
    }

    for(let i = 0; i < points.length; i++) {
        const p = points[i];
        if(i === cId) {
            if(p.y > height * 0.4) p.ay = -0.00003 * p.y;
            continue;
        }

        const dir = p.x < width / 2 ? -1 : 1;
        const hPos = Math.abs(p.x - width / 2) / (width / 2);
        const vPos = p.y / height;

        p.ax = 0.1 * dir * vPos;
        p.ay = -0.05 * hPos;
    }
});
