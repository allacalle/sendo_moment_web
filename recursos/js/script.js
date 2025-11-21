// --- PARTE 1: ACCIÓN INMEDIATA (Metatags y parámetros) ---
function getDecodedParam(paramName, defaultValue = '') {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramName);
  if (value === null || value === 'null' || value === undefined) {
    return defaultValue;
  }
  try {
    return decodeURIComponent(value);
  } catch (e) {
    console.error(`Error al decodificar parámetro '${paramName}':`, e);
    return defaultValue;
  }
}

let decodedMomentData = {};
const encodedData = getDecodedParam('data');

if (encodedData) {
  try {
    const decodedString = atob(encodedData);
    decodedMomentData = JSON.parse(decodedString);

    const metaPhrase = decodedMomentData.phrase || 'Un Momento de SenDo';
    const metaAuthor = decodedMomentData.author || 'SenDo';
    const metaImageUrl = decodedMomentData.img || 'https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg';
    const metaDescription = `Un Momento de calma de ${metaAuthor}.`;

    document.title = `"${metaPhrase}"`;
    try {
      document.querySelector("meta[property='og:title']").setAttribute('content', `"${metaPhrase}"`);
      document.querySelector("meta[property='og:image']").setAttribute('content', metaImageUrl);
      document.querySelector("meta[property='og:description']").setAttribute('content', metaDescription);
      document.querySelector("meta[name='twitter:title']").setAttribute('content', `"${metaPhrase}"`);
      document.querySelector("meta[name='twitter:description']").setAttribute('content', metaDescription);
      document.querySelector("meta[name='twitter:image']").setAttribute('content', metaImageUrl);
    } catch (e) {
      console.error("Error al actualizar meta tags:", e);
    }

  } catch (e) {
    console.error("Error decodificando/parsing 'data':", e);
  }
}

// --- PARTE 2: ACCIÓN DIFERIDA (DOM listo) ---
document.addEventListener('DOMContentLoaded', () => {

  // --- Referencias DOM ---
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

  // --- Datos del momento ---
  const musicUrl = decodedMomentData.music || getDecodedParam('music');
  const songTitle = decodedMomentData.songTitle || getDecodedParam('songTitle', 'Pista Curada');
  const songArtist = decodedMomentData.songArtist || getDecodedParam('songArtist', 'SenDo Community');
  const imgPhotographer = decodedMomentData.imgPhotographer || getDecodedParam('imgPhotographer', 'SenDo Community');
  const songArtistUrl = decodedMomentData.songArtistUrl || getDecodedParam('songArtistUrl');
  const imgPhotographerUrl = decodedMomentData.imgPhotographerUrl || getDecodedParam('imgPhotographerUrl');
  const metaImageUrl = decodedMomentData.img || getDecodedParam('img');
  const metaPhrase = decodedMomentData.phrase || 'Un Momento de SenDo';
  const metaAuthor = decodedMomentData.author || 'SenDo';

  // --- Render del momento ---
  if (metaImageUrl) momentContainer.style.backgroundImage = `url(${metaImageUrl})`;
  phraseText.textContent = `"${metaPhrase}"`;
  authorText.textContent = `- ${metaAuthor}`;
  downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

  photoArtistText.textContent = `de ${imgPhotographer}`;
  musicTitleText.textContent = `"${songTitle}"`;
  musicArtistText.textContent = `de ${songArtist}`;
  phraseAuthorText.textContent = `de ${metaAuthor}`;

  if (imgPhotographerUrl) photoArtistText.innerHTML = `de <a href="${imgPhotographerUrl}" target="_blank" rel="noopener noreferrer">${imgPhotographer}</a>`;
  if (songArtistUrl) musicArtistText.innerHTML = `de <a href="${songArtistUrl}" target="_blank" rel="noopener noreferrer">${songArtist}</a>`;

  // --- Audio ---
  let isPlaying = false;
  let audioSourceSet = false;

  playPauseButton.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioSourceSet && musicUrl) headphoneOverlay.style.display = 'flex';
      else if (musicUrl) momentAudio.play().catch(console.error);
    } else {
      momentAudio.pause();
    }
  });

  playAnywayButton.addEventListener('click', () => {
    headphoneOverlay.style.display = 'none';
    if (!audioSourceSet) {
      momentAudio.src = musicUrl;
      audioSourceSet = true;
    }
    momentAudio.play().catch(console.error);
  });

  playSilentButton.addEventListener('click', () => headphoneOverlay.style.display = 'none');

  momentAudio.onplaying = () => {
    isPlaying = true;
    playPauseButton.classList.add('playing');
  };
  momentAudio.onpause = momentAudio.onended = () => {
    isPlaying = false;
    playPauseButton.classList.remove('playing');
  };

  // --- Panel de atribución ---
  attributionButton.addEventListener('click', (event) => {
    event.stopPropagation();
    attributionPanel.classList.toggle('visible');
  });

  document.body.addEventListener('click', (event) => {
    if (attributionPanel.classList.contains('visible') &&
        !attributionPanel.contains(event.target) &&
        !attributionButton.contains(event.target)) {
      attributionPanel.classList.remove('visible');
    }
  });

  console.log("Página-Momento inicializada con éxito.");
});
