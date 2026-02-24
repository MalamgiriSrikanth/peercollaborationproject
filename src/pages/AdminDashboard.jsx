import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { statsAPI, assignmentsAPI, projectsAPI } from '../services/api'
import {
    Users, FolderKanban, Star, Clock, TrendingUp, Plus, CheckCircle,
    BarChart2, Calendar, BookOpen, Loader2
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, sub }) {
    return (
        <div className="stat-card">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className="text-3xl font-extrabold text-white">{value}</p>
                    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [projects, setProjects] = useState([])
    const [showNewAssignment, setShowNewAssignment] = useState(false)
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '', criteria: '' })
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        statsAPI.getAdminStats().then(r => setStats(r.data))
        assignmentsAPI.getAll().then(r => setAssignments(r.data))
        projectsAPI.getAll().then(r => setProjects(r.data))
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        setCreating(true)
        const criteriaArr = newAssignment.criteria.split(',').map(s => s.trim()).filter(Boolean)
        await assignmentsAPI.create({ ...newAssignment, criteria: criteriaArr, assignedCount: 0 })
        assignmentsAPI.getAll().then(r => setAssignments(r.data))
        statsAPI.getAdminStats().then(r => setStats(r.data))
        setCreating(false)
        setShowNewAssignment(false)
        setNewAssignment({ title: '', description: '', deadline: '', criteria: '' })
    }

    return (
        <DashboardLayout title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`} subtitle="Monitor your class's collaboration and review progress.">
            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="from-blue-500 to-cyan-500" sub="Enrolled this semester" />
                    <StatCard icon={FolderKanban} label="Projects Submitted" value={stats.totalProjects} color="from-violet-500 to-purple-500" sub="All time" />
                    <StatCard icon={Star} label="Reviews Completed" value={stats.totalReviews} color="from-emerald-500 to-teal-500" sub={`Avg rating ${stats.avgRating}★`} />
                    <StatCard icon={Clock} label="Pending Reviews" value={stats.pendingReviews} color="from-orange-500 to-amber-500" sub="Awaiting peer evaluation" />
                    <StatCard icon={TrendingUp} label="Completion Rate" value={`${stats.completionRate}%`} color="from-rose-500 to-pink-500" sub="Review assignments done" />
                    <StatCard icon={BarChart2} label="Active Assignments" value={assignments.length} color="from-indigo-500 to-blue-500" sub="Running this period" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Assignments */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Review Assignments</h2>
                        <button
                            onClick={() => setShowNewAssignment(!showNewAssignment)}
                            className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5"
                        >
                            <Plus size={15} /> New Assignment
                        </button>
                    </div>

                    {showNewAssignment && (
                        <form onSubmit={handleCreate} className="glass-card p-5 space-y-4 animate-slide-up border border-primary-500/20">
                            <h3 className="font-semibold text-white flex items-center gap-2"><BookOpen size={16} className="text-primary-400" /> Create Assignment</h3>
                            <input required placeholder="Assignment title" value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} className="input-field" />
                            <textarea placeholder="Description" rows={2} value={newAssignment.description} onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" />
                            <div className="grid grid-cols-2 gap-3">
                                <input required type="date" value={newAssignment.deadline} onChange={e => setNewAssignment(p => ({ ...p, deadline: e.target.value }))} className="input-field" />
                                <input placeholder="Criteria (comma separated)" value={newAssignment.criteria} onChange={e => setNewAssignment(p => ({ ...p, criteria: e.target.value }))} className="input-field" />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={creating} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                                    {creating ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : <><CheckCircle size={14} /> Create</>}
                                </button>
                                <button type="button" onClick={() => setShowNewAssignment(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                            </div>
                        </form>
                    )}

                    {assignments.map(a => {
                        const progress = a.assignedCount > 0 ? (a.completedCount / a.assignedCount) * 100 : 0
                        return (
                            <div key={a.id} className="glass-card p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-medium text-white text-sm">{a.title}</h3>
                                    <span className="badge-blue flex items-center gap-1 ml-2 flex-shrink-0"><Calendar size={10} /> {a.deadline}</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">{a.description}</p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {a.criteria?.map(c => <span key={c} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400">{c}</span>)}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                    <span>Completion: {a.completedCount}/{a.assignedCount}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Recent Projects */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Recent Submissions</h2>
                    {projects.slice(0, 5).map(p => (
                        <div key={p.id} className="glass-card p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FolderKanban size={16} className="text-primary-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{p.title}</p>
                                    <p className="text-xs text-gray-400">{p.author} • {p.submittedAt}</p>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {p.tags?.slice(0, 2).map(t => <span key={t} className="text-xs px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">{t}</span>)}
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${p.status === 'reviewed' ? 'text-green-400 bg-green-500/10' :
                                                p.status === 'pending_review' ? 'text-yellow-400 bg-yellow-500/10' :
                                                    'text-blue-400 bg-blue-500/10'
                                            }`}>{p.status.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
