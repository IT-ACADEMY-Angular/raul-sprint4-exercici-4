const getJokeButton = document.getElementById('getJoke') as HTMLButtonElement;
const jokeDisplay = document.getElementById('jokePrint') as HTMLParagraphElement;
const scoreButtons = document.querySelectorAll('.score-button') as NodeListOf<HTMLButtonElement>;
const weatherBox = document.getElementById('weather-box') as HTMLParagraphElement;

const totalBackgrounds = 7;
let availableBackgrounds: number[] = [...Array(totalBackgrounds).keys()].map(i => i + 1);
let lastBackgroundIndex: number | null = null;

//funcion cambiada para que aplique los cambios al contenedor del HTML (.background-container), 
//porque antes la otra función eliminaba todo tipo de elemento del background, ahora puedo tener Background + Blob por separado <---
function changeBackground(): void {

    if (availableBackgrounds.length === 0) {
        availableBackgrounds = [...Array(totalBackgrounds).keys()].map(i => i + 1);
    }

    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    const selectedBackground = availableBackgrounds[randomIndex];
    availableBackgrounds.splice(randomIndex, 1);
    const backgroundContainer = document.getElementById('background-container');

    if (backgroundContainer) {
        backgroundContainer.className = '';

        backgroundContainer.classList.add(`background-${selectedBackground}`);
    }
}

let reportJoke: { joke: string, score: number | null, date: string }[] = [];
let currentJoke = '';
let currentScore: number | null = null;

async function searchJoke() {

    const randomAPI = Math.random() < 0.5 ? 'icanhazdadjoke' : 'chucknorris'; //reandom a 50%

    try {
        let joke = '';
        if (randomAPI === 'icanhazdadjoke') {
            //API Dad jokes
            // console.log('Chiste de DAD JOKES <--');
            const response = await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } });
            const data = await response.json();
            joke = data.joke;
        } else {
            //API Chuck norris jokes
            // console.log('Chiste de CHUCK NORRIS <--');
            const response = await fetch('https://api.chucknorris.io/jokes/random');
            const data = await response.json();
            joke = data.value;
        }
        currentJoke = joke;
        jokeDisplay.innerText = currentJoke;

        currentScore = null;
        resetButtonStyles();

        changeBackground();
        
    } catch {
        jokeDisplay.innerText = '¡Hay algún error con la API de chistes, inténtalo más tarde!';
    }
}

async function displayWeather() {
    const apiKey = 'e06a7fd14a5545cc8f784046242310'; //Gratis 2 semanas trial, despues del trial, es gratis para siempre, otra API con mejores iconos 5Mreq/month
    const city = 'Badalona';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=es`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const weather = data.current;
        const temperature = weather.temp_c;
        const iconUrl = `https:${weather.condition.icon}`;
        weatherBox.innerHTML = ` <img src="${iconUrl}" class="weather-icon"> <span class="vertical-bar"></span> <span class="temperature-halloween">${temperature} ºC</span>`;
    } catch {
        weatherBox.innerText = '¡Hay algún error con la API del tiempo, inténtalo más tarde!';
    }
}


function saveJokeReport() {
    if (currentJoke) {
        reportJoke.push({ joke: currentJoke, score: currentScore, date: new Date().toISOString() });
        // console.table(reportJoke);
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
displayWeather()