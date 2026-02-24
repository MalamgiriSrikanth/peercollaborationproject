import React from 'react'
import { Tag, Clock, User, Star, ArrowRight, CheckCircle, AlertCircle, Clock3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATUS_MAP = {
    pending_review: { label: 'Pending Review', class: 'badge-yellow', icon: Clock3 },
    reviewed: { label: 'Reviewed', class: 'badge-green', icon: CheckCircle },
    in_progress: { label: 'In Progress', class: 'badge-blue', icon: Clock3 },
    submitted: { label: 'Submitted', class: 'badge-purple', icon: AlertCircle },
}

export default function ProjectCard({ project, onReview, showReviewButton = false }) {
    const navigate = useNavigate()
    const status = STATUS_MAP[project.status] || STATUS_MAP.submitted
    const StatusIcon = status.icon

    const reviewProgress = (project.reviewCount / project.maxReviews) * 100

    return (
        <div className="glass-card p-5 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] cursor-pointer"
            onClick={() => !showReviewButton && navigate(`/feedback`)}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base leading-tight truncate group-hover:gradient-text transition-all">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <User size={12} className="text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-400">{project.author}</span>
                    </div>
                </div>
                <span className={`${status.class} flex items-center gap-1 ml-2 flex-shrink-0`}>
                    <StatusIcon size={10} />
                    {status.label}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
                {project.description}
            </p>

            {/* Tags */}
            {project.tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-gray-300">
                            <Tag size={9} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Review Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="flex items-center gap-1"><Star size={10} /> Reviews</span>
                    <span>{project.reviewCount}/{project.maxReviews}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                        style={{ width: `${reviewProgress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={11} />
                    {project.submittedAt}
                </div>
                {showReviewButton && project.reviewCount < project.maxReviews && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onReview?.(project) }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-white bg-primary-500/10 hover:bg-primary-500/30 px-3 py-1.5 rounded-lg transition-all border border-primary-500/20"
                    >
                        Review <ArrowRight size={12} />
                    </button>
                )}
                {project.reviewCount >= project.maxReviews && (
                    <span className="text-xs text-green-400 font-medium flex items-center gap-1"><CheckCircle size={11} /> Complete</span>
                )}
            </div>
        </div>
    )
}
