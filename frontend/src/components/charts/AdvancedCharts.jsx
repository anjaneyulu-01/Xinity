import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Minus, Info, Maximize2, Download,
  ArrowUpRight, ArrowDownRight, Zap, Users, FileText, Award,
  BarChart2, PieChart, Activity, Target, Clock, Star
} from 'lucide-react'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED METRIC CARD — Single KPI display with trend
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel = 'vs last period',
  icon: Icon = Activity,
  color = '#00e5ff',
  trend = [], // Array of numbers for sparkline
  dark = true,
  size = 'default', // 'compact' | 'default' | 'large'
  onClick
}) {
  const isPositive = change > 0
  const isNeutral = change === 0
  
  const sizeClasses = {
    compact: 'p-4',
    default: 'p-5',
    large: 'p-6',
  }
  
  const valueSizes = {
    compact: 'text-2xl',
    default: 'text-3xl',
    large: 'text-4xl',
  }
  
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: `0 8px 30px ${color}15` }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-all ${sizeClasses[size]} ${
        dark 
          ? 'bg-[#080d1a] border-[#1e3a5f] hover:border-white/20' 
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl"
        style={{ background: color }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          
          {/* Trend badge */}
          {!isNeutral && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                isPositive 
                  ? 'bg-[#00e676]/10 text-[#00e676]' 
                  : 'bg-[#ff4081]/10 text-[#ff4081]'
              }`}
            >
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(change)}%
            </motion.div>
          )}
        </div>
        
        {/* Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-heading font-black ${valueSizes[size]} ${
            dark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.div>
        
        {/* Title */}
        <p className={`text-sm mt-1 ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
          {title}
        </p>
        
        {/* Change label */}
        {change !== undefined && changeLabel && (
          <p className={`text-xs mt-2 ${dark ? 'text-[#94a3b8]/60' : 'text-gray-400'}`}>
            <span className={isPositive ? 'text-[#00e676]' : isNeutral ? '' : 'text-[#ff4081]'}>
              {isPositive ? '+' : ''}{change}%
            </span>{' '}
            {changeLabel}
          </p>
        )}
        
        {/* Sparkline */}
        {trend.length > 0 && (
          <div className="mt-4 h-12">
            <Sparkline data={trend} color={color} dark={dark} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPARKLINE — Mini trend chart
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Sparkline({ data, color = '#00e5ff', dark = true, height = 48 }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(null)
  
  const { min, max, points, pathD, areaD } = useMemo(() => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const padding = 4
    const width = 100
    
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * (width - padding * 2) + padding,
      y: height - ((v - min) / range) * (height - padding * 2) - padding,
      value: v,
    }))
    
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    
    return { min, max, points, pathD, areaD }
  }, [data, height])
  
  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoverIndex(null) }}
    >
      <svg 
        viewBox={`0 0 100 ${height}`} 
        className="w-full h-full" 
        preserveAspectRatio="none"
      >
        {/* Area fill */}
        <motion.path
          d={areaD}
          fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Hover dot */}
        {isHovered && hoverIndex !== null && (
          <motion.circle
            cx={points[hoverIndex].x}
            cy={points[hoverIndex].y}
            r="4"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </svg>
      
      {/* Invisible hover zones */}
      {isHovered && (
        <div className="absolute inset-0 flex">
          {points.map((p, i) => (
            <div
              key={i}
              className="flex-1 h-full"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
        </div>
      )}
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && hoverIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute pointer-events-none px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              left: `${(points[hoverIndex].x / 100) * 100}%`,
              top: `${(points[hoverIndex].y / height) * 100}%`,
              transform: 'translate(-50%, -120%)',
              background: dark ? '#1e3a5f' : '#374151',
              color: 'white',
            }}
          >
            {points[hoverIndex].value}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED BAR CHART — Horizontal or vertical bars
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function BarChart({ 
  data, // [{ label, value, color? }]
  horizontal = true,
  showValues = true,
  dark = true,
  height = 200,
  animated = true
}) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  if (horizontal) {
    return (
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                {item.label}
              </span>
              {showValues && (
                <span className={`text-sm font-heading font-bold ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                  {item.value}
                </span>
              )}
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <motion.div
                className="h-full rounded-full"
                initial={animated ? { width: 0 } : false}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                style={{ 
                  background: item.color || `linear-gradient(90deg, #00e5ff, #7c4dff)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Vertical bars
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            className="w-full rounded-t-lg"
            initial={animated ? { height: 0 } : false}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            style={{ 
              background: item.color || `linear-gradient(180deg, #00e5ff, #7c4dff)`,
              minHeight: 4,
            }}
          />
          {showValues && (
            <span className={`text-xs font-medium ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DONUT CHART — Circular progress/distribution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DonutChart({
  data, // [{ label, value, color }]
  size = 160,
  strokeWidth = 20,
  dark = true,
  showLegend = true,
  centerLabel,
  centerValue
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  
  let currentOffset = 0
  const segments = data.map(item => {
    const percentage = item.value / total
    const length = circumference * percentage
    const offset = currentOffset
    currentOffset += length
    return { ...item, percentage, length, offset }
  })
  
  return (
    <div className="flex items-center gap-6">
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth={strokeWidth}
          />
          
          {/* Segments */}
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
              initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
              animate={{ opacity: 1, strokeDasharray: `${seg.length} ${circumference - seg.length}` }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}
        </svg>
        
        {/* Center label */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <span className={`font-heading font-black text-2xl ${dark ? 'text-white' : 'text-gray-900'}`}>
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-col gap-2">
          {segments.map(seg => (
            <div key={seg.label} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: seg.color }}
              />
              <span className={`text-sm ${dark ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                {seg.label}
              </span>
              <span className={`text-sm font-semibold ml-auto ${dark ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(seg.percentage * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROGRESS RING — Circular progress indicator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color = '#00e5ff',
  dark = true,
  label,
  showPercentage = true
}) {
  const percentage = Math.min(value / max, 1)
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - percentage)
  
  const getColor = () => {
    if (percentage >= 0.8) return '#00e676'
    if (percentage >= 0.6) return '#00e5ff'
    if (percentage >= 0.4) return '#ffd600'
    return '#ff4081'
  }
  
  const actualColor = color === 'auto' ? getColor() : color
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={actualColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${actualColor}50)` }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`font-heading font-black text-2xl ${dark ? 'text-white' : 'text-gray-900'}`}
          >
            {Math.round(percentage * 100)}%
          </motion.span>
        )}
        {label && (
          <span className={`text-xs ${dark ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKILL RADAR — Multi-axis skill visualization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SkillRadar({
  skills, // [{ name, value, max }]
  size = 200,
  color = '#00e5ff',
  dark = true
}) {
  const center = size / 2
  const maxRadius = size / 2 - 30
  const levels = 5
  const angleStep = (2 * Math.PI) / skills.length
  
  // Calculate polygon points
  const getPoint = (index, value, max) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (value / max) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }
  
  const polygonPoints = skills
    .map((skill, i) => getPoint(i, skill.value, skill.max || 10))
    .map(p => `${p.x},${p.y}`)
    .join(' ')
  
  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Grid circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {skills.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          const x2 = center + maxRadius * Math.cos(angle)
          const y2 = center + maxRadius * Math.sin(angle)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              strokeWidth="1"
            />
          )
        })}
        
        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill={`${color}20`}
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />
        
        {/* Data points */}
        {skills.map((skill, i) => {
          const point = getPoint(i, skill.value, skill.max || 10)
          return (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          )
        })}
        
        {/* Labels */}
        {skills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2
          const labelRadius = maxRadius + 18
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-medium ${dark ? 'fill-[#94a3b8]' : 'fill-gray-500'}`}
            >
              {skill.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// METRICS GRID — Grid of stats
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function MetricsGrid({ metrics, dark = true, columns = 4 }) {
  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} dark={dark} size="compact" />
      ))}
    </div>
  )
}

export default MetricCard
