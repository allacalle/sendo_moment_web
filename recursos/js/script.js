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

  // --- Función para leer y decodificar parámetro 'data' ---
  function getDecodedDataParam() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (!encoded) return null;
    try {
      const decodedString = atob(decodeURIComponent(encoded));
      return JSON.parse(decodedString);
    } catch (e) {
      console.error("Error decodificando parámetro 'data':", e);
      return null;
    }
  }

  const decodedMomentData = JSON.parse(decodeURIComponent(atob(dataParam)));


  // --- Valores por defecto ---
  const defaultMoment = {
    img: 'https://allacalle.github.io/sendo_moment_web/recursos/images/sendo_banner.jpg',
    phrase: 'Un Momento de SenDo para Ti',
    author: 'SenDo',
    music: '',
    songTitle: '',
    songArtist: '',
    imgPhotographer: '',
    songArtistUrl: null,
    imgPhotographerUrl: null,
  };

  const momentData = decodedMomentData || defaultMoment;

  // --- Rellenar contenido ---
  if (momentData.img) momentContainer.style.backgroundImage = `url(${momentData.img})`;
  phraseText.textContent = `"${momentData.phrase}"`;
  authorText.textContent = `- ${momentData.author}`;
  photoArtistText.textContent = momentData.imgPhotographer || '';
  musicTitleText.textContent = momentData.songTitle || '';
  musicArtistText.textContent = momentData.songArtist || '';
  phraseAuthorText.textContent = momentData.author || '';

  if (momentData.imgPhotographerUrl) {
    photoArtistText.innerHTML = `<a href="${momentData.imgPhotographerUrl}" target="_blank">${momentData.imgPhotographer}</a>`;
  }
  if (momentData.songArtistUrl) {
    musicArtistText.innerHTML = `<a href="${momentData.songArtistUrl}" target="_blank">${momentData.songArtist}</a>`;
  }

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

  // --- Panel de atribuciones ---
  attributionButton.addEventListener('click', (e) => {
    e.stopPropagation();
    attributionPanel.classList.toggle('visible');
  });
  document.body.addEventListener('click', (e) => {
    if (
      attributionPanel.classList.contains('visible') &&
      !attributionPanel.contains(e.target) &&
      !attributionButton.contains(e.target)
    ) {
      attributionPanel.classList.remove('visible');
    }
  });
});
