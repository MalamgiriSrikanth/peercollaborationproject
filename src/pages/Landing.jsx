import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Users, MessageSquare, FolderKanban, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'

const FEATURES = [
    { icon: FolderKanban, title: 'Project Submission', desc: 'Upload and showcase your projects with rich metadata, tags, and descriptions.', color: 'from-blue-500 to-cyan-500' },
    { icon: Star, title: 'Peer Review', desc: 'Give and receive structured feedback with multi-criteria star ratings.', color: 'from-violet-500 to-purple-500' },
    { icon: Users, title: 'Live Collaboration', desc: 'Real-time workspace for team brainstorming and document co-editing.', color: 'from-emerald-500 to-teal-500' },
    { icon: MessageSquare, title: 'Feedback Loop', desc: 'Track all reviews and feedback received in one unified view.', color: 'from-orange-500 to-amber-500' },
    { icon: Shield, title: 'Admin Control', desc: 'Teachers set assignments, monitor progress, and evaluate outcomes.', color: 'from-rose-500 to-pink-500' },
    { icon: Zap, title: 'Instant Notifications', desc: 'Stay updated on reviews, comments, assignments, and collaboration invites.', color: 'from-indigo-500 to-blue-500' },
]

const STATS = [
    { label: 'Active Students', value: '2,400+' },
    { label: 'Projects Reviewed', value: '18,000+' },
    { label: 'Avg. Rating Given', value: '4.7 ★' },
    { label: 'Institutions', value: '120+' },
]

const DEMO_CREDENTIALS = [
    { role: 'Admin (Teacher)', email: 'admin@univ.edu', pass: 'admin123', badge: 'badge-purple' },
    { role: 'Student', email: 'alex@student.edu', pass: 'student123', badge: 'badge-blue' },
]

export default function Landing() {
    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(79,70,229,0.2) 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.15) 0%, transparent 50%), #0f0f1a' }}>
            <Navbar />

            {/* Hero */}
            <section className="pt-32 pb-20 px-4 sm:px-6 text-center">
                <div className="max-w-4xl mx-auto animate-slide-up">
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-300">Academic Collaboration Platform — FSAD-PS26</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
                        Learn Better Through
                        <span className="block gradient-text mt-1">Peer Review & Collaboration</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        PeerCollab empowers students to grow by reviewing each other's work, collaborating in real-time, and receiving structured constructive feedback from their academic peers.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                            Start for Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-8 py-3.5">
                            Sign In
                        </Link>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-10 inline-flex flex-col sm:flex-row gap-4 glass px-6 py-4 rounded-2xl border border-white/10">
                        <p className="text-xs text-gray-400 mb-2 sm:mb-0 sm:self-center font-semibold uppercase tracking-wider">Demo Accounts:</p>
                        {DEMO_CREDENTIALS.map(c => (
                            <div key={c.role} className="text-left">
                                <span className={`${c.badge} text-xs mb-1 inline-block`}>{c.role}</span>
                                <p className="text-xs text-gray-300">{c.email} / <span className="text-gray-500">{c.pass}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {STATS.map(({ label, value }) => (
                        <div key={label} className="glass-card p-5 text-center">
                            <div className="text-2xl font-extrabold gradient-text">{value}</div>
                            <div className="text-xs text-gray-400 mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Everything You Need to Excel</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">A complete academic toolkit for peer evaluation, collaboration, and continuous learning.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="glass-card p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center mb-14">
                    <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
                    <p className="text-gray-400">Three simple steps to collaborative growth</p>
                </div>
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: 'Submit Your Project', desc: 'Upload your project with documentation, tags, and a description for your peers to discover.' },
                        { step: '02', title: 'Review & Collaborate', desc: 'Get assigned peers\' projects to review and rate across multiple criteria with actionable feedback.' },
                        { step: '03', title: 'Grow Together', desc: 'Track your reviews received, improve through feedback, and collaborate in real-time workspaces.' },
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="glass-card p-6 relative">
                            <div className="text-5xl font-black gradient-text opacity-30 mb-3">{step}</div>
                            <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                            <p className="text-sm text-gray-400">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto glass-card p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(139,92,246,0.2))' }}>
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Learn Through Peers?</h2>
                    <p className="text-gray-400 mb-8">Join thousands of students who are accelerating their learning through structured peer review.</p>
                    <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5">
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 px-6 text-center text-sm text-gray-500">
                <p>© 2024 PeerCollab — FSAD-PS26 Academic Submission | Built with React + Vite + Tailwind CSS</p>
            </footer>
        </div>
    )
}
