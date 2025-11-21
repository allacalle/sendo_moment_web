document.addEventListener('DOMContentLoaded', () => {
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
  const momentContainer = document.getElementById('moment-container');

  // --- Función para leer parámetro data ---
  function getDecodedData() {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('data');
    if (!encodedData) return null;
    try {
      const decodedStr = atob(encodedData);
      return JSON.parse(decodedStr);
    } catch (e) {
      console.error('Error decodificando data:', e);
      return null;
    }
  }

  // --- Cargar momento ---
  const momentData = getDecodedData() || {
    // fallback por defecto
    phrase: 'Un Momento de SenDo para Ti',
    author: 'SenDo',
    img: 'https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg',
    music: '',
    songTitle: 'Pista Curada',
    songArtist: 'SenDo Community',
    imgPhotographer: 'SenDo Community'
  };

  // --- Rellenar la web ---
  if (momentData.img) momentContainer.style.backgroundImage = `url(${momentData.img})`;
  phraseText.textContent = `"${momentData.phrase}"`;
  authorText.textContent = `- ${momentData.author}`;
  photoArtistText.textContent = `de ${momentData.imgPhotographer}`;
  musicTitleText.textContent = `"${momentData.songTitle || 'Pista Curada'}"`;
  musicArtistText.textContent = `de ${momentData.songArtist || 'SenDo Community'}`;
  phraseAuthorText.textContent = `de ${momentData.author}`;

  // --- Audio ---
  let isPlaying = false;
  let audioSourceSet = false;

  playPauseButton.addEventListener('click', () => {
    if (!isPlaying) {
      if (momentData.music) headphoneOverlay.style.display = 'flex';
    } else {
      momentAudio.pause();
    }
  });

  playAnywayButton.addEventListener('click', (e) => {
    e.stopPropagation();
    headphoneOverlay.style.display = 'none';
    if (!audioSourceSet && momentData.music) {
      momentAudio.src = momentData.music;
      audioSourceSet = true;
    }
    momentAudio.play().catch(console.error);
  });

  playSilentButton.addEventListener('click', (e) => { 
    e.stopPropagation();
    headphoneOverlay.style.display = 'none';
  });

  momentAudio.onplaying = () => { isPlaying = true; playPauseButton.classList.add('playing'); };
  momentAudio.onpause = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
  momentAudio.onended = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };

  // --- Atribuciones ---
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
});
