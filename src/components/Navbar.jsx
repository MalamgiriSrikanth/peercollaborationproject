import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import {
    Bell, LogOut, Menu, X, LayoutDashboard, FolderKanban,
    MessageSquare, Users, Star, Home, ChevronDown
} from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { unreadCount } = useNotifications()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navLinks = user?.role === 'admin'
        ? [{ to: '/admin', icon: LayoutDashboard, label: 'Dashboard' }]
        : [
            { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/submit', icon: FolderKanban, label: 'Submit Project' },
            { to: '/review', icon: Star, label: 'Peer Review' },
            { to: '/collaborate', icon: Users, label: 'Collaborate' },
            { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
        ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/'} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                            <Star size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg gradient-text">PeerCollab</span>
                    </Link>

                    {/* Desktop Nav */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ to, icon: Icon, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                            ? 'bg-primary-500/20 text-white border border-primary-500/30'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Notifications */}
                                <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                                    <Bell size={20} className="text-gray-300" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="w-7 h-7 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                                            {user.avatar}
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-gray-200">{user.name.split(' ')[0]}</span>
                                        <span className="hidden sm:block badge-purple text-xs px-1.5 py-0.5">{user.role}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50">
                                            <div className="px-4 py-2 border-b border-white/10">
                                                <p className="text-sm font-semibold text-white">{user.name}</p>
                                                <p className="text-xs text-gray-400">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut size={14} />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu */}
                        {user && (
                            <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {user && menuOpen && (
                    <div className="md:hidden py-3 border-t border-white/10 animate-fade-in">
                        {navLinks.map(({ to, icon: Icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${isActive(to) ? 'bg-primary-500/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Backdrop for profile */}
            {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
        </nav>
    )
}
