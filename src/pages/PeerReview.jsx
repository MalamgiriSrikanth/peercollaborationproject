import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ProjectCard from '../components/ProjectCard'
import FeedbackForm from '../components/FeedbackForm'
import { projectsAPI, reviewsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { ArrowLeft, Star, CheckCircle } from 'lucide-react'

export default function PeerReview() {
    const { user } = useAuth()
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { addNotification } = useNotifications()

    const [projects, setProjects] = useState([])
    const [selected, setSelected] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        projectsAPI.getAll().then(r => {
            const reviewable = r.data.filter(p => p.authorId !== user?.id && p.reviewCount < p.maxReviews)
            setProjects(reviewable)
            if (projectId) {
                const found = r.data.find(p => p.id === Number(projectId))
                if (found) setSelected(found)
            }
        })
    }, [user, projectId])

    const handleReview = async (reviewData) => {
        setLoading(true)
        await reviewsAPI.create({ ...reviewData, projectId: selected.id, reviewerId: user.id, reviewer: user.name })
        addNotification(`You reviewed "${selected.title}"`, 'review')
        setLoading(false)
        setSubmitted(true)
    }

    if (submitted) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                    <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Review Submitted!</h2>
                <p className="text-gray-400 mb-6">Your feedback helps your peer grow. Great job! 🎉</p>
                <div className="flex gap-3">
                    <button onClick={() => { setSelected(null); setSubmitted(false) }} className="btn-primary py-2 px-5 text-sm">Review Another</button>
                    <button onClick={() => navigate('/student')} className="btn-secondary py-2 px-5 text-sm">Back to Dashboard</button>
                </div>
            </div>
        </DashboardLayout>
    )

    if (selected) return (
        <DashboardLayout title="Write Review" subtitle={`Evaluating: ${selected.title}`}>
            <div className="max-w-2xl mx-auto">
                <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back to projects
                </button>

                {/* Project summary */}
                <div className="glass-card p-5 mb-6 border border-primary-500/20">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-500/20">
                            <Star size={18} className="text-primary-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{selected.title}</h3>
                            <p className="text-sm text-gray-400 mt-0.5">By {selected.author}</p>
                            <p className="text-sm text-gray-300 mt-2 leading-relaxed">{selected.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {selected.tags?.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-400">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <FeedbackForm onSubmit={handleReview} loading={loading} />
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout title="Peer Review" subtitle="Select a project to review and provide constructive feedback.">
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map(p => (
                        <ProjectCard key={p.id} project={p} showReviewButton onReview={setSelected} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <Star size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
                    <p className="text-gray-400 text-sm">No projects pending your review right now.</p>
                </div>
            )}
        </DashboardLayout>
    )
}
