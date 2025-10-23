// EN: recursos/js/script.js

// --- PARTE 1: ACCIÓN INMEDIATA (Para ganar la carrera contra el bot) ---
// Este código se ejecuta tan pronto como el navegador lee el script en el <head>.

// Función auxiliar para leer y decodificar parámetros de la URL de forma segura.
function getDecodedParam(paramName, defaultValue = '') {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(paramName);
    if (value === null || value === 'null' || value === undefined) {
        return defaultValue;
    }
    return decodeURIComponent(value);
}

// Leemos los datos necesarios para los meta tags inmediatamente.
const metaImageUrl = getDecodedParam('img');
const metaPhrase = getDecodedParam('phrase', 'Un Momento de SenDo');
const metaAuthor = getDecodedParam('author', 'SenDo');

// Actualizamos los tags en el <head> AHORA MISMO.
if (metaPhrase && metaImageUrl) {
    document.title = `"${metaPhrase}"`;
    // Usamos 'try...catch' como medida de seguridad por si el HTML cambiara.
    try {
        document.querySelector("meta[property='og:title']").setAttribute('content', `"${metaPhrase}"`);
        document.querySelector("meta[property='og:image']").setAttribute('content', metaImageUrl);
        document.querySelector("meta[property='og:description']").setAttribute('content', `Un Momento de calma de ${metaAuthor}.`);
    } catch (e) {
        console.error("Error al actualizar meta tags:", e);
    }
}


// --- PARTE 2: ACCIÓN DIFERIDA (Espera a que el <body> esté listo) ---

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
    
    // Leemos el resto de los datos (ya decodificados por la función de arriba)
    const musicUrl = getDecodedParam('music');
    const songTitle = getDecodedParam('songTitle', 'Pista Curada');
    const songArtist = getDecodedParam('songArtist', 'SenDo Community');
    const imgPhotographer = getDecodedParam('imgPhotographer', 'SenDo Community');
    const songArtistUrl = getDecodedParam('songArtistUrl');
    const imgPhotographerUrl = getDecodedParam('imgPhotographerUrl');

    // 2. PUESTA EN ESCENA (Rellenar el <body>)
    if (metaImageUrl) momentContainer.style.backgroundImage = `url(${metaImageUrl})`;
    phraseText.textContent = `"${metaPhrase}"`;
    authorText.textContent = `- ${metaAuthor}`;
    downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

    photoArtistText.textContent = `de ${imgPhotographer}`;
    musicTitleText.textContent = `"${songTitle}"`;
    musicArtistText.textContent = `de ${songArtist}`;
    phraseAuthorText.textContent = `de ${metaAuthor}`;

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
        if (attributionPanel.classList.contains('visible') && !attributionPanel.contains(event.target) && !attributionButton.contains(event.target)) {
            attributionPanel.classList.remove('visible');
        }
    });

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