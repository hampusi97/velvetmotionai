import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const provider = http.createServer(async (req, res) => {
  let raw = ''; for await (const part of req) raw += part;
  const body = JSON.parse(raw);
  const text = body.messages.at(-1).content;
  res.setHeader('Content-Type', 'application/json');
  if (text === 'reject') { res.writeHead(401); res.end('{}'); return; }
  if (text === 'empty') { res.end(JSON.stringify({ choices: [] })); return; }
  res.end(JSON.stringify({ choices: [{ message: { content: 'Test provider reply' } }] }));
});
provider.listen(0, '127.0.0.1'); await once(provider, 'listening');
const portFinder = http.createServer(); portFinder.listen(0, '127.0.0.1'); await once(portFinder, 'listening');
const port = portFinder.address().port; await new Promise(resolve => portFinder.close(resolve));
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  env: { ...process.env, XAI_API_KEY: '', AI_CHAT_API_KEY: 'test-provider-key-for-local-checks', AI_CHAT_ENDPOINT: `http://127.0.0.1:${provider.address().port}/v1`, AI_CHAT_MODEL: 'test-model' }, stdio: 'ignore',
});
const url = `http://127.0.0.1:${port}/api/chat`;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(url)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, 'production server starts');
  assert.equal((await (await fetch(url)).json()).configured, true);
  const post = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const ok = await post({ companionId: 'own_test', companionName: 'Test companion', message: 'Hello' });
  assert.equal(ok.status, 200); const result = await ok.json();
  assert.equal(result.source, 'external-ai'); assert.equal(result.reply, 'Test provider reply');
  for (const message of ['reject', 'empty']) {
    const response = await post({ companionId: 'chloe', message });
    assert.equal(response.status, 502); assert.equal((await response.json()).reply, undefined);
  }
  for (const body of [{}, { message: 123 }, { message: 'hello', memories: {} }, { message: 'hello', conversationHistory: [null] }]) assert.equal((await post(body)).status, 400);
  console.log('ok: configured provider, real reply forwarding, rejected/empty provider errors, request validation (local mock only)');
} finally {
  app.kill('SIGTERM');
  provider.closeAllConnections(); await new Promise(resolve => provider.close(resolve));
}
