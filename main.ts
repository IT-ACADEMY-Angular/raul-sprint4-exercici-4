// los "as HTML..." es para que el compilñador sepa que es cada elemento
const getJokeButton = document.getElementById('getJoke') as HTMLButtonElement;
const jokeDisplay = document.getElementById('jokePrint') as HTMLParagraphElement;

async function searchJoke() {
    try {
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        jokeDisplay.innerText = data.joke; // se actualiza el elemento para que aparezca ahí el chiste, por eso no me aparecia, IMPORTANT!!! <<<
    } catch (error) {
        jokeDisplay.innerText = 'Hi ha algun error, intenta-ho mes tard!';
    }
}

getJokeButton.addEventListener('click', searchJoke);

searchJoke();
