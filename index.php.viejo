<?php
    // --- EL GUIONISTA (Se ejecuta en el servidor antes de nada) ---

    // 1. Leemos los parámetros de la URL de forma segura.
    $imageUrl = isset($_GET['img']) ? htmlspecialchars($_GET['img']) : '';
    $phrase = isset($_GET['phrase']) ? htmlspecialchars($_GET['phrase']) : 'Un Momento de SenDo';
    $author = isset($_GET['author']) ? htmlspecialchars($_GET['author']) : 'SenDo';
    
    // El título de la página y la descripción para los meta tags.
    $pageTitle = '"' . $phrase . '" - Un Momento de SenDo';
    $pageDescription = 'Un Momento de calma de ' . $author . '.';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 2. Imprimimos los valores dinámicos en el HTML. -->
    <title><?php echo $pageTitle; ?></title>
    
    <!-- Meta Tags de Open Graph DINÁMICOS -->
    <meta property="og:title" content="<?php echo $phrase; ?>" />
    <meta property="og:description" content="<?php echo $pageDescription; ?>" />
    <meta property="og:image" content="<?php echo $imageUrl; ?>" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image">

    <!-- El resto de su <head> no cambia -->
    <link rel="stylesheet" href="recursos/css/styles.css"> 
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital@0;1&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
</head>

<body>

    <main id="moment-container">
        
        <!-- --- ¡LA PIEZA RESTAURADA! --- -->
        <div id="headphone-overlay" class="overlay">
            <div class="overlay-content">
                <p>Para una mejor experiencia, te recomendamos usar auriculares.</p>
                <button id="play-anyway-button">Reproducir Audio</button>
                <button id="play-silent-button">Continuar en Silencio</button>
            </div>
        </div>

        <div id="moment-content">
            <h2 id="phrase-text"></h2>
            <p id="author-text"></p>
        </div>

        <div id="on-screen-controls">
            <div id="attribution-panel">
                <h3>Sobre los Artistas</h3>
                <div><h4>Fotografía</h4><p id="photo-artist"></p><p class="via-text">vía Pexels</p></div>
                <div><h4>Música</h4><p id="music-title"></p><p id="music-artist"></p><p class="via-text">vía Jamendo</p></div>
                <div><h4>Frase</h4><p id="phrase-author"></p></div>
            </div>
            <div id="bottom-buttons-row">
                <div id="attribution-button"><img src="recursos/images/attribution.webp" alt="Sobre los Artistas"></div>
                <div id="audio-player"><button id="play-pause-button"></button><audio id="moment-audio" src=""></audio></div>
                <div class="button-spacer"></div>
            </div>
        </div>
    </main>

    <div id="cta-bar">
        <div id="cta-text"><p>Esto es un Momento creado con <strong>SenDo</strong>, una app gratuita para encontrar tu calma diaria.</p></div>
        <div id="cta-button"><a id="download-link" href="#" target="_blank"><img src="recursos/images/googleplay.webp" alt="Obtener en Google Play"></a></div>
    </div>

    <footer id="ad-footer">
        <div id="ad-container"></div>
        <button id="close-ad-button">×</button>
    </footer>
    <script src="recursos/js/script.js"></script>
</body>
</html>