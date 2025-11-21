// --- Detectar idioma ---
const userLang = navigator.language || navigator.userLanguage;
const lang = userLang.startsWith('en') ? 'en' : 'es';

// --- Textos de la UI ---
const i18n = {
  es: {
    headphoneMessage: "Para una mejor experiencia, te recomendamos usar auriculares.",
    playAudio: "Reproducir Audio",
    playSilent: "Continuar en Silencio",
    createdWith: "Esto es un Momento creado con",
    getApp: "Obtener en Google Play"
  },
  en: {
    headphoneMessage: "For the best experience, we recommend using headphones.",
    playAudio: "Play Audio",
    playSilent: "Continue in Silence",
    createdWith: "This is a Moment created with",
    getApp: "Get it on Google Play"
  }
};

// --- Función auxiliar para leer parámetros ---
function getDecodedParam(paramName, defaultValue = '') {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(paramName);
  if (!value) return defaultValue;
  try {
    return decodeURIComponent(value);
  } catch {
    return defaultValue;
  }
}

// --- Leer datos del momento ---
let decodedMomentData = {};
const encodedData = getDecodedParam('data');
if (encodedData) {
  try {
    decodedMomentData = JSON.parse(atob(encodedData));
  } catch {}
}

// --- Extraer campos ---
const phrase = decodedMomentData[`phrase_${lang}`] || decodedMomentData.phrase || '';
const author = decodedMomentData.author || '';
const imgUrl = decodedMomentData.img || '';
const musicUrl = decodedMomentData.music || '';
const songTitle = decodedMomentData.songTitle || '';
const songArtist = decodedMomentData.songArtist || '';
const imgPhotographer = decodedMomentData.imgPhotographer || '';
const songArtistUrl = decodedMomentData.songArtistUrl || '';
const imgPhotographerUrl = decodedMomentData.imgPhotographerUrl || '';

// --- Actualizar metatags dinámicamente ---
function updateMetaTags(title, description, image) {
  document.title = `"${title}"`;
  const ogTitle = document.getElementById('og-title');
  const ogDesc = document.getElementById('og-description');
  const ogImage = document.getElementById('og-image');
  const twTitle = document.getElementById('twitter-title');
  const twDesc = document.getElementById('twitter-description');
  const twImage = document.getElementById('twitter-image');
  if (ogTitle) ogTitle.setAttribute('content', `"${title}"`);
  if (ogDesc) ogDesc.setAttribute('content', description);
  if (ogImage) ogImage.setAttribute('content', image);
  if (twTitle) twTitle.setAttribute('content', `"${title}"`);
  if (twDesc) twDesc.setAttribute('content', description);
  if (twImage) twImage.setAttribute('content', image);
}

updateMetaTags(phrase, `Un Momento de calma de ${author}.`, imgUrl || 'https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg');

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  // UI
  const phraseText = document.getElementById('phrase-text');
  const authorText = document.getElementById('author-text');
  const momentContainer = document.getElementById('moment-container');
  const headphoneOverlay = document.getElementById('headphone-overlay');
  const playAnywayButton = document.getElementById('play-anyway-button');
  const playSilentButton = document.getElementById('play-silent-button');
  const downloadLink = document.getElementById('download-link');
  const ctaText = document.querySelector("#cta-bar #cta-text p");
  const downloadImg = document.querySelector("#cta-bar #cta-button img");
  const photoArtistText = document.getElementById('photo-artist');
  const musicTitleText = document.getElementById('music-title');
  const musicArtistText = document.getElementById('music-artist');
  const phraseAuthorText = document.getElementById('phrase-author');
  const momentAudio = document.getElementById('moment-audio');

  // Contenido
  if (imgUrl) momentContainer.style.backgroundImage = `url(${imgUrl})`;
  phraseText.textContent = `"${phrase}"`;
  authorText.textContent = `- ${author}`;
  ctaText.innerHTML = `${i18n[lang].createdWith} <strong>SenDo</strong>`;
  downloadImg.alt = i18n[lang].getApp;
  downloadLink.href = 'https://play.google.com/store/apps/details?id=com.tu.paquete.sendo';

  photoArtistText.textContent = `de ${imgPhotographer}`;
  musicTitleText.textContent = `"${songTitle}"`;
  musicArtistText.textContent = `de ${songArtist}`;
  phraseAuthorText.textContent = `de ${author}`;

  if (imgPhotographerUrl) photoArtistText.innerHTML = `de <a href="${imgPhotographerUrl}" target="_blank">${imgPhotographer}</a>`;
  if (songArtistUrl) musicArtistText.innerHTML = `de <a href="${songArtistUrl}" target="_blank">${songArtist}</a>`;

  // Overlay auriculares
  headphoneOverlay.querySelector('p').textContent = i18n[lang].headphoneMessage;
  playAnywayButton.textContent = i18n[lang].playAudio;
  playSilentButton.textContent = i18n[lang].playSilent;

  playAnywayButton.addEventListener('click', () => {
    headphoneOverlay.style.display = 'none';
    if (musicUrl) {
      momentAudio.src = musicUrl;
      momentAudio.play().catch(console.error);
    }
  });

  playSilentButton.addEventListener('click', () => headphoneOverlay.style.display = 'none');
});
