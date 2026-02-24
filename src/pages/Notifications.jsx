import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNotifications } from '../context/NotificationContext'
import { Bell, Star, MessageSquare, Users, FolderKanban, Info, CheckCheck } from 'lucide-react'

const TYPE_ICONS = {
    review: Star,
    feedback: MessageSquare,
    assignment: FolderKanban,
    collab: Users,
    info: Info,
}

const TYPE_COLORS = {
    review: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/20 text-yellow-400',
    feedback: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20 text-blue-400',
    assignment: 'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-400',
    collab: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400',
    info: 'from-gray-500/20 to-gray-500/10 border-gray-500/20 text-gray-400',
}

export default function Notifications() {
    const { notifications, markAllRead, unreadCount } = useNotifications()

    return (
        <DashboardLayout title="Notifications" subtitle="Stay up-to-date on reviews, feedback, and collaboration invites.">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-gray-400" />
                        <span className="text-sm text-gray-400">{notifications.length} total</span>
                        {unreadCount > 0 && <span className="badge-purple">{unreadCount} unread</span>}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-white transition-colors">
                            <CheckCheck size={14} /> Mark all read
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {notifications.map(n => {
                        const Icon = TYPE_ICONS[n.type] || Info
                        const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.info

                        return (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-r transition-all ${colorClass} ${!n.read ? 'opacity-100' : 'opacity-60'}`}
                            >
                                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon size={17} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                                </div>
                                {!n.read && <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 mt-2" />}
                            </div>
                        )
                    })}
                </div>

                {notifications.length === 0 && (
                    <div className="glass-card p-12 text-center">
                        <Bell size={40} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No notifications yet</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
