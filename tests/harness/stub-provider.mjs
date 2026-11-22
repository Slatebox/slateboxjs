// A local stand-in for the AI provider (OpenAI-compatible chat completions with a tool call).
// It answers the presentation plan with the request's own suggested groups as segments.
// Mode (POST /mode {"mode":"fast"|"hang"|"slow","ms":N}): fast answers at once, slow after ms,
// hang never answers. Every request is logged with its arrival time and the body's size.
import http from 'node:http'
const port = Number(process.argv[2] || 5291)
let mode = { mode: 'fast', ms: 0 }
const log = []
const answer = (body) => {
  const text = body.messages.map((m) => typeof m.content === 'string' ? m.content : JSON.stringify(m.content)).join('\n')
  const match = text.match(/Suggested groups: (\[\[.*?\]\])/)
  const groups = match ? JSON.parse(match[1]) : []
  const args = { name: 'Stub plan', description: 'A plan from the stub', opening: 'Stub opening: the whole slate', closing: 'Stub closing',
    segments: groups.map((nodeIds, i) => ({ nodeIds, narrative: 'Stub segment ' + (i + 1), duration: 3000 })) }
  return { id: 'stub', object: 'chat.completion', model: body.model, choices: [{ index: 0, finish_reason: 'tool_calls',
    message: { role: 'assistant', content: null, tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'createPresentation', arguments: JSON.stringify(args) } }] } }],
    usage: { prompt_tokens: Math.ceil(text.length / 3), completion_tokens: 200, total_tokens: Math.ceil(text.length / 3) + 200 } }
}
http.createServer((req, res) => {
  let data = ''
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => {
    if (req.url === '/mode') { mode = JSON.parse(data || '{}'); res.end(JSON.stringify(mode)); return }
    if (req.url === '/log') { res.end(JSON.stringify(log)); return }
    const body = JSON.parse(data || '{}')
    log.push({ at: Date.now(), mode: mode.mode, chars: data.length, max_tokens: body.max_tokens, model: body.model, tools: (body.tools || []).map((t) => t.function?.name) })
    if (mode.mode === 'hang') return
    setTimeout(() => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(answer(body))) }, mode.mode === 'slow' ? mode.ms : 0)
  })
}).listen(port, '127.0.0.1', () => console.log('stub provider on', port))
