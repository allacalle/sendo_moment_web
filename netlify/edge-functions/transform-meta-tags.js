export default async (request, context) => {
  console.log("--- ¡MAYORDOMO ACTIVADO! ---");
  console.log("Visitante:", request.headers.get('user-agent'));
  
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('img');
  const phrase = url.searchParams.get('phrase');

  console.log("Parámetro 'img' encontrado:", imageUrl ? 'Sí' : 'No');
  console.log("Parámetro 'phrase' encontrado:", phrase ? 'Sí' : 'No');

  const response = await context.next();
  let page = await response.text();
  
  let modified = false;

  if (imageUrl) {
    if (page.includes('<meta property="og:image" content="">')) {
      page = page.replace(
        '<meta property="og:image" content="">',
        `<meta property="og:image" content="${imageUrl}">`
      );
      console.log("✅ Meta tag 'og:image' REESCRITO.");
      modified = true;
    }
  }

  if (phrase) {
    if (page.includes('<meta property="og:title" content="Un Momento de SenDo">')) {
      page = page.replace(
        '<meta property="og:title" content="Un Momento de SenDo">',
        `<meta property="og:title" content="${phrase.replace(/"/g, '&quot;')}">`
      );
      console.log("✅ Meta tag 'og:title' REESCRITO.");
      modified = true;
    }
  }
  
  if (!modified) {
    console.log("⚠️ NO SE REESCRIBIÓ NINGÚN TAG. El HTML original no coincidía.");
  }
  
  console.log("--- Mayordomo terminando. Sirviendo página. ---");
  return new Response(page, response);
};