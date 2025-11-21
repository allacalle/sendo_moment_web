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

// --- NUEVA LÓGICA: Leer y decodificar el parámetro 'data' ---
let decodedMomentData = {};

// Intentar leer el parámetro 'data'
const encodedData = getDecodedParam('data');

if (encodedData) {
    try {
        // 1. Decodificar de Base64
        const decodedString = atob(encodedData);
        // 2. Parsear el JSON
        decodedMomentData = JSON.parse(decodedString);

        // Extraer valores del JSON decodificado
        // Si no existen, usar valores por defecto
        var metaImageUrl = decodedMomentData.img || '';
        var metaPhrase = decodedMomentData.phrase || 'Un Momento de SenDo';
        var metaAuthor = decodedMomentData.author || 'SenDo';
        // Puedes hacer lo mismo para otros campos si los necesitas en el <head>
    } catch (e) {
        console.error("Error al decodificar o parsear el parámetro 'data':", e);
        // Si falla la decodificación, usar valores por defecto
        var metaImageUrl = getDecodedParam('img', ''); // Fallback al parámetro antiguo si existe
        var metaPhrase = getDecodedParam('phrase', 'Un Momento de SenDo');
        var metaAuthor = getDecodedParam('author', 'SenDo');
    }
} else {
    // Si no hay parámetro 'data', usar el método antiguo
    var metaImageUrl = getDecodedParam('img', '');
    var metaPhrase = getDecodedParam('phrase', 'Un Momento de SenDo');
    var metaAuthor = getDecodedParam('author', 'SenDo');
}

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
    
    // Leemos el resto de los datos desde el objeto 'decodedMomentData' obtenido antes
    const musicUrl = decodedMomentData.music || getDecodedParam('music'); // Fallback al antiguo si no está en data
    const songTitle = decodedMomentData.songTitle || getDecodedParam('songTitle', 'Pista Curada');
    const songArtist = decodedMomentData.songArtist || getDecodedParam('songArtist', 'SenDo Community');
    const imgPhotographer = decodedMomentData.imgPhotographer || getDecodedParam('imgPhotographer', 'SenDo Community');
    const songArtistUrl = decodedMomentData.songArtistUrl || getDecodedParam('songArtistUrl');
    const imgPhotographerUrl = decodedMomentData.imgPhotographerUrl || getDecodedParam('imgPhotographerUrl');
    // Usamos los valores ya decodificados para phrase y author
    const metaImageUrl = decodedMomentData.img || getDecodedParam('img'); // Aseguramos que se use el correcto
    const metaPhrase = decodedMomentData.phrase; // Ya lo tenemos del JSON
    const metaAuthor = decodedMomentData.author; // Ya lo tenemos del JSON

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