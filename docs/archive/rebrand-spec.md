# Slatebox homepage rebrand spec (R1, Nov 16 2026)

## Positioning
**Slatebox — the open-source Miro alternative.**
Open canvas + AI assistant for thinking together. MIT licensed, self-hostable,
your data yours. Hosted cloud optional; the .js you can read is the .js that
runs app.slatebox.com.

Target stack: Cloudflare Pages (static-first, NO framework) + one Pages
Function (waitlist email → Mailgun). Deploy `npx wrangler pages deploy` from
the site repo. Retire k8s slatebox-marketing + slatebox-api after cutover.

## Claims ledger (ONLY claims with a check may ship; unverified = absent)
| claim | status | check |
|---|---|---|
| infinite canvas, notes/shapes/connectors/text | TRUE (v3 engine) | smoke: canvas load |
| AI generation from a prompt (5+ template kinds) | TRUE (probes green) | live-probe |
| templates incl. pro/con, timelines, mind-maps | TRUE | gallery smoke |
| present mode | TRUE (PRESENT path) | e2e spec (write) |
| PNG/SVG export | LIKELY (toolbar) | e2e spec (write) |
| self-host: npm/docker, MIT | TRUE post-relicense | repo link check |
| real-time multiplayer | **FALSE TODAY** (legacy WS dead; don't claim until re-sited) | — |
| Miro/FigJam import | UNVERIFIED — do not ship without spec+test | — |

vs Miro copy uses only ledger-green rows. Pricing table: Free cloud tier +
BYO-key self-host ("bring your own AI key") — verify quota copy vs actual
47/200 quota system before shipping numbers.

## Information architecture (one page + /waitlist retired)
1. Hero: claim + live-embed demo (read-only canvas iframe, §embed) + CTAs:
   [Open the canvas →] (app.slatebox.com) + [GitHub (MIT)] — GitHub repo URL
   pending owner (Slatebox/slatebox private → make public? owner decision).
2. "What it does" — ledger-green features as screenshots/GIFs, no vapor.
3. "Open source" block: MIT badge, repo link, self-host one-liner (docker
   compose), "read every line that touches your data".
4. Comparison strip vs Miro/FigJam: canvas-native AI + self-host + MIT.
   Competitor facts dated + sourced (no stale price claims).
5. Footer: privacy note (no conversation content served publicly — NEW
   embed/gallery design enforces opt-in flag + redaction, unlike legacy).

## /embed viewer design (replacement for sb.min.js + api.slatebox.com)
- Shape: iframe → app route /canvas/:id/view (READ-ONLY render, fresh
  renderer path, no collab socket, no conversation fetch).
- Parity harness: before retiring the api pod, spec renders 3 sample slates
  in iframe vs old widget + privacy assertion (page source contains no
  conversation text unless author explicitly opts in).
- Privacy redline: legacy exposed conversation-keyed share content; new
  path ships with the redaction test as a gate.

## Deploy + rollback
- New repo slatebox-home (Pages project, preview deploys from main pushes).
- cutover: slatebox-dns.sh flip slatebox.com + www → Pages (or keep Pages
  direct deploy, no k8s); k8s marketing kept 48h as rollback origin.
- test surface: smoke script (curl asserts: H1 marker, GitHub link, no api
  .slatebox.com refs, waitlist POST shape) + Playwright spec in app repo
  pointing at staging preview URL.

## Open questions for owner
- Public GitHub URL for the "open source" links (repo exists private?)
- Keep waitlist, or replace with direct "start free canvas" (no gate)?
