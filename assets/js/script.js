// EN: assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERENCIAS A LOS ACTORES ---
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

    // --- 2. EL TRADUCTOR INTELIGENTE ---
    const urlParams = new URLSearchParams(window.location.search);

    // Función auxiliar robusta para leer parámetros
    function getDecodedParam(paramName, defaultValue = '') {
        const value = urlParams.get(paramName);
        // Si el parámetro no existe, es nulo, o es el texto "null", devolvemos el valor por defecto.
        if (value === null || value === undefined || value === 'null') {
            return defaultValue;
        }
        return decodeURIComponent(value);
    }

    // Usamos nuestra nueva función para leer todos los datos de forma segura.
    const imageUrl = getDecodedParam('img');
    const musicUrl = getDecodedParam('music');
    const phrase = getDecodedParam('phrase', 'Encuentra tu momento de calma.');
    const author = getDecodedParam('author', 'SenDo');
    const songTitle = getDecodedParam('songTitle', 'Pista Curada');
    const songArtist = getDecodedParam('songArtist', 'SenDo Community');
    const imgPhotographer = getDecodedParam('imgPhotographer', 'SenDo Community');
    const songArtistUrl = getDecodedParam('songArtistUrl');
    const imgPhotographerUrl = getDecodedParam('imgPhotographerUrl');

    // --- 3. PUESTA EN ESCENA ---
    if (imageUrl) momentContainer.style.backgroundImage = `url(${imageUrl})`;
    phraseText.textContent = `"${phrase}"`;
    authorText.textContent = `- ${author}`;
    downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

    // Rellenamos el panel de atribución
    photoArtistText.textContent = `de ${imgPhotographer}`;
    musicTitleText.textContent = `"${songTitle}"`;
    musicArtistText.textContent = `de ${songArtist}`;
    phraseAuthorText.textContent = `de ${author}`;

    // Solo creamos el enlace si la URL es una cadena de texto válida y no vacía.
    if (imgPhotographerUrl) {
        photoArtistText.innerHTML = `de <a href="${imgPhotographerUrl}" target="_blank" rel="noopener noreferrer">${imgPhotographer}</a>`;
    }
    if (songArtistUrl) {
        musicArtistText.innerHTML = `de <a href="${songArtistUrl}" target="_blank" rel="noopener noreferrer">${songArtist}</a>`;
    }
    
    // --- 4. LÓGICA DE INTERACCIÓN ---
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
    
    document.body.addEventListener('click', () => {
        if (attributionPanel.classList.contains('visible')) {
            attributionPanel.classList.remove('visible');
        }
    });

    setTimeout(() => { adFooter.style.transform = 'translateY(0%)'; }, 5000);
    closeAdButton.addEventListener('click', () => { adFooter.style.display = 'none'; });

    console.log("Página-Momento inicializada con éxito.");
});