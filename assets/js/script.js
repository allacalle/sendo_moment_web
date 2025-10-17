// EN: assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERENCIAS ---
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

    // --- 2. LECTURA DE URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrl = decodeURIComponent(urlParams.get('img') || '');
    const musicUrl = decodeURIComponent(urlParams.get('music') || ''); // Solo guardamos la URL, no la asignamos
    const phrase = decodeURIComponent(urlParams.get('phrase') || 'Encuentra tu momento de calma.');
    const author = decodeURIComponent(urlParams.get('author') || 'SenDo');

    // --- 3. PUESTA EN ESCENA (VISUAL) ---
    if (imageUrl) momentContainer.style.backgroundImage = `url(${imageUrl})`;
    phraseText.textContent = `"${phrase}"`;
    authorText.textContent = `- ${author}`;
    downloadLink.href = 'https://play.google.com/store/apps/details?id=com.example.sendo_app';

    // --- 4. LÓGICA DE INTERACCIÓN (REPARADA) ---
    let isPlaying = false;

    playPauseButton.addEventListener('click', () => {
        if (!isPlaying) {
            // Si hay una URL de música, mostramos el overlay. Si no, no hacemos nada.
            if (musicUrl) {
                headphoneOverlay.style.display = 'flex';
            }
        } else {
            momentAudio.pause();
        }
    });

    playAnywayButton.addEventListener('click', (event) => {
        event.stopPropagation();
        headphoneOverlay.style.display = 'none';
        
        // --- ¡LA REPARACIÓN CLAVE! ---
        // 1. Asignamos la fuente AHORA, justo antes de reproducir.
        if (momentAudio.src !== musicUrl) {
             momentAudio.src = '/' + musicUrl;
        }
        // 2. Damos la orden de reproducir.
        momentAudio.play().catch(e => console.error("Error al reproducir:", e));
    });

    playSilentButton.addEventListener('click', (event) => {
        event.stopPropagation();
        headphoneOverlay.style.display = 'none';
    });

    // Listeners para actualizar estado
    momentAudio.onplaying = () => isPlaying = true;
    momentAudio.onpause = () => isPlaying = false;
    momentAudio.onended = () => isPlaying = false;

    // ... Lógica de anuncios
    setTimeout(() => { adFooter.style.transform = 'translateY(0%)'; }, 5000);
    closeAdButton.addEventListener('click', () => { adFooter.style.display = 'none'; });

    console.log("Página-Momento inicializada con éxito.");
});