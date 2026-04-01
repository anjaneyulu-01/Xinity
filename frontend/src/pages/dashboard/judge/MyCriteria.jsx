import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Edit2, Save, GripVertical, Info } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import toast from 'react-hot-toast'

const DEFAULT_CRITERIA = [
  { id: 'c1', name: 'Innovation',    weight: 20, desc: 'Originality of idea and creative problem-solving approach' },
  { id: 'c2', name: 'Technical',     weight: 20, desc: 'Code quality, architecture, and technical complexity' },
  { id: 'c3', name: 'Design',        weight: 20, desc: 'UI/UX quality, visual appeal, and user experience' },
  { id: 'c4', name: 'Functionality', weight: 20, desc: 'Working features, completeness, and demo quality' },
  { id: 'c5', name: 'Presentation',  weight: 20, desc: 'Pitch clarity, communication, and storytelling' },
]

const TEMPLATES = [
  { label: 'Standard (Balanced)',  criteria: DEFAULT_CRITERIA },
  {
    label: 'Technical Focus',
    criteria: [
      { id: 't1', name: 'Code Quality',   weight: 30, desc: 'Clean, well-structured and documented code' },
      { id: 't2', name: 'Architecture',   weight: 25, desc: 'System design, scalability considerations' },
      { id: 't3', name: 'Innovation',     weight: 20, desc: 'Novel use of technology or unique solution' },
      { id: 't4', name: 'Functionality',  weight: 15, desc: 'Features working as intended' },
      { id: 't5', name: 'Presentation',   weight: 10, desc: 'Demo and pitch delivery' },
    ],
  },
  {
    label: 'Design & UX Focus',
    criteria: [
      { id: 'd1', name: 'Visual Design',  weight: 30, desc: 'Aesthetics, typography, and color system' },
      { id: 'd2', name: 'User Experience',weight: 25, desc: 'Usability, flow, and accessibility' },
      { id: 'd3', name: 'Innovation',     weight: 20, desc: 'Creative concept or interaction pattern' },
      { id: 'd4', name: 'Technical',      weight: 15, desc: 'Implementation quality' },
      { id: 'd5', name: 'Presentation',   weight: 10, desc: 'Pitching and storytelling' },
    ],
  },
]

