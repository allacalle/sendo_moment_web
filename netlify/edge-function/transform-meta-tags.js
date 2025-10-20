export default async (request, context) => {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('img');
  const phrase = url.searchParams.get('phrase');

  const response = await context.next();
  let page = await response.text();

  if (imageUrl) {
    page = page.replace(
      '<meta property="og:image" content="">',
      `<meta property="og:image" content="${imageUrl}">`
    );
  }
  if (phrase) {
    page = page.replace(
      '<meta property="og:title" content="Un Momento de SenDo">',
      `<meta property="og:title" content="${phrase}">`
    );
  }
  return new Response(page, response);
};