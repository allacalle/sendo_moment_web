document.addEventListener('DOMContentLoaded', async () => {
  const momentContainer = document.getElementById('moment-container');
  const phraseText = document.getElementById('phrase-text');
  const authorText = document.getElementById('author-text');
  const playPauseButton = document.getElementById('play-pause-button');
  const momentAudio = document.getElementById('moment-audio');
  const headphoneOverlay = document.getElementById('headphone-overlay');
  const playAnywayButton = document.getElementById('play-anyway-button');
  const playSilentButton = document.getElementById('play-silent-button');
  const attributionButton = document.getElementById('attribution-button');
  const attributionPanel = document.getElementById('attribution-panel');
  const photoArtistText = document.getElementById('photo-artist');
  const musicTitleText = document.getElementById('music-title');
  const musicArtistText = document.getElementById('music-artist');
  const phraseAuthorText = document.getElementById('phrase-author');

  // --- Función para leer parámetro 'data' ---
  function getDataFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');
    if (!encodedData) return null;

    try {
      const jsonStr = atob(decodeURIComponent(encodedData));
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error decodificando data:', e);
      return null;
    }
  }

  // --- Cargar momento desde URL o fallback ---
  const decodedMomentData = getDataFromUrl() || {
    img: 'recursos/images/sendo_banner.jpg',
    phrase: 'Respira y suelta todo el estrés.',
    author: 'SenDo',
    music: 'recursos/audio/demo.mp3',
    songTitle: 'Calma Interior',
    songArtist: 'SenDo Community',
    imgPhotographer: 'SenDo Community'
  };

  // --- Valores ---
  if (decodedMomentData.img) momentContainer.style.backgroundImage = `url(${decodedMomentData.img})`;
  phraseText.textContent = `"${decodedMomentData.phrase}"`;
  authorText.textContent = `- ${decodedMomentData.author}`;
  photoArtistText.textContent = `de ${decodedMomentData.imgPhotographer}`;
  musicTitleText.textContent = `"${decodedMomentData.songTitle}"`;
  musicArtistText.textContent = `de ${decodedMomentData.songArtist}`;
  phraseAuthorText.textContent = `de ${decodedMomentData.author}`;

  // --- Audio ---
  let isPlaying = false;
  let audioSourceSet = false;

  playPauseButton.addEventListener('click', () => {
    if (!isPlaying) {
      if (decodedMomentData.music) headphoneOverlay.style.display = 'flex';
    } else {
      momentAudio.pause();
    }
  });

  playAnywayButton.addEventListener('click', (e) => {
    e.stopPropagation();
    headphoneOverlay.style.display = 'none';
    if (!audioSourceSet) { momentAudio.src = decodedMomentData.music; audioSourceSet = true; }
    momentAudio.play().catch(console.error);
  });

  playSilentButton.addEventListener('click', (e) => { e.stopPropagation(); headphoneOverlay.style.display = 'none'; });

  momentAudio.onplaying = () => { isPlaying = true; playPauseButton.classList.add('playing'); };
  momentAudio.onpause = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
  momentAudio.onended = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };

  // --- Atribuciones ---
  attributionButton.addEventListener('click', (e) => { e.stopPropagation(); attributionPanel.classList.toggle('visible'); });
  document.body.addEventListener('click', (e) => {
    if (attributionPanel.classList.contains('visible') && !attributionPanel.contains(e.target) && !attributionButton.contains(e.target)) {
      attributionPanel.classList.remove('visible');
    }
  });
});
