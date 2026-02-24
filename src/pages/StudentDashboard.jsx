import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ProjectCard from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { statsAPI, projectsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Star, MessageSquare, Users, Plus, TrendingUp } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="stat-card">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className="text-white" />
                </div>
            </div>
        </div>
    )
}

export default function StudentDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [myProjects, setMyProjects] = useState([])
    const [pendingReviews, setPendingReviews] = useState([])

    useEffect(() => {
        statsAPI.getStudentStats(user?.id).then(r => setStats(r.data))
        projectsAPI.getAll().then(r => {
            setMyProjects(r.data.filter(p => p.authorId === user?.id))
            setPendingReviews(r.data.filter(p => p.authorId !== user?.id && p.reviewCount < p.maxReviews))
        })
    }, [user])

    return (
        <DashboardLayout title={`Hello, ${user?.name?.split(' ')[0]} 🎓`} subtitle="Track your projects, reviews, and collaborations all in one place.">
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={FolderKanban} label="Projects Submitted" value={stats.submitted} color="from-violet-500 to-purple-500" />
                    <StatCard icon={Star} label="Reviews Done" value={stats.reviewsDone} color="from-emerald-500 to-teal-500" />
                    <StatCard icon={MessageSquare} label="Reviews Received" value={stats.reviewsReceived} color="from-blue-500 to-cyan-500" />
                    <StatCard icon={Users} label="Collaborations" value={stats.collaborations} color="from-orange-500 to-amber-500" />
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'Submit Project', icon: Plus, color: 'from-primary-500 to-accent-500', to: '/submit' },
                    { label: 'Peer Review', icon: Star, color: 'from-emerald-500 to-teal-500', to: '/review' },
                    { label: 'Collaborate', icon: Users, color: 'from-blue-500 to-cyan-500', to: '/collaborate' },
                    { label: 'View Feedback', icon: MessageSquare, color: 'from-orange-500 to-amber-500', to: '/feedback' },
                ].map(({ label, icon: Icon, color, to }) => (
                    <button
                        key={label}
                        onClick={() => navigate(to)}
                        className={`p-4 rounded-xl bg-gradient-to-br ${color} text-white font-medium text-sm flex flex-col items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-black/20 active:scale-95`}
                    >
                        <Icon size={20} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Projects */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">My Projects</h2>
                        <button onClick={() => navigate('/submit')} className="text-sm text-primary-400 hover:text-white flex items-center gap-1 transition-colors">
                            <Plus size={14} /> Add new
                        </button>
                    </div>
                    {myProjects.length > 0 ? (
                        <div className="space-y-4">
                            {myProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    ) : (
                        <div className="glass-card p-10 text-center">
                            <FolderKanban size={40} className="text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No projects yet</p>
                            <button onClick={() => navigate('/submit')} className="btn-primary mt-4 text-sm py-2">Submit Your First Project</button>
                        </div>
                    )}
                </div>

                {/* Pending Reviews */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Pending Reviews</h2>
                        <span className="badge-yellow">{pendingReviews.length} to review</span>
                    </div>
                    {pendingReviews.length > 0 ? (
                        <div className="space-y-4">
                            {pendingReviews.slice(0, 3).map(p => (
                                <ProjectCard key={p.id} project={p} showReviewButton onReview={(proj) => navigate(`/review/${proj.id}`)} />
                            ))}
                            {pendingReviews.length > 3 && (
                                <button onClick={() => navigate('/review')} className="w-full glass py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                    View {pendingReviews.length - 3} more projects →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="glass-card p-10 text-center">
                            <Star size={40} className="text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">All reviews completed! 🎉</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
