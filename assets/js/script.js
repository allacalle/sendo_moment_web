// EN: assets/js/script.js

// --- PARTE 1: LECTURA DE DATOS Y ACTUALIZACIÓN DE META TAGS (Se ejecuta inmediatamente) ---

const urlParams = new URLSearchParams(window.location.search);

// Función auxiliar robusta para leer parámetros de la URL
function getDecodedParam(paramName, defaultValue = '') {
    const value = urlParams.get(paramName);
    if (value === null || value === 'null' || value === undefined) {
        return defaultValue;
    }
    return decodeURIComponent(value);
}

// Leemos todos los datos una sola vez al principio.
const imageUrl = getDecodedParam('img');
const musicUrl = getDecodedParam('music');
const phrase = getDecodedParam('phrase', 'Encuentra tu momento de calma.');
const author = getDecodedParam('author', 'SenDo');
const songTitle = getDecodedParam('songTitle', 'Pista Curada');
const songArtist = getDecodedParam('songArtist', 'SenDo Community');
const imgPhotographer = getDecodedParam('imgPhotographer', 'SenDo Community');
const songArtistUrl = getDecodedParam('songArtistUrl');
const imgPhotographerUrl = getDecodedParam('imgPhotographerUrl');

// Actualizamos los meta tags cruciales para la vista previa en redes sociales.
if (phrase && imageUrl) {
    document.title = `"${phrase}" - Un Momento de SenDo`;
    document.querySelector("meta[property='og:title']").setAttribute('content', `"${phrase}"`);
    document.querySelector("meta[property='og:image']").setAttribute('content', imageUrl);
    document.querySelector("meta[property='og:description']").setAttribute('content', `Un Momento de calma de ${author}.`);
}


// --- PARTE 2: LÓGICA PRINCIPAL (Espera a que los elementos del <body> existan) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REFERENCIAS A LOS ELEMENTOS DEL DOM
    const momentContainer = document.getElementById('moment-container');
    const phraseText = document.getElementById('phrase-text');
    const authorText = document.getElementById('author-text');
    const playPauseButton = document.getElementById('play-pause-button');
    const momentAudio = document.getElementById('moment-audio');
    const downloadLink = document.getElementById('download-link');
    const adFooter = document.getElementById('ad-footer');
    const closeAdButton = document.getElementById('close-ad-button');
    const headphoneOverlay = document.getElementById('headphone-overlay');
    const playAnywayButton = document.getElementById('play-anyway-button');
    const playSilentButton = document.getElementById('play-silent-button');
    const attributionButton = document.getElementById('attribution-button');
    const attributionPanel = document.getElementById('attribution-panel');
    const photoArtistText = document.getElementById('photo-artist');
    const musicTitleText = document.getElementById('music-title');
    const musicArtistText = document.getElementById('music-artist');
    const phraseAuthorText = document.getElementById('phrase-author');

    // 2. PUESTA EN ESCENA (Usamos las variables ya leídas)
    if (imageUrl) momentContainer.style.backgroundImage = `url(${imageUrl})`;
    phraseText.textContent = `"${phrase}"`;
    authorText.textContent = `- ${author}`;
    downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

    photoArtistText.textContent = `de ${imgPhotographer}`;
    musicTitleText.textContent = `"${songTitle}"`;
    musicArtistText.textContent = `de ${songArtist}`;
    phraseAuthorText.textContent = `de ${author}`;

    if (imgPhotographerUrl) {
        photoArtistText.innerHTML = `de <a href="${imgPhotographerUrl}" target="_blank" rel="noopener noreferrer">${imgPhotographer}</a>`;
    }
    if (songArtistUrl) {
        musicArtistText.innerHTML = `de <a href="${songArtistUrl}" target="_blank" rel="noopener noreferrer">${songArtist}</a>`;
    }
    
    // 3. LÓGICA DE INTERACCIÓN
    let isPlaying = false;
    let audioSourceSet = false;

    playPauseButton.addEventListener('click', () => {
        if (!isPlaying) {
            if (musicUrl) headphoneOverlay.style.display = 'flex';
        } else {
            momentAudio.pause();
        }
    });

    playAnywayButton.addEventListener('click', (event) => {
        event.stopPropagation();
        headphoneOverlay.style.display = 'none';
        
        if (!audioSourceSet) {
            momentAudio.src = musicUrl;
            audioSourceSet = true;
        }
        momentAudio.play().catch(e => console.error("Error al reproducir:", e));
    });

    playSilentButton.addEventListener('click', (event) => {
        event.stopPropagation();
        headphoneOverlay.style.display = 'none';
    });

    momentAudio.onplaying = () => {
        isPlaying = true;
        playPauseButton.classList.add('playing');
    };
    momentAudio.onpause = () => {
        isPlaying = false;
        playPauseButton.classList.remove('playing');
    };
    momentAudio.onended = () => {
        isPlaying = false;
        playPauseButton.classList.remove('playing');
    };

    attributionButton.addEventListener('click', (event) => {
        event.stopPropagation();
        attributionPanel.classList.toggle('visible');
    });
    
    document.body.addEventListener('click', (event) => {
        // Cierra el panel de atribución si se hace clic fuera de él
        if (attributionPanel.classList.contains('visible') && !attributionPanel.contains(event.target) && !attributionButton.contains(event.target)) {
            attributionPanel.classList.remove('visible');
        }
    });

    // Lógica de anuncios
    setTimeout(() => {
        if (adFooter) adFooter.style.transform = 'translateY(0%)';
    }, 5000);

    if (closeAdButton) {
        closeAdButton.addEventListener('click', () => {
            adFooter.style.display = 'none';
        });
    }

    console.log("Página-Momento (DOM) inicializada con éxito.");
});