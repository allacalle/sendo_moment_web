// --- LÓGICA BASE64 'data' ---
function getDecodedParam(paramName, defaultValue = '') {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramName);
  if (!value) return defaultValue;
  try { return decodeURIComponent(value); }
  catch { return defaultValue; }
}

let decodedMomentData = {};
const encodedData = getDecodedParam('data');

if (encodedData) {
  try {
    decodedMomentData = JSON.parse(atob(encodedData));
  } catch(e) {
    console.error("Error decodificando 'data':", e);
    decodedMomentData = {};
  }
}

// --- DATOS DEL MOMENTO ---
const metaPhrase = decodedMomentData.phrase || "Un Momento de SenDo";
const metaAuthor = decodedMomentData.author || "SenDo";
const metaImageUrl = decodedMomentData.img || "https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg";
const musicUrl = decodedMomentData.music || "";
const songTitle = decodedMomentData.songTitle || "Pista Curada";
const songArtist = decodedMomentData.songArtist || "SenDo Community";
const imgPhotographer = decodedMomentData.imgPhotographer || "SenDo Community";

// --- ACTUALIZAR METATAGS ---
document.title = `"${metaPhrase}"`;
try {
  document.getElementById('og-title').content = `"${metaPhrase}"`;
  document.getElementById('og-description').content = `Un Momento de calma de ${metaAuthor}.`;
  document.getElementById('og-image').content = metaImageUrl;
  document.getElementById('twitter-title').content = `"${metaPhrase}"`;
  document.getElementById('twitter-description').content = `Un Momento de calma de ${metaAuthor}.`;
  document.getElementById('twitter-image').content = metaImageUrl;
} catch(e) {}

// --- CUANDO EL DOM ESTÁ LISTO ---
document.addEventListener('DOMContentLoaded', () => {
  const momentContainer = document.getElementById('moment-container');
  const phraseText = document.getElementById('phrase-text');
  const authorText = document.getElementById('author-text');
  const momentAudio = document.getElementById('moment-audio');
  const playPauseButton = document.getElementById('play-pause-button');
  const headphoneOverlay = document.getElementById('headphone-overlay');
  const playAnywayButton = document.getElementById('play-anyway-button');
  const playSilentButton = document.getElementById('play-silent-button');
  const photoArtistText = document.getElementById('photo-artist');
  const musicTitleText = document.getElementById('music-title');
  const musicArtistText = document.getElementById('music-artist');
  const phraseAuthorText = document.getElementById('phrase-author');

  // Poner datos
  momentContainer.style.backgroundImage = `url(${metaImageUrl})`;
  phraseText.textContent = `"${metaPhrase}"`;
  authorText.textContent = `- ${metaAuthor}`;
  photoArtistText.textContent = `de ${imgPhotographer}`;
  musicTitleText.textContent = `"${songTitle}"`;
  musicArtistText.textContent = `de ${songArtist}`;
  phraseAuthorText.textContent = `de ${metaAuthor}`;

  // Audio
  let isPlaying = false;
  let audioLoaded = false;

  playPauseButton.addEventListener('click', () => {
    if (!isPlaying) {
      if (musicUrl) headphoneOverlay.style.display = 'flex';
    } else {
      momentAudio.pause();
    }
  });

  playAnywayButton.addEventListener('click', (e) => {
    e.stopPropagation();
    headphoneOverlay.style.display = 'none';
    if (!audioLoaded) { momentAudio.src = musicUrl; audioLoaded = true; }
    momentAudio.play().catch(console.error);
  });

  playSilentButton.addEventListener('click', (e) => {
    e.stopPropagation();
    headphoneOverlay.style.display = 'none';
  });

  momentAudio.onplaying = () => { isPlaying = true; playPauseButton.classList.add('playing'); };
  momentAudio.onpause = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
  momentAudio.onended = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
});
