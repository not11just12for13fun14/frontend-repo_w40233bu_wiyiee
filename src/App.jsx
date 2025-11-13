import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, PenTool, Smile, ShowerHead, Gamepad2, Palette, Users, Crown, Check } from 'lucide-react'
import DoodleCanvas from './components/DoodleCanvas'
import Badge from './components/Badge'

function SparkleBurst({ trigger }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    if (!trigger) return
    const shards = Array.from({ length: 16 }).map((_, i) => ({ id: i, x: (Math.random() - 0.5) * 140, y: (Math.random() - 0.5) * 140, d: 700 + Math.random() * 400, s: 0.6 + Math.random() * 0.8 }))
    setItems(shards)
    const t = setTimeout(() => setItems([]), 900)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        {items.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: p.s, x: p.x, y: p.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.d / 1000, ease: 'easeOut' }}
            className="absolute h-2 w-2 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 shadow"
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function TypewriterSparkle({ text }) {
  const [index, setIndex] = useState(0)
  const [burst, setBurst] = useState(0)
  useEffect(() => {
    setIndex(0)
    const id = setInterval(() => {
      setIndex((i) => {
        const ni = Math.min(text.length, i + 1)
        if (ni % 6 === 0) setBurst((b) => b + 1)
        if (ni === text.length) clearInterval(id)
        return ni
      })
    }, 35)
    return () => clearInterval(id)
  }, [text])

  const shown = text.slice(0, index)
  const rest = text.slice(index)
  return (
    <div className="relative">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        {shown}
        <span className="opacity-40">{rest && '|'}
        </span>
      </h1>
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <SparkleBurst trigger={burst} />
      </div>
    </div>
  )
}

