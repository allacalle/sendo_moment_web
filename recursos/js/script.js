// --- PARTE 1: ACCIÓN INMEDIATA (Para actualizar meta tags rápido) ---

function getDecodedParam(paramName, defaultValue = '') {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(paramName);
    if (!value || value === 'null') return defaultValue;
    try {
        return decodeURIComponent(value);
    } catch {
        return defaultValue;
    }
}

// Declaración única de objeto que contendrá todos los datos
let decodedMomentData = {};

// Leer el parámetro 'data'
const encodedData = getDecodedParam('data', '');

if (encodedData) {
    try {
        // 1. Decodificar Base64
        const decodedString = atob(encodedData);
        // 2. Parsear JSON
        decodedMomentData = JSON.parse(decodedString);
    } catch (e) {
        console.error("Error decodificando 'data':", e);
        decodedMomentData = {}; // fallback vacío
    }
}

// Valores principales para meta tags
const metaPhrase = decodedMomentData.phrase || getDecodedParam('phrase', 'Un Momento de SenDo');
const metaAuthor = decodedMomentData.author || getDecodedParam('author', 'SenDo');
const metaImageUrl = decodedMomentData.img || getDecodedParam('img', 'https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg');

// Actualizar meta tags OG y Twitter
document.title = `"${metaPhrase}"`;
try {
    document.querySelector("meta[property='og:title']").setAttribute('content', `"${metaPhrase}"`);
    document.querySelector("meta[property='og:description']").setAttribute('content', `Un Momento de calma de ${metaAuthor}.`);
    document.querySelector("meta[property='og:image']").setAttribute('content', metaImageUrl);
    document.querySelector("meta[name='twitter:title']").setAttribute('content', `"${metaPhrase}"`);
    document.querySelector("meta[name='twitter:description']").setAttribute('content', `Un Momento de calma de ${metaAuthor}.`);
    document.querySelector("meta[name='twitter:image']").setAttribute('content', metaImageUrl);
} catch (e) {
    console.error("Error actualizando meta tags:", e);
}

// --- PARTE 2: ACCIÓN DIFERIDA (DOM listo) ---
document.addEventListener('DOMContentLoaded', () => {
    const momentContainer = document.getElementById('moment-container');
    const phraseText = document.getElementById('phrase-text');
    const authorText = document.getElementById('author-text');
    const playPauseButton = document.getElementById('play-pause-button');
    const momentAudio = document.getElementById('moment-audio');
    const downloadLink = document.getElementById('download-link');
    const headphoneOverlay = document.getElementById('headphone-overlay');
    const playAnywayButton = document.getElementById('play-anyway-button');
    const playSilentButton = document.getElementById('play-silent-button');
    const attributionButton = document.getElementById('attribution-button');
    const attributionPanel = document.getElementById('attribution-panel');
    const photoArtistText = document.getElementById('photo-artist');
    const musicTitleText = document.getElementById('music-title');
    const musicArtistText = document.getElementById('music-artist');
    const phraseAuthorText = document.getElementById('phrase-author');

    // --- Datos de audio y artistas ---
    const musicUrl = decodedMomentData.music || getDecodedParam('music', '');
    const songTitle = decodedMomentData.songTitle || getDecodedParam('songTitle', 'Pista Curada');
    const songArtist = decodedMomentData.songArtist || getDecodedParam('songArtist', 'SenDo Community');
    const imgPhotographer = decodedMomentData.imgPhotographer || getDecodedParam('imgPhotographer', 'SenDo Community');
    const songArtistUrl = decodedMomentData.songArtistUrl || getDecodedParam('songArtistUrl', '');
    const imgPhotographerUrl = decodedMomentData.imgPhotographerUrl || getDecodedParam('imgPhotographerUrl', '');

    // --- Poner valores en DOM ---
    if (metaImageUrl) momentContainer.style.backgroundImage = `url(${metaImageUrl})`;
    phraseText.textContent = `"${metaPhrase}"`;
    authorText.textContent = `- ${metaAuthor}`;
    downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

    photoArtistText.innerHTML = imgPhotographerUrl 
        ? `de <a href="${imgPhotographerUrl}" target="_blank" rel="noopener noreferrer">${imgPhotographer}</a>`
        : `de ${imgPhotographer}`;

    musicTitleText.textContent = `"${songTitle}"`;
    musicArtistText.innerHTML = songArtistUrl 
        ? `de <a href="${songArtistUrl}" target="_blank" rel="noopener noreferrer">${songArtist}</a>`
        : `de ${songArtist}`;

    phraseAuthorText.textContent = `de ${metaAuthor}`;

    // --- Interacciones ---
    let isPlaying = false;
    let audioSourceSet = false;

    playPauseButton.addEventListener('click', () => {
        if (!isPlaying && musicUrl) headphoneOverlay.style.display = 'flex';
        else momentAudio.pause();
    });

    playAnywayButton.addEventListener('click', (e) => {
        e.stopPropagation();
        headphoneOverlay.style.display = 'none';
        if (!audioSourceSet) {
            momentAudio.src = musicUrl;
            audioSourceSet = true;
        }
        momentAudio.play().catch(err => console.error(err));
    });

    playSilentButton.addEventListener('click', (e) => {
        e.stopPropagation();
        headphoneOverlay.style.display = 'none';
    });

    momentAudio.onplaying = () => { isPlaying = true; playPauseButton.classList.add('playing'); };
    momentAudio.onpause = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
    momentAudio.onended = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };

    attributionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        attributionPanel.classList.toggle('visible');
    });

    document.body.addEventListener('click', (e) => {
        if (attributionPanel.classList.contains('visible') &&
            !attributionPanel.contains(e.target) &&
            !attributionButton.contains(e.target)) {
            attributionPanel.classList.remove('visible');
        }
    });

    console.log("Página-Momento inicializada con éxito.");
});
