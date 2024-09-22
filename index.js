const moveArea = document.getElementById("moveArea");
const circle = document.getElementById("circle");
const controlArea = document.getElementById("controlArea");
const keyboardJoystick = document.getElementById("keyboardJoystick");

const rootStyles = getComputedStyle(document.documentElement);
const ballWidth = parseFloat(rootStyles.getPropertyValue("--ball-width"));
const keyboardJoystickWidth = parseFloat(rootStyles.getPropertyValue("--keyboardJoystick-width"));

// Center the circle by accounting for half its width/height
let circleX = (moveArea.offsetWidth - ballWidth) / 2;
let circleY = (moveArea.offsetHeight - ballWidth) / 2;
const moveSpeed = 5; // Movement speed

let dragging = false;
let touchStartX, touchStartY;

function updateCirclePosition() {
    circle.style.left = `${circleX + ballWidth / 2}px`;
    circle.style.top = `${circleY + ballWidth / 2}px`;
}

function constrainCircleToBounds() {
    circleX = Math.max(0, Math.min(circleX, moveArea.offsetWidth - ballWidth));
    circleY = Math.max(0, Math.min(circleY, moveArea.offsetHeight - ballWidth));
}

function isTouchInKeyboardJoystick(touchX, touchY) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    const distance = Math.sqrt(
        Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
    );
    return distance <= radius;
}

// Keyboard controls
let keysPressed = {};

document.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
});

function moveCircle() {
    if (keysPressed["ArrowUp"]) {
        circleY -= moveSpeed;
    }
    if (keysPressed["ArrowDown"]) {
        circleY += moveSpeed;
    }
    if (keysPressed["ArrowLeft"]) {
        circleX -= moveSpeed;
    }
    if (keysPressed["ArrowRight"]) {
        circleX += moveSpeed;
    }

    constrainCircleToBounds();
    updateCirclePosition();

    requestAnimationFrame(moveCircle);
}

requestAnimationFrame(moveCircle);