function PhotoGallery() {
  const [files, setFiles] = useState([])
  const [view, setView] = useState(null)

  const onPick = (e) => {
    const arr = Array.from(e.target.files || [])
    const mapped = arr.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    setFiles((prev) => [...prev, ...mapped].slice(0, 12))
  }

  const removeAt = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sky-700 mb-3">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-semibold">Mini gallery</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">Add a few photos or Roblox screenshots you love. They stay on this page only.</p>
      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 cursor-pointer">
        <input type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
        Upload images
      </label>

      {files.length > 0 && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((f, i) => (
            <motion.div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button onClick={() => setView(f)} className="absolute inset-0">
                <img src={f.url} alt={f.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </button>
              <button onClick={() => removeAt(i)} className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
              <span className="absolute inset-0 ring-0 group-hover:ring-2 ring-pink-300/60 rounded-xl transition-all" />
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {view && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setView(null)}
          >
            <motion.img
              src={view.url}
              alt={view.name}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LetterCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
      <div className="absolute inset-0 opacity-[0.085]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 30px, #fda4af 30px 31px)' }} />
      <div className="relative p-6">
        <div className="flex items-center gap-2 text-rose-700 mb-2">
          <Heart className="h-5 w-5" />
          <h3 className="font-semibold">A little letter for you</h3>
        </div>
        <p className="text-gray-700 leading-8 italic">
          Dear Fathima, I’m proud of the person you are and the artist you’re becoming. Your kindness, humor, and brave creativity light up our world. Keep speaking boldly, drawing wildly, and being your dramatic, wonderful self. I’ll always be cheering for you.
        </p>
        <p className="mt-4 text-right text-pink-700 font-medium">— Your big brother</p>
      </div>
    </div>
  )
}

function SoundToggle() {
  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  const start = async () => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const gain = ctx.createGain()
      gain.gain.value = 0.04
      gain.connect(ctx.destination)

      // Soft shimmer: two detuned triangles
      const osc1 = ctx.createOscillator()
      osc1.type = 'triangle'
      osc1.frequency.value = 220
      osc1.detune.value = -6
      osc1.connect(gain)
      osc1.start()

      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.value = 330
      osc2.detune.value = +6
      osc2.connect(gain)
      osc2.start()

      ctxRef.current = ctx
      gainRef.current = gain
    }
    setOn(true)
  }

  const stop = () => {
    if (ctxRef.current) {
      ctxRef.current.suspend()
    }
    setOn(false)
  }

  useEffect(() => {
    if (!ctxRef.current) return
    if (on) {
      ctxRef.current.resume()
    }
  }, [on])

  return (
    <button onClick={on ? stop : start} className={`px-3 py-1.5 rounded-full border text-sm ${on ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-700 border-pink-200 hover:bg-pink-50'}`}>
      {on ? 'Pause soundtrack' : 'Play soft soundtrack'}
    </button>
  )
}

function App() {
  const [open, setOpen] = useState(true)
  const [burstKey, setBurstKey] = useState(0)
  const [unlocked, setUnlocked] = useState({})

  const openWithSparkles = () => {
    setOpen(true)
    setBurstKey((k) => k + 1)
  }

  const toggleBadge = (key) => setUnlocked((u) => ({ ...u, [key]: !u[key] }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-sky-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/60 border-b border-white/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 250, damping: 18 }} className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-fuchsia-500 grid place-items-center text-white">
            <Heart className="h-5 w-5" />
            <SparkleBurst trigger={burstKey} />
          </motion.div>
          <p className="font-semibold text-gray-800">For my amazing sister, Fathima</p>
          <span className="ml-auto inline-flex items-center gap-2">
            <SoundToggle />
            <span className="inline-flex items-center gap-1 text-pink-600 text-sm">
              <Sparkles className="h-4 w-4" />
              Made with love by your brother
            </span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/40 via-fuchsia-200/30 to-transparent" />
          <motion.div className="absolute -top-10 -right-6 h-28 w-28 bg-pink-200/60 rounded-full blur-2xl" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} />
          <motion.div className="absolute -bottom-8 -left-6 h-24 w-24 bg-fuchsia-200/60 rounded-full blur-2xl" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7 }} />
        </motion.div>
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
              <TypewriterSparkle text="Hey Fathima, you are a masterpiece in progress" />
              <p className="mt-4 text-gray-600 text-lg">
                Your English is smooth, your art is fearless, and your laugh is my favorite soundtrack. I love how you make friends online (even in Pakistan!), how dramatic you can be in the best way, and how you slay outfits in Roblox: Dress to Impress on your PC.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button onClick={openWithSparkles} className="px-5 py-2.5 rounded-full bg-pink-600 text-white hover:bg-pink-700 shadow relative overflow-hidden">
                  <span className="relative z-10">Open the surprise</span>
                </button>
                <a href="#doodle" className="px-5 py-2.5 rounded-full bg-white text-pink-700 border border-pink-200 hover:bg-pink-50">
                  Jump to doodles
                </a>
              </div>
            </motion.div>
            <motion.div className="relative" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Surprise content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            className="max-w-5xl mx-auto px-4 pb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-pink-100/70 shadow-sm p-6">
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

                <LetterCard />
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
                    <h3 className="font-semibold">Achievements</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">Tap to unlock — just for fun!</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { key: 'gamer', color: 'sky', icon: Gamepad2, label: 'PC gamer' },
                      { key: 'dress', color: 'pink', icon: Crown, label: 'Dress to Impress' },
                      { key: 'drama', color: 'rose', icon: Smile, label: 'Dramatic queen' },
                      { key: 'friends', color: 'emerald', icon: Users, label: 'Friends in Pakistan' },
                      { key: 'anim', color: 'amber', icon: Palette, label: 'Animator in the making' },
                    ].map(({ key, color, icon: Icon, label }) => (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleBadge(key)}
                        className="relative"
                      >
                        <Badge color={color}>
                          <span className="inline-flex items-center gap-1">
                            <Icon className="h-3.5 w-3.5" /> {label}
                          </span>
                        </Badge>
                        <AnimatePresence>
                          {unlocked[key] && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="absolute -top-2 -right-2 grid place-items-center h-5 w-5 rounded-full bg-emerald-500 text-white shadow"
                            >
                              <Check className="h-3 w-3" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <PhotoGallery />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center bg-white/70 backdrop-blur rounded-full border border-white/60 px-5 py-3 inline-block shadow-sm">
            <span className="text-gray-700">With all my love, always — your big brother</span>
            <span className="ml-2 inline-flex items-center text-pink-600"><Heart className="h-4 w-4 mr-1" /> forever</span>
          </motion.div>
          <p className="mt-3 text-center text-sm text-gray-500">For Fathima ❤️</p>
        </div>
      </footer>
    </div>
  )
}

export default App
