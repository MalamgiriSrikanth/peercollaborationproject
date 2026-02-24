import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { projectsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Tag, FileText, CheckCircle, Plus, Trash2, Upload } from 'lucide-react'

const AVAILABLE_TAGS = ['Python', 'JavaScript', 'React', 'Node.js', 'ML/AI', 'Data Science', 'Mobile', 'Web', 'Blockchain', 'Cloud', 'DevOps', 'UI/UX', 'Database', 'Security', 'IoT']

export default function ProjectSubmission() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: '', description: '', tags: [], status: 'submitted' })
    const [docs, setDocs] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const toggleTag = (tag) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : prev.tags.length < 5 ? [...prev.tags, tag] : prev.tags
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.tags.length === 0) return
        setSubmitting(true)
        await projectsAPI.create({ ...form, author: user.name, authorId: user.id })
        setSubmitting(false)
        setSuccess(true)
        setTimeout(() => navigate('/student'), 2000)
    }

    if (success) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                    <CheckCircle size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Project Submitted!</h2>
                <p className="text-gray-400">Redirecting to your dashboard...</p>
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout title="Submit Project" subtitle="Share your work with the class for peer review and feedback.">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-semibold text-white flex items-center gap-2"><FolderKanban size={16} className="text-primary-400" /> Project Details</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                            <input
                                required
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g., Machine Learning Classifier with SVM"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                            <textarea
                                required
                                rows={5}
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="Describe your project: what it does, technologies used, challenges overcome, and outcomes achieved..."
                                className="input-field resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">{form.description.length} characters</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><Tag size={16} className="text-accent-400" /> Technology Tags <span className="text-sm text-gray-500 font-normal">({form.tags.length}/5 selected)</span></h3>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${form.tags.includes(tag)
                                            ? 'bg-primary-500/30 border-primary-500/50 text-white'
                                            : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200 bg-white/3'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {form.tags.length === 0 && <p className="text-xs text-red-400 mt-2">Please select at least one tag</p>}
                    </div>

                    {/* Docs */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><FileText size={16} className="text-blue-400" /> Supporting Documents</h3>
                        <div
                            onClick={() => document.getElementById('file-input').click()}
                            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/40 hover:bg-primary-500/5 transition-all"
                        >
                            <Upload size={32} className="text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Drag & drop files or click to browse</p>
                            <p className="text-xs text-gray-600 mt-1">PDF, images, ZIP archives (mock — for demo)</p>
                        </div>
                        <input id="file-input" type="file" multiple className="hidden"
                            onChange={e => setDocs(prev => [...prev, ...Array.from(e.target.files).map(f => f.name)])} />
                        {docs.length > 0 && (
                            <div className="mt-3 space-y-1">
                                {docs.map((name, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                                        <span className="text-sm text-gray-300">{name}</span>
                                        <button type="button" onClick={() => setDocs(d => d.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || form.tags.length === 0}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-50 disabled:transform-none"
                    >
                        {submitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <><FolderKanban size={18} /> Submit Project for Review</>}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}
