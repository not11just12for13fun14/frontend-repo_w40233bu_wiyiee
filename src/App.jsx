import { useEffect, useRef, useState } from 'react'
import { Heart, Sparkles, PenTool, Smile, ShowerHead } from 'lucide-react'

// Lightweight doodle canvas so she can draw right on the page
function DoodleCanvas() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#db2777') // pink-600
  const [size, setSize] = useState(6)
  const [bg, setBg] = useState('#fff7fb')

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = parent.clientWidth
      const h = 320
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      const ctx = canvas.getContext('2d')
      ctx.setTransform(1, 0, 0, 1, 0, 0) // reset before scale
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
      ctxRef.current = ctx
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [bg])

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: cx - rect.left, y: cy - rect.top }
  }

  const start = (e) => {
    const p = pos(e)
    setIsDrawing(true)
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }
  const move = (e) => {
    if (!isDrawing) return
    const p = pos(e)
    const ctx = ctxRef.current
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }
  const end = () => setIsDrawing(false)

  const clear = () => {
    const c = canvasRef.current
    const ctx = ctxRef.current
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.restore()
  }

  const save = () => {
    const link = document.createElement('a')
    link.download = 'fathima-doodle.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Color
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" aria-label="Brush color" />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Brush
          <input type="range" min="1" max="24" value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-pink-500" aria-label="Brush size" />
          <span className="text-xs text-gray-500">{size}px</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Canvas
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" aria-label="Canvas background" />
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={clear} className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200">Clear</button>
          <button onClick={save} className="px-3 py-1.5 text-sm rounded bg-pink-600 text-white hover:bg-pink-700">Save</button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-pink-200 shadow-sm bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={(e) => { e.preventDefault(); start(e) }}
          onTouchMove={(e) => { e.preventDefault(); move(e) }}
          onTouchEnd={(e) => { e.preventDefault(); end() }}
          className="block w-full touch-none"
        />
      </div>
    </div>
  )
}

function App() {
  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-sky-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-white/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-fuchsia-500 grid place-items-center text-white">
            <Heart className="h-5 w-5" />
          </div>
          <p className="font-semibold text-gray-800">For my amazing sister, Fathima</p>
          <span className="ml-auto inline-flex items-center gap-1 text-pink-600 text-sm">
            <Sparkles className="h-4 w-4" />
            Made with love by your brother
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/40 via-fuchsia-200/30 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Hey Fathima, you are a masterpiece in progress
              </h1>
              <p className="mt-4 text-gray-600 text-lg">
                Your English is smooth, your art is fearless, and your laugh is my favorite soundtrack. I love how you make friends online (even in Pakistan!), how dramatic you can be in the best way, and how you slay outfits in Roblox: Dress to Impress on your PC.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => setOpen(true)} className="px-5 py-2.5 rounded-full bg-pink-600 text-white hover:bg-pink-700 shadow">
                  Open the surprise
                </button>
                <a href="#doodle" className="px-5 py-2.5 rounded-full bg-white text-pink-700 border border-pink-200 hover:bg-pink-50">
                  Jump to doodles
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-6 h-28 w-28 bg-pink-200/60 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-6 h-24 w-24 bg-fuchsia-200/60 rounded-full blur-2xl" />
              <div className="relative bg-white/70 backdrop-blur rounded-2xl border border-white/60 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <PenTool className="h-6 w-6 text-pink-600" />
                  <h3 className="font-semibold text-gray-800">Creative soul</h3>
                </div>
                <p className="mt-3 text-gray-600 text-sm">
                  Fathima, I love the way you draw — the swirls, the colors, the boldness. Keep creating animations and stories. Your art is your superpower.
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Smile className="h-4 w-4" />
                  Proud brother mode: always on.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surprise content */}
      {open && (
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl border border-pink-100/70 shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900">Reasons I admire you</h2>
              <ul className="mt-4 space-y-3 text-gray-700">
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-500" />Fathima, you speak English so confidently — keep shining in every conversation.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-fuchsia-500" />Your drawings and animations bring ideas to life — the world needs your art.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />You’re funny, delightfully dramatic, and wonderfully you — that’s your magic.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />You build friendships online with kindness — even across borders.</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />You have awesome style — Dress to Impress champion energy.</li>
              </ul>
              <button onClick={() => setOpen(false)} className="mt-6 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Hide section</button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 shadow-sm p-6">
                <div className="flex items-center gap-2 text-rose-700">
                  <ShowerHead className="h-5 w-5" />
                  <h3 className="font-semibold">A silly (loving) reminder</h3>
                </div>
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                  You’re perfect just the way you are — even if you don’t love frequent baths. Consider this a friendly sparkle-spritz reminder, Fathima: self-care makes you glow even more! 💦✨
                </p>
                <p className="mt-2 text-xs text-gray-500">No pressure. Just vibes. Love you!</p>
              </div>

              <div className="rounded-2xl border border-fuchsia-100 bg-white shadow-sm p-6">
                <div className="flex items-center gap-2 text-fuchsia-700">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">About Fathima</h3>
                </div>
                <p className="mt-3 text-sm text-gray-700">Little things that make you, you:</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100">PC gamer</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-pink-50 text-pink-700 border border-pink-100">Roblox: Dress to Impress</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-100">Dramatic queen</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-100">Online friends in Pakistan</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-700 border border-amber-100">Animator in the making</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Friend-maker online</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Doodle area */}
      <section id="doodle" className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-pink-100/70 shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <PenTool className="h-5 w-5 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Your doodle corner</h2>
          </div>
          <p className="text-gray-600 mb-4">Draw anything you like — then save it as a little memory.</p>
          <DoodleCanvas />
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center bg-white/70 backdrop-blur rounded-full border border-white/60 px-5 py-3 inline-block shadow-sm">
            <span className="text-gray-700">With all my love, always — your big brother</span>
            <span className="ml-2 inline-flex items-center text-pink-600"><Heart className="h-4 w-4 mr-1" /> forever</span>
          </div>
          <p className="mt-3 text-center text-sm text-gray-500">For Fathima ❤️</p>
        </div>
      </footer>
    </div>
  )
}

export default App
