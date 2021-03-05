import React, { useEffect, useRef, useState } from 'react';
import { actions, socket } from '../App';
import './canvas.scss';

interface CanvasMouse {
    click: boolean;
    move: boolean;
    pos: {
        x: number;
        y: number;
    };
    pos_prev: {
        x: number;
        y: number;
    } | false
}

const Canvas = () => {
    const [color, setColor] = useState('#E14E09');

    const innerLoop = (mouse: CanvasMouse) => {
        if (!mouse.click) return;
        if (mouse.move && mouse.pos_prev) {
            socket.emit("hud_inner_action", { action: "drawLine", data: [mouse.pos, mouse.pos_prev, color] })
            mouse.move = false;
        }
        if (mouse.pos.x && mouse.pos.y) {
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
        }

    }
    const innerLoopRef = useRef(innerLoop);

    useEffect(() => {
        innerLoopRef.current = innerLoop;
    })

    useEffect(() => {
        const mouse: CanvasMouse = {
            click: false,
            move: false,
            pos: { x: 0, y: 0 },
            pos_prev: false
        };

        const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if (!context) return;
        const width = 1920;
        const height = 1080;

        canvas.width = width;
        canvas.height = height;

        const onTouchStart = () => { mouse.click = true; mouse.pos_prev = false; };
        const onTouchEnd = () => { mouse.click = false; mouse.pos_prev = false; mouse.pos = { x: 0, y: 0 } };
        const onTouchMove = (e: any) => {
            let x = e.clientX;
            let y = e.clientY;
            if (x === undefined && y === undefined) {
                if (!e.touches || !e.touches.length) return;
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            }
            if (!x || !y) return;

            mouse.pos.x = x;
            mouse.pos.y = y;
            mouse.move = true;
        }

        canvas.addEventListener('mousedown', onTouchStart, false);
        canvas.addEventListener('mousemove', onTouchMove, false);
        canvas.addEventListener('mouseup', onTouchEnd, false);

        canvas.addEventListener('touchstart', onTouchStart, false);
        canvas.addEventListener('touchmove', onTouchMove, false);
        canvas.addEventListener('touchend', onTouchEnd, false);

        actions.on("drawLine", (line: [{ x: number, y: number }, { x: number, y: number }, string]) => {
            context.beginPath();
            context.strokeStyle = line[2];
            context.lineWidth = 2.5;
            context.moveTo(line[0].x, line[0].y);
            context.lineTo(line[1].x, line[1].y);
            context.stroke();
        });

        actions.on("clearCanvas", () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });


        function mainLoop() {
            innerLoopRef.current(mouse);
            setTimeout(mainLoop, 25);
        }
        mainLoop();

        window.addEventListener("keydown", event => {
            if (event.key === "c") {
                socket.emit("hud_inner_action", { action: "clearCanvas" })
            }
        });

    }, []);
    return (
        <>
            <canvas id="drawingCanvas" ></canvas>
            <input type="color" id="canvasColorPicker" onChange={e => setColor(e.target.value)} value={color}></input>
        </>

    );
};

export default Canvas;