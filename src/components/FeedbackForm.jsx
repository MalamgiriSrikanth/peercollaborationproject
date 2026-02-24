import React, { useState } from 'react'
import { Star, Send, AlertCircle } from 'lucide-react'

const CRITERIA = [
    { key: 'technical', label: 'Technical Depth', desc: 'Complexity, correctness, and use of appropriate technologies' },
    { key: 'documentation', label: 'Documentation', desc: 'Code comments, README, and overall clarity' },
    { key: 'creativity', label: 'Creativity & Innovation', desc: 'Originality and uniqueness of the approach' },
    { key: 'presentation', label: 'Presentation', desc: 'Project demo, UI/UX quality, and visual appeal' },
]

function StarRating({ value, onChange, disabled }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onChange(n)}
                    onMouseEnter={() => !disabled && setHovered(n)}
                    onMouseLeave={() => !disabled && setHovered(0)}
                    className={`transition-all duration-150 ${disabled ? 'cursor-default' : 'hover:scale-125 cursor-pointer'}`}
                >
                    <Star
                        size={20}
                        className={n <= (hovered || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                    />
                </button>
            ))}
        </div>
    )
}

export default function FeedbackForm({ onSubmit, loading = false }) {
    const [ratings, setRatings] = useState({ technical: 0, documentation: 0, creativity: 0, presentation: 0 })
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')

    const overallRating = Math.round(Object.values(ratings).reduce((s, v) => s + v, 0) / CRITERIA.length) || 0

    const handleSubmit = (e) => {
        e.preventDefault()
        const incomplete = CRITERIA.filter(c => !ratings[c.key])
        if (incomplete.length > 0) {
            setError(`Please rate all criteria: ${incomplete.map(c => c.label).join(', ')}`)
            return
        }
        if (comment.trim().length < 30) {
            setError('Please provide a detailed comment (at least 30 characters)')
            return
        }
        setError('')
        onSubmit?.({ criteriaScores: ratings, rating: overallRating, comment: comment.trim() })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                    <Star size={18} className="text-yellow-400" />
                    Evaluation Criteria
                </h3>
                <div className="space-y-5">
                    {CRITERIA.map(({ key, label, desc }) => (
                        <div key={key} className="flex items-start justify-between gap-4 p-4 bg-white/3 rounded-xl border border-white/5">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                            </div>
                            <StarRating
                                value={ratings[key]}
                                onChange={(val) => setRatings(prev => ({ ...prev, [key]: val }))}
                                disabled={loading}
                            />
                        </div>
                    ))}
                </div>

                {/* Overall */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Overall Rating</span>
                    <div className="flex items-center gap-2">
                        <StarRating value={overallRating} onChange={() => { }} disabled />
                        <span className="text-lg font-bold text-white">{overallRating > 0 ? overallRating.toFixed(1) : '—'}</span>
                    </div>
                </div>
            </div>

            {/* Comment */}
            <div className="glass-card p-6">
                <label className="block text-sm font-medium text-white mb-3">Detailed Feedback</label>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    disabled={loading}
                    rows={5}
                    placeholder="Provide constructive feedback. Mention what was done well, areas for improvement, and specific suggestions..."
                    className="input-field resize-none"
                />
                <div className="flex justify-between mt-2">
                    <span className={`text-xs ${comment.length < 30 ? 'text-gray-500' : 'text-green-400'}`}>
                        {comment.length} / 30 minimum characters
                    </span>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Submitting Review...</>
                ) : (
                    <><Send size={16} /> Submit Peer Review</>
                )}
            </button>
        </form>
    )
}
