import React from 'react'
import Navbar from './Navbar'

export default function DashboardLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(79,70,229,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.10) 0%, transparent 60%), #0f0f1a' }}>
            <Navbar />
            <main className="pt-16">
                {(title || subtitle) && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-0">
                        {title && (
                            <div className="animate-slide-up">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
                                {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
                            </div>
                        )}
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
