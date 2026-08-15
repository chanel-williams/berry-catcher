function createStrawberry() {
    if (gameOver) return;

    const strawberry = document.createElement("img");

    strawberry.src = "strawberry.png";
    strawberry.classList.add("strawberry");

    let berryPosition = Math.random() * 360;

    if (berryPosition > 120 && berryPosition < 280) {
        berryPosition = Math.random() < 0.5 ? 60 : 300;
    }

    strawberry.style.left = berryPosition + "px";

    document.querySelector(".game-area").appendChild(strawberry);

    let position = 0;
    let speed = 2 + Math.random() * 2;

    function fall() {

        if (gameOver) {
            strawberry.remove();
            return;
        }

        position += speed;
        strawberry.style.top = position + "px";

        const strawberryRect = strawberry.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
            strawberryRect.bottom >= basketRect.top + 50 &&
            strawberryRect.left < basketRect.right &&
            strawberryRect.right > basketRect.left
        ) {
            score++;
            scoreDisplay.textContent = score;

            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem("bestScore", bestScore);
            }

            strawberry.remove();
            return;
        }

        if (position > 300) {
            strawberry.style.opacity =
                1 - ((position - 300) / 50);
        }

        if (position > 350) {
            strawberry.remove();
            return;
        }

        requestAnimationFrame(fall);
    }

    fall();
}


let score = 0;
const scoreDisplay = document.querySelector(".score");

let bestScore = Number(localStorage.getItem("bestScore")) || 0;
const bestScoreDisplay = document.querySelector(".best-score");

bestScoreDisplay.textContent = bestScore;


let gameOver = false;

let timeLeft = 25;
const timerDisplay = document.querySelector(".timer");
const gameOverDisplay = document.querySelector(".game-over");
const playAgain = document.querySelector(".play-again");
const finalScore = document.querySelector(".final-score");
const finalBest = document.querySelector(".final-best");


const timer = setInterval(function() {

    timeLeft--;
    timerDisplay.textContent = timeLeft + "s";

    if (timeLeft <= 0) {
        clearInterval(timer);

        gameOver = true;

        finalScore.textContent = score;
        finalBest.textContent = bestScore;

        gameOverDisplay.style.display = "block";
        playAgain.style.display = "block";
    }

}, 1000);


const basket = document.querySelector(".basket");
const gameArea = document.querySelector(".game-area");


let basketPosition = 160;
let targetPosition = 160;


gameArea.addEventListener("pointermove", function(event) {

    const rect = gameArea.getBoundingClientRect();

    const scale = 0.85;

targetPosition =
    (event.clientX - rect.left) / scale -
    (basket.offsetWidth / 2);

    if (targetPosition < 0) {
        targetPosition = 0;
    }

    if (targetPosition > rect.width - basket.offsetWidth) {
        targetPosition = rect.width - basket.offsetWidth;
    }

});


function moveBasket() {

    basketPosition +=
        (targetPosition - basketPosition) * 0.08;

    basket.style.left = basketPosition + "px";

    requestAnimationFrame(moveBasket);
}

moveBasket();


playAgain.addEventListener("click", function() {
    location.reload();
});


function spawnStrawberries() {

    if (gameOver) return;

    createStrawberry();

    let delay = 300;

    if (timeLeft <= 6) {
        delay = 200;
    }

    setTimeout(spawnStrawberries, delay);
}

spawnStrawberries();
