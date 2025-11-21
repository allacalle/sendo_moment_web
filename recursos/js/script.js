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

  // --- Cargar momento desde Base64 o Supabase ---
  const decodedMomentData = await loadMoment();

  if (!decodedMomentData) {
    phraseText.textContent = 'No se pudo cargar el momento';
    return;
  }

  // --- Valores ---
  const metaImageUrl = decodedMomentData.img || '';
  const metaPhrase = decodedMomentData.phrase || '';
  const metaAuthor = decodedMomentData.author || '';
  const musicUrl = decodedMomentData.music || '';
  const songTitle = decodedMomentData.songTitle || 'Pista Curada';
  const songArtist = decodedMomentData.songArtist || 'SenDo Community';
  const imgPhotographer = decodedMomentData.imgPhotographer || 'SenDo Community';
  const songArtistUrl = decodedMomentData.songArtistUrl || null;
  const imgPhotographerUrl = decodedMomentData.imgPhotographerUrl || null;

  // --- Rellenar el body ---
  if (metaImageUrl) momentContainer.style.backgroundImage = `url(${metaImageUrl})`;
  phraseText.textContent = `"${metaPhrase}"`;
  authorText.textContent = `- ${metaAuthor}`;
  photoArtistText.textContent = `de ${imgPhotographer}`;
  musicTitleText.textContent = `"${songTitle}"`;
  musicArtistText.textContent = `de ${songArtist}`;
  phraseAuthorText.textContent = `de ${metaAuthor}`;

  if (imgPhotographerUrl) {
    photoArtistText.innerHTML = `de <a href="${imgPhotographerUrl}" target="_blank">${imgPhotographer}</a>`;
  }
  if (songArtistUrl) {
    musicArtistText.innerHTML = `de <a href="${songArtistUrl}" target="_blank">${songArtist}</a>`;
  }

  // --- Audio ---
  let isPlaying = false;
  let audioSourceSet = false;

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
    if (!audioSourceSet) { momentAudio.src = musicUrl; audioSourceSet = true; }
    momentAudio.play().catch(console.error);
  });

  playSilentButton.addEventListener('click', (e) => { e.stopPropagation(); headphoneOverlay.style.display = 'none'; });

  momentAudio.onplaying = () => { isPlaying = true; playPauseButton.classList.add('playing'); };
  momentAudio.onpause = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };
  momentAudio.onended = () => { isPlaying = false; playPauseButton.classList.remove('playing'); };

  attributionButton.addEventListener('click', (e) => { e.stopPropagation(); attributionPanel.classList.toggle('visible'); });
  document.body.addEventListener('click', (e) => {
    if (attributionPanel.classList.contains('visible') && !attributionPanel.contains(e.target) && !attributionButton.contains(e.target)) {
      attributionPanel.classList.remove('visible');
    }
  });
});
