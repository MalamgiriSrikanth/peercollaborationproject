import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const { login, loading, error, setError } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(email, password)
        if (result.success) navigate(result.role === 'admin' ? '/admin' : '/student')
    }

    const fillDemo = (type) => {
        setError('')
        if (type === 'admin') { setEmail('admin@univ.edu'); setPassword('admin123') }
        else { setEmail('alex@student.edu'); setPassword('student123') }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(79,70,229,0.25) 0%, transparent 55%), #0f0f1a' }}>
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/30">
                        <Star size={26} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-1">Sign in to PeerCollab</p>
                </div>

                {/* Demo Quick Fill */}
                <div className="glass-card p-4 mb-6">
                    <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider text-center">Quick Login (Demo)</p>
                    <div className="flex gap-2">
                        <button onClick={() => fillDemo('admin')} className="flex-1 glass py-2 rounded-xl text-sm text-center hover:bg-white/10 transition-all text-purple-300 font-medium border border-purple-500/20">
                            👨‍🏫 Admin
                        </button>
                        <button onClick={() => fillDemo('student')} className="flex-1 glass py-2 rounded-xl text-sm text-center hover:bg-white/10 transition-all text-blue-300 font-medium border border-blue-500/20">
                            🎓 Student
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="you@university.edu"
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="input-field pl-10 pr-10"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            <AlertCircle size={15} /> {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none">
                        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing In...</> : 'Sign In'}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        No account yet?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-white font-medium transition-colors">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
