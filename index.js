export default {
  async fetch(request, env, ctx) {
    const API_TOKEN = '4TENgJpu2BqzILMqXt3_yo7UKxKQJV7vlaENCm6E';
    const ACCOUNT_ID = '6bdc87c506c509a177b5ab322a2b99b7';
    const BUCKET_NAME = 'cdn-truyencuatui';

    const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}?list-type=2`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      return new Response('Không thể fetch file từ R2.', { status: 500 });
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const contents = Array.from(xml.getElementsByTagName('Contents'));

    const rawlist = [];

    contents.forEach(item => {
      const key = item.getElementsByTagName('Key')[0].textContent;
      if (key.endsWith('.zip') || key.endsWith('.html') || key.endsWith('.txt')) {
        const nameOnly = key.replace(/\.(zip|html|txt)$/i, '');
        const publicUrl = `https://${ACCOUNT_ID}.r2.dev/${key}`;
        rawlist.push({
          name: nameOnly,
          url: publicUrl
        });
      }
    });

    return new Response(JSON.stringify(rawlist, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}