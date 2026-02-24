import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reviewsAPI, projectsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Star, MessageSquare, Calendar, TrendingUp, BarChart2 } from 'lucide-react'

function StarDisplay({ value }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={14} className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
            ))}
        </div>
    )
}

const CRITERIA_LABELS = { technical: 'Technical', documentation: 'Docs', creativity: 'Creativity', presentation: 'Presentation' }

export default function Feedback() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [projects, setProjects] = useState([])
    const [tab, setTab] = useState('received')

    useEffect(() => {
        reviewsAPI.getAll().then(r => setReviews(r.data))
        projectsAPI.getAll().then(r => setProjects(r.data))
    }, [])

    const myProjectIds = projects.filter(p => p.authorId === user?.id).map(p => p.id)
    const received = reviews.filter(r => myProjectIds.includes(r.projectId))
    const given = reviews.filter(r => r.reviewerId === user?.id)

    const avgRating = received.length > 0
        ? (received.reduce((s, r) => s + r.rating, 0) / received.length).toFixed(1)
        : '—'

    const displayed = tab === 'received' ? received : given

    return (
        <DashboardLayout title="Feedback Hub" subtitle="Track all peer reviews — received on your projects and given to others.">
            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Reviews Received', value: received.length, icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Reviews Given', value: given.length, icon: Star, color: 'from-emerald-500 to-teal-500' },
                    { label: 'Avg. Rating', value: `${avgRating}★`, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
                    { label: 'Projects Reviewed', value: myProjectIds.length, icon: BarChart2, color: 'from-orange-500 to-amber-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="stat-card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">{label}</p>
                                <p className="text-xl font-bold text-white mt-0.5">{value}</p>
                            </div>
                            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                                <Icon size={16} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab */}
            <div className="flex gap-2 mb-6">
                {['received', 'given'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? 'bg-primary-500/30 text-white border border-primary-500/30' : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {t === 'received' ? `Reviews Received (${received.length})` : `Reviews Given (${given.length})`}
                    </button>
                ))}
            </div>

            {/* Review Cards */}
            {displayed.length > 0 ? (
                <div className="space-y-4">
                    {displayed.map(review => {
                        const project = projects.find(p => p.id === review.projectId)
                        return (
                            <div key={review.id} className="glass-card p-6">
                                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                                    <div>
                                        <p className="font-semibold text-white">{project?.title || 'Unknown Project'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-5 h-5 bg-gradient-to-br from-accent-500 to-primary-500 rounded flex items-center justify-center text-xs font-bold text-white">
                                                {review.reviewer?.charAt(0)}
                                            </div>
                                            <p className="text-sm text-gray-400">{tab === 'received' ? `Reviewed by ${review.reviewer}` : `You reviewed ${project?.author}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StarDisplay value={review.rating} />
                                        <span className="text-sm font-bold text-white">{review.rating}/5</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-300 leading-relaxed mb-4 bg-white/3 p-3 rounded-xl border border-white/5 italic">
                                    "{review.comment}"
                                </p>

                                {review.criteriaScores && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {Object.entries(review.criteriaScores).map(([key, val]) => (
                                            <div key={key} className="bg-white/3 rounded-xl p-3 text-center border border-white/5">
                                                <p className="text-xs text-gray-500 mb-1">{CRITERIA_LABELS[key] || key}</p>
                                                <StarDisplay value={val} />
                                                <p className="text-xs font-semibold text-white mt-1">{val}/5</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                                    <Calendar size={11} />
                                    {review.submittedAt}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <MessageSquare size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No feedback {tab} yet</p>
                </div>
            )}
        </DashboardLayout>
    )
}
