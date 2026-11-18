// Two original four-second loops. A seeded source keeps the copper droplets
// repeatable while the four glass pitches ring on different beats.
export function playSculptures() {
  const Audio = window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Audio) throw new Error("Web Audio is unavailable")
  const ctx = new Audio()
  const rate = ctx.sampleRate
  const length = rate * 4
  const rain = ctx.createBuffer(1, length, rate)
  const glass = ctx.createBuffer(1, length, rate)
  const drops = rain.getChannelData(0)
  const chimes = glass.getChannelData(0)
  let seed = 419
  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0
    return seed / 4294967296
  }
  for (let note = 0; note < 100; note++) {
    const start = Math.floor(random() * length)
    const pitch = 380 + random() * 1500
    const level = 0.09 + random() * 0.08
    for (let i = 0; i < rate * 0.12; i++) {
      const t = i / rate
      const tone = Math.sin(2 * Math.PI * pitch * t) + 0.22 * (random() * 2 - 1)
      drops[(start + i) % length] += level * Math.exp(-t * 76) * tone
    }
  }
  ;[659.25, 987.77, 783.99, 1174.66].forEach((pitch, index) => {
    const start = Math.floor((index * 0.93 + 0.10) * rate)
    for (let i = 0; i < rate * 1.6; i++) {
      const t = i / rate
      const tone = Math.sin(t * pitch * 2 * Math.PI) + 0.23 * Math.sin(t * pitch * 5.42 * Math.PI)
      chimes[(start + i) % length] += 0.16 * Math.min(1, t * 250) * Math.exp(-t * 3.3) * tone
    }
  })
  const gains = [rain, glass].map(buffer => {
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()
    gain.gain.value = 0
    source.buffer = buffer
    source.loop = true
    source.connect(gain).connect(ctx.destination)
    source.start()
    return gain
  })
  return {
    ctx,
    mix(amount: number) {
      gains[0].gain.setTargetAtTime(Math.cos(amount * Math.PI / 2), ctx.currentTime, 0.035)
      gains[1].gain.setTargetAtTime(Math.sin(amount * Math.PI / 2), ctx.currentTime, 0.035)
    },
    stop() { void ctx.close() },
  }
}
