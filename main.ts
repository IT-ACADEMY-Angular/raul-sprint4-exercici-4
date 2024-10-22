// los "as HTML..." es para que el compilñador sepa que es cada elemento
const getJokeButton = document.getElementById('getJoke') as HTMLButtonElement;
const jokeDisplay = document.getElementById('jokePrint') as HTMLParagraphElement;
const scoreButtons = document.querySelectorAll('.score-button') as NodeListOf<HTMLButtonElement>;

let reportJoke: { joke: string, score: number | null, date: string }[] = [];

let currentJoke = '';
let currentScore: number | null = null;

async function searchJoke() {
    try {
        const response = await fetch('https://icanhazdadjoke.com/', { 
            headers: { 
                'Accept': 'application/json' 
            } 
        });
        const data = await response.json();
        currentJoke = data.joke;
        jokeDisplay.innerText = currentJoke; // se actualiza el elemento para que aparezca ahí el chiste, por eso no me aparecia, IMPORTANT!!! <<<
        currentScore = null;
        resetButtonStyles();
    } catch {
        jokeDisplay.innerText = '¡Hay algún error, inténtalo más tarde!';
    }
}

function saveJokeReport() {
    if (currentJoke) {
        reportJoke.push({ joke: currentJoke, score: currentScore, date: new Date().toISOString() });
        console.table(reportJoke);
    }
}

function updateButtonStyles(score: number) {
    scoreButtons.forEach((button, index) => button.classList.toggle('selected', index + 1 === score));
}

function resetButtonStyles() {
    scoreButtons.forEach(button => button.classList.remove('selected'));
}

getJokeButton.addEventListener('click', () => {
    saveJokeReport();
    searchJoke();
});

scoreButtons.forEach((button, index) => button.addEventListener('click', () => {
    currentScore = index + 1;
    updateButtonStyles(currentScore);
}));

searchJoke();
