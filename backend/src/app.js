import { createServer } from 'node:http';
import { ApiError, CATEGORIES, TOOL_NAMES, TOOL_NAMES_BY_CATEGORY, createStore } from './store.js';

const MAX_BODY_BYTES = 64 * 1024;

function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    ...headers,
  });
  response.end(JSON.stringify(data));
}

async function readJson(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] ?? '')) {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Content-Type must be application/json.');
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size <= MAX_BODY_BYTES) chunks.push(chunk);
  }
  if (size > MAX_BODY_BYTES) {
    throw new ApiError(413, 'BODY_TOO_LARGE', 'Request body must not exceed 64 KiB.');
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(400, 'INVALID_JSON', 'Request body must contain valid JSON.');
    }
    throw error;
  }
}

export function createApp({ store = createStore() } = {}) {
  return createServer(async (request, response) => {
    try {
      const path = new URL(request.url, 'http://localhost').pathname;
      if (request.method === 'OPTIONS') {
        response.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
        response.end();
        return;
      }

      const methods = {
        '/api/tools': ['GET', 'POST'],
        '/api/tools/grouped': ['GET'],
        '/api/tool-names': ['GET'],
        '/api/categories': ['GET'],
        '/api/purchases': ['POST'],
      };
      const stockMatch = /^\/api\/tools\/([^/]+)\/stock$/.exec(path);
      const toolMatch = /^\/api\/tools\/([^/]+)$/.exec(path);
      const allowedMethods = Object.hasOwn(methods, path) ? methods[path] :
        stockMatch ? ['POST'] : toolMatch ? ['DELETE'] : undefined;
      if (!allowedMethods) {
        throw new ApiError(404, 'NOT_FOUND', 'Endpoint not found.');
      }
      if (!allowedMethods.includes(request.method)) {
        sendJson(response, 405, { error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }, {
          Allow: allowedMethods.join(', '),
        });
        return;
      }

      if (path === '/api/categories') {
        sendJson(response, 200, CATEGORIES);
      } else if (path === '/api/tool-names') {
        sendJson(response, 200, TOOL_NAMES);
      } else if (path === '/api/tools/grouped') {
        sendJson(response, 200, TOOL_NAMES_BY_CATEGORY);
      } else if (path === '/api/tools' && request.method === 'GET') {
        sendJson(response, 200, store.listTools());
      } else if (path === '/api/tools') {
        const tool = store.addTool(await readJson(request));
        sendJson(response, 201, tool);
      } else if (stockMatch) {
        const tool = store.addStock(stockMatch[1], await readJson(request));
        sendJson(response, 200, tool);
      } else if (toolMatch) {
        store.deleteTool(toolMatch[1]);
        response.writeHead(204, { 'Access-Control-Allow-Origin': '*' });
        response.end();
      } else {
        const tools = store.purchase(await readJson(request));
        sendJson(response, 200, { tools });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const body = { code: error.code, message: error.message };
        if (error.details !== undefined) body.details = error.details;
        if (!response.destroyed) sendJson(response, error.status, { error: body });
      } else {
        console.error('Request failed:', error);
        if (!response.destroyed) {
          sendJson(response, 500, { error: { code: 'INTERNAL_ERROR', message: 'Internal server error.' } });
        }
      }
    }
  });
}
