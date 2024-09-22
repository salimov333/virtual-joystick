const moveArea = document.getElementById("moveArea");
const circle = document.getElementById("circle");
const controlArea = document.getElementById("controlArea");
const joystick = document.getElementById("joystick");
const controlBall = document.getElementById("controlBall");
const keyboardJoystick = document.getElementById("keyboardJoystick");

const rootStyles = getComputedStyle(document.documentElement);
const ballWidth = parseFloat(rootStyles.getPropertyValue("--ball-width"));
const joystickWidth = parseFloat(rootStyles.getPropertyValue("--joystick-width"));
const controlBallWidth = parseFloat(rootStyles.getPropertyValue("--control-ball-width"));

// Check for touch support
const isTouchDevice = "ontouchstart" in window;

// Show appropriate joystick based on device type
if (isTouchDevice) {
    joystick.style.display = "flex";
} else {
    keyboardJoystick.style.display = "flex";
}

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

function isTouchInJoystick(touchX, touchY) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    const distance = Math.sqrt(
        Math.pow(touchX - centerX, 2) + Math.pow(touchY - centerY, 2)
    );
    return distance <= radius;
}

function constrainControlBallToBounds(controlBallX, controlBallY) {
    const joystickRect = joystick.getBoundingClientRect();
    const centerX = joystickRect.width / 2;
    const centerY = joystickRect.height / 2;

    const distance = Math.sqrt((controlBallX - centerX) ** 2 + (controlBallY - centerY) ** 2);
    if (distance > centerX - controlBallWidth / 2) {
        const angle = Math.atan2(controlBallY - centerY, controlBallX - centerX);
        controlBallX = centerX + (joystickRect.width / 2 - controlBallWidth / 2) * Math.cos(angle);
        controlBallY = centerY + (joystickRect.height / 2 - controlBallWidth / 2) * Math.sin(angle);
    }
    return { controlBallX, controlBallY };
}

// Touch controls
if (isTouchDevice) {
    controlArea.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        if (isTouchInJoystick(touchStartX, touchStartY)) {
            dragging = true;
        }
    });

    controlArea.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        const controlBallX = controlBall.offsetLeft + deltaX;
        const controlBallY = controlBall.offsetTop + deltaY;

        // Constrain the controlBall within the joystick
        const constrainedPosition = constrainControlBallToBounds(controlBallX + controlBallWidth / 2, controlBallY + controlBallWidth / 2);
        controlBall.style.left = `${constrainedPosition.controlBallX - controlBallWidth / 2}px`;
        controlBall.style.top = `${constrainedPosition.controlBallY - controlBallWidth / 2}px`;

        // Update circle position based on control ball movement
        circleX += (constrainedPosition.controlBallX - joystick.offsetWidth / 2) * (moveSpeed / (joystickWidth / 2));
        circleY += (constrainedPosition.controlBallY - joystick.offsetHeight / 2) * (moveSpeed / (joystickWidth / 2));
        
        constrainCircleToBounds();
        updateCirclePosition();

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });

    controlArea.addEventListener("touchend", () => {
        dragging = false;
        // Reset control ball to the center
        controlBall.style.left = `${(joystickWidth - controlBallWidth) / 2}px`;
        controlBall.style.top = `${(joystickWidth - controlBallWidth) / 2}px`;
    });
} else {
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
}

// Set the initial position of the circle and control ball
updateCirclePosition();
controlBall.style.left = `${(joystickWidth - controlBallWidth) / 2}px`;
controlBall.style.top = `${(joystickWidth - controlBallWidth) / 2}px`;
