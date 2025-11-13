import { useEffect, useRef, useState } from 'react'

export default function DoodleCanvas() {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#db2777')
  const [size, setSize] = useState(6)
  const [bg, setBg] = useState('#fff7fb')
  const [mode, setMode] = useState('draw') // 'draw' | 'stamp'
  const [stamp, setStamp] = useState('💖')

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
      ctx.setTransform(1, 0, 0, 1, 0, 0)
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
    if (mode === 'stamp') {
      placeStamp(p)
      return
    }
    setIsDrawing(true)
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }
  const move = (e) => {
    if (mode === 'stamp') return
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
    // Notify app for confetti/toast
    try {
      window.dispatchEvent(new CustomEvent('doodle-saved'))
    } catch {}
  }

  const placeStamp = ({ x, y }) => {
    const ctx = ctxRef.current
    const fontSize = Math.max(20, size * 6)
    ctx.save()
    ctx.font = `${fontSize}px system-ui, Apple Color Emoji, Segoe UI Emoji`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // soft shadow glow using the selected color
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillText(stamp, x, y)
    ctx.restore()
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="inline-flex rounded-lg overflow-hidden border">
          <button onClick={() => setMode('draw')} className={`px-3 py-1.5 text-sm ${mode === 'draw' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}>Draw</button>
          <button onClick={() => setMode('stamp')} className={`px-3 py-1.5 text-sm ${mode === 'stamp' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}>Stickers</button>
        </div>

        {mode === 'draw' && (
          <>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Color
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" aria-label="Brush color" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Brush
              <input type="range" min="1" max="24" value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-pink-500" aria-label="Brush size" />
              <span className="text-xs text-gray-500">{size}px</span>
            </label>
          </>
        )}

        {mode === 'stamp' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Pick</span>
            {['💖','✨','🌟','👑','🎀','🐱','🌸','🦋'].map((s) => (
              <button key={s} onClick={() => setStamp(s)} className={`h-8 w-8 grid place-items-center rounded-lg border ${stamp === s ? 'bg-pink-100 border-pink-300' : 'bg-white hover:bg-gray-50'}`}>{s}</button>
            ))}
            <label className="flex items-center gap-2 text-sm text-gray-600 ml-2">
              Size
              <input type="range" min="3" max="18" value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-pink-500" aria-label="Sticker size" />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Glow
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" aria-label="Sticker glow color" />
            </label>
          </div>
        )}

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
