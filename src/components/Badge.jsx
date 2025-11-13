export default function Badge({ color = 'pink', children }) {
  const map = {
    pink: 'bg-pink-50 text-pink-700 border-pink-100',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
  }
  return (
    <span className={`px-3 py-1 text-xs rounded-full border ${map[color] || map.pink}`}>
      {children}
    </span>
  )
}
