import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, Mail, Lock, User, AlertCircle, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react'

export default function Register() {
    const { register, loading, error, setError } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' })
    const [showPass, setShowPass] = useState(false)

    const set = (field) => (e) => { setError(''); setForm(prev => ({ ...prev, [field]: e.target.value })) }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirm) { setError('Passwords do not match'); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
        const result = await register(form.name, form.email, form.password, form.role)
        if (result.success) navigate(result.role === 'admin' ? '/admin' : '/student')
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.2) 0%, transparent 55%), #0f0f1a' }}>
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl mb-4 shadow-lg shadow-accent-500/30">
                        <Star size={26} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Join PeerCollab</h1>
                    <p className="text-gray-400 mt-1">Create your academic profile</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">I am a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Submit & review projects' },
                                { value: 'admin', label: 'Teacher', icon: BookOpen, desc: 'Set up & monitor reviews' },
                            ].map(({ value, label, icon: Icon, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, role: value }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${form.role === value
                                            ? 'border-primary-500 bg-primary-500/20 text-white'
                                            : 'border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={20} className={form.role === value ? 'text-primary-400 mb-1' : 'text-gray-500 mb-1'} />
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-xs opacity-70">{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" value={form.name} onChange={set('name')} required placeholder="John Doe" className="input-field pl-10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="email" value={form.email} onChange={set('email')} required placeholder="you@university.edu" className="input-field pl-10" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.password}
                                onChange={set('password')}
                                required
                                placeholder="Min. 6 characters"
                                className="input-field pl-10 pr-10"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="Repeat password" className="input-field pl-10" />
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
                        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</> : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-white font-medium transition-colors">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
