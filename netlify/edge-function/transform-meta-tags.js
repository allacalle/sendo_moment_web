export default async (request, context) => {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('img');
  const phrase = url.searchParams.get('phrase');
  const author = url.searchParams.get('author');

  // Obtenemos la página original
  const response = await context.next();
  let page = await response.text();

  // Solo modificamos si tenemos los datos necesarios
  if (phrase) {
    const title = `"${phrase}"`;
    page = page.replace(
      '<meta property="og:title" content="Un Momento de SenDo">',
      `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}">`
    );
    page = page.replace(
      '<title>Un Momento de SenDo</title>',
      `<title>${title}</title>`
    );
  }

  if (imageUrl) {
    page = page.replace(
      '<meta property="og:image" content="">',
      `<meta property="og:image" content="${imageUrl}">`
    );
  }
  
  if (author) {
      page = page.replace(
        '<meta property="og:description" content="Una experiencia de calma compartida contigo.">',
        `<meta property="og:description" content="Un Momento de calma de ${author}.">`
    );
  }

  // Devolvemos la página modificada
  return new Response(page, response);
};