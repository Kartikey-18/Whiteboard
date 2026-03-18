const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const KV_KEY = 'items';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/items' && request.method === 'GET') {
      const data = await env.WHITEBOARD.get(KV_KEY);
      return new Response(data || '[]', {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    if (url.pathname === '/items' && request.method === 'PUT') {
      const body = await request.text();

      // Validate JSON
      try {
        JSON.parse(body);
      } catch {
        return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS });
      }

      await env.WHITEBOARD.put(KV_KEY, body);
      return new Response('OK', { headers: CORS_HEADERS });
    }

    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  },
};