export default function MyCriteria() {
  const { dark } = useTheme()
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [editId, setEditId]     = useState(null)
  const [editBuf, setEditBuf]   = useState({})
  const [newRow, setNewRow]     = useState(false)
  const [newBuf, setNewBuf]     = useState({ name: '', weight: 10, desc: '' })

  const border = dark ? 'border-[#1e3a5f]' : 'border-gray-200'
  const text   = dark ? 'text-white'        : 'text-gray-900'
  const sub    = dark ? 'text-[#94a3b8]'    : 'text-gray-500'
  const input  = `px-3 py-1.5 rounded-lg border text-sm outline-none transition-all ${dark ? 'bg-white/5 border-[#1e3a5f] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`

  const total = criteria.reduce((a, c) => a + c.weight, 0)
  const totalColor = total === 100 ? '#00e676' : '#ff4081'

  const startEdit = (c) => { setEditId(c.id); setEditBuf({ ...c }) }
  const saveEdit  = () => {
    if (!editBuf.name) { toast.error('Name required'); return }
    setCriteria(cs => cs.map(c => c.id === editId ? { ...editBuf } : c))
    setEditId(null)
    toast.success('Criterion updated')
  }
  const deleteRow = (id) => setCriteria(cs => cs.filter(c => c.id !== id))
  const addRow    = () => {
    if (!newBuf.name) { toast.error('Name required'); return }
    setCriteria(cs => [...cs, { ...newBuf, id: `c${Date.now()}`, weight: Number(newBuf.weight) }])
    setNewRow(false)
    setNewBuf({ name: '', weight: 10, desc: '' })
    toast.success('Criterion added')
  }
  const applyTemplate = (tpl) => {
    setCriteria(tpl.criteria)
    toast.success(`Template "${tpl.label}" applied`)
  }
  const save = () => {
    if (total !== 100) { toast.error(`Weights must sum to 100 (currently ${total})`); return }
    toast.success('Scoring criteria saved!')
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`font-heading font-bold text-2xl ${text}`}>My Scoring Criteria</h1>
          <p className={`text-sm mt-1 ${sub}`}>Define how you evaluate submissions. Weights must total 100.</p>
        </div>
        <button onClick={save} className="btn-primary text-sm py-2 px-5">
          <Save size={14} /> Save Criteria
        </button>
      </div>

      {/* Templates */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`glass-card border ${border} p-5`}>
        <p className={`text-xs font-semibold mb-3 ${sub}`}>QUICK TEMPLATES</p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(tpl => (
            <button key={tpl.label} onClick={() => applyTemplate(tpl)}
              className={`text-sm py-2 px-4 rounded-xl border transition-all ${dark ? 'border-[#1e3a5f] text-[#94a3b8] hover:border-[#00e5ff]/40 hover:text-[#00e5ff]' : 'border-gray-200 text-gray-600 hover:border-[#0066ff]/40 hover:text-[#0066ff]'}`}>
              {tpl.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Weight total indicator */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${total === 100 ? 'border-[#00e676]/30 bg-[#00e676]/5' : 'border-[#ff4081]/30 bg-[#ff4081]/5'}`}>
        <Info size={14} style={{ color: totalColor }} />
        <span className="text-sm font-medium" style={{ color: totalColor }}>
          Total weight: <strong>{total}/100</strong>
          {total !== 100 && ` — ${total < 100 ? `add ${100 - total} more` : `reduce by ${total - 100}`}`}
        </span>
      </div>

      {/* Criteria table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`glass-card border ${border} overflow-hidden`}>
        <div className={`grid grid-cols-[auto_1fr_80px_1fr_auto] gap-0 text-xs font-semibold px-4 py-3 border-b ${border} ${sub}`}>
          <span className="w-6" />
          <span>CRITERION</span>
          <span className="text-center">WEIGHT</span>
          <span className="pl-3">DESCRIPTION</span>
          <span className="w-16 text-center">ACTIONS</span>
        </div>

        {criteria.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            className={`grid grid-cols-[auto_1fr_80px_1fr_auto] gap-0 items-center px-4 py-3 border-b ${border} last:border-b-0`}>
            <GripVertical size={14} className={`mr-2 cursor-grab ${sub}`} />

            {editId === c.id ? (
              <>
                <input value={editBuf.name} onChange={e => setEditBuf(b => ({ ...b, name: e.target.value }))} className={`${input} mr-2`} />
                <input type="number" min={1} max={100} value={editBuf.weight}
                  onChange={e => setEditBuf(b => ({ ...b, weight: Number(e.target.value) }))}
                  className={`${input} text-center w-16`} />
                <input value={editBuf.desc} onChange={e => setEditBuf(b => ({ ...b, desc: e.target.value }))} className={`${input} ml-3`} />
                <div className="flex gap-1 ml-2">
                  <button onClick={saveEdit} className="text-[#00e676] hover:opacity-80 p-1"><Save size={14} /></button>
                  <button onClick={() => setEditId(null)} className={`${sub} hover:opacity-80 p-1`}><Trash2 size={14} /></button>
                </div>
              </>
            ) : (
              <>
                <span className={`font-semibold text-sm ${text} mr-2`}>{c.name}</span>
                <span className="font-code text-center text-sm" style={{ color: c.weight >= 25 ? '#ffd600' : c.weight >= 15 ? '#00e5ff' : '#94a3b8' }}>{c.weight}%</span>
                <span className={`text-xs pl-3 ${sub}`}>{c.desc}</span>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => startEdit(c)} className={`${sub} hover:text-[#00e5ff] p-1 transition-colors`}><Edit2 size={13} /></button>
                  <button onClick={() => deleteRow(c.id)} className={`${sub} hover:text-[#ff4081] p-1 transition-colors`}><Trash2 size={13} /></button>
                </div>
              </>
            )}
          </motion.div>
        ))}

        {/* Add new row */}
        {newRow ? (
          <div className={`grid grid-cols-[auto_1fr_80px_1fr_auto] gap-0 items-center px-4 py-3 border-t ${border}`}>
            <GripVertical size={14} className={`mr-2 opacity-0`} />
            <input placeholder="Criterion name" value={newBuf.name} onChange={e => setNewBuf(b => ({ ...b, name: e.target.value }))} className={`${input} mr-2`} />
            <input type="number" min={1} max={100} placeholder="10" value={newBuf.weight} onChange={e => setNewBuf(b => ({ ...b, weight: e.target.value }))} className={`${input} text-center w-16`} />
            <input placeholder="Description…" value={newBuf.desc} onChange={e => setNewBuf(b => ({ ...b, desc: e.target.value }))} className={`${input} ml-3`} />
            <div className="flex gap-1 ml-2">
              <button onClick={addRow} className="text-[#00e676] hover:opacity-80 p-1"><Save size={14} /></button>
              <button onClick={() => setNewRow(false)} className={`${sub} hover:opacity-80 p-1`}><Trash2 size={14} /></button>
            </div>
          </div>
        ) : (
          <button onClick={() => setNewRow(true)}
            className={`w-full flex items-center justify-center gap-2 py-3 text-sm border-t transition-all ${border} ${dark ? 'text-[#94a3b8] hover:text-[#00e5ff]' : 'text-gray-500 hover:text-[#0066ff]'}`}>
            <Plus size={14} /> Add Criterion
          </button>
        )}
      </motion.div>

      {/* Visual weight breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`glass-card border ${border} p-5`}>
        <p className={`text-xs font-semibold mb-3 ${sub}`}>WEIGHT DISTRIBUTION</p>
        <div className="flex h-6 rounded-full overflow-hidden gap-px">
          {criteria.map((c, i) => {
            const colors = ['#00e5ff', '#7c4dff', '#00e676', '#ffd600', '#ff4081', '#f97316']
            return (
              <div key={c.id} className="flex items-center justify-center transition-all"
                style={{ width: `${c.weight}%`, background: colors[i % colors.length] }}>
                {c.weight >= 10 && <span className="text-[10px] font-bold text-black">{c.weight}%</span>}
              </div>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {criteria.map((c, i) => {
            const colors = ['#00e5ff', '#7c4dff', '#00e676', '#ffd600', '#ff4081', '#f97316']
            return (
              <div key={c.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
                <span className={`text-xs ${sub}`}>{c.name}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
