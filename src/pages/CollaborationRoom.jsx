import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { collabAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { Users, Send, MessageSquare, Hash, Code, FileText, PlusCircle } from 'lucide-react'

const MOCK_MESSAGES = {
    1: [
        { id: 1, user: 'Priya Patel', avatar: 'PP', text: 'Hey team! I started on the data preprocessing pipeline.', time: '10:23 AM' },
        { id: 2, user: 'Omar Hassan', avatar: 'OH', text: 'Nice! I\'ll handle the model training part then.', time: '10:25 AM' },
        { id: 3, user: 'Alex Johnson', avatar: 'AJ', text: 'I can set up the evaluation metrics and visualization.', time: '10:28 AM' },
        { id: 4, user: 'Priya Patel', avatar: 'PP', text: 'Perfect! Let\'s sync up tonight at 8 PM.', time: '10:30 AM' },
    ],
    2: [
        { id: 1, user: 'Omar Hassan', avatar: 'OH', text: 'Should we go with Next.js or plain React?', time: '2:15 PM' },
        { id: 2, user: 'Alex Johnson', avatar: 'AJ', text: 'Let\'s use Vite + React for simplicity. Faster build times.', time: '2:17 PM' },
    ],
}

export default function CollaborationRoom() {
    const { user } = useAuth()
    const { addNotification } = useNotifications()
    const [collabs, setCollabs] = useState([])
    const [selected, setSelected] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [activeTab, setActiveTab] = useState('chat')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        collabAPI.getAll().then(r => { setCollabs(r.data); if (r.data.length) setSelected(r.data[0]) })
    }, [])

    useEffect(() => {
        if (selected) setMessages(MOCK_MESSAGES[selected.id] || [])
    }, [selected])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        const msg = { id: Date.now(), user: user.name, avatar: user.avatar, text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        setMessages(prev => [...prev, msg])
        setInput('')
        addNotification(`You sent a message in "${selected.name}"`, 'collab')
    }

    return (
        <DashboardLayout title="Collaboration Workspace" subtitle="Real-time team communication and document collaboration.">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-[70vh] min-h-[500px]">
                {/* Sidebar — Rooms */}
                <div className="lg:col-span-1 glass-card p-4 flex flex-col gap-2 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-white">Workspaces</h3>
                        <button title="New workspace" className="text-gray-400 hover:text-white transition-colors">
                            <PlusCircle size={16} />
                        </button>
                    </div>
                    {collabs.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelected(c)}
                            className={`w-full text-left p-3 rounded-xl transition-all ${selected?.id === c.id ? 'bg-primary-500/20 border border-primary-500/30 text-white' : 'hover:bg-white/5 text-gray-300 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Hash size={14} className="text-primary-300" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold truncate">{c.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{c.project}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1">
                                    {c.members.slice(0, 3).map((m, i) => (
                                        <div key={i} className="w-5 h-5 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full border border-gray-900 flex items-center justify-center text-xs font-bold text-white" style={{ fontSize: '8px' }}>
                                            {m[0]}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500">{c.lastActivity}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Area */}
                {selected && (
                    <div className="lg:col-span-3 glass-card flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-xl flex items-center justify-center border border-primary-500/20">
                                    <Users size={16} className="text-primary-300" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{selected.name}</p>
                                    <p className="text-xs text-gray-400">{selected.project} • {selected.members.join(', ')}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {['chat', 'docs', 'code'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTab(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize flex items-center gap-1.5 ${activeTab === t ? 'bg-primary-500/30 text-white border border-primary-500/30' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {t === 'chat' && <MessageSquare size={12} />}
                                        {t === 'docs' && <FileText size={12} />}
                                        {t === 'code' && <Code size={12} />}
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'chat' && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex gap-3 ${msg.user === user.name ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                {msg.avatar}
                                            </div>
                                            <div className={`max-w-[75%] ${msg.user === user.name ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                                {msg.user !== user.name && <p className="text-xs text-gray-500">{msg.user}</p>}
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.user === user.name
                                                        ? 'bg-gradient-to-br from-primary-500/40 to-accent-500/30 text-white border border-primary-500/20 rounded-tr-sm'
                                                        : 'bg-white/5 text-gray-200 border border-white/8 rounded-tl-sm'
                                                    }`}>{msg.text}</div>
                                                <p className="text-xs text-gray-600">{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-white/10 flex gap-2">
                                    <input
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                        placeholder="Type a message..."
                                        className="input-field flex-1"
                                    />
                                    <button onClick={sendMessage} className="btn-primary py-2 px-4 flex items-center gap-1.5 text-sm">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'docs' && (
                            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center p-8">
                                <FileText size={40} className="text-gray-600" />
                                <p className="text-gray-300 font-medium">Shared Documents</p>
                                <p className="text-gray-500 text-sm">Collaborate on documents in real-time.<br />Create and share project notes, reports, and plans.</p>
                                <button className="btn-primary py-2 px-4 text-sm mt-2">Create Document</button>
                            </div>
                        )}

                        {activeTab === 'code' && (
                            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center p-8">
                                <Code size={40} className="text-gray-600" />
                                <p className="text-gray-300 font-medium">Code Review Space</p>
                                <p className="text-gray-500 text-sm">Share code snippets, review pull requests,<br />and collaborate on technical challenges.</p>
                                <button className="btn-primary py-2 px-4 text-sm mt-2">Share Code Snippet</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
