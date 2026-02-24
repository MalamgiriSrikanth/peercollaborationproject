// Mock API service using Axios with interceptors
import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

// Mock data store
const mockData = {
    projects: [
        { id: 1, title: 'Machine Learning Classifier', description: 'Implementing SVM and KNN classifiers on MNIST dataset with 98% accuracy', author: 'Alex Johnson', authorId: 2, status: 'pending_review', tags: ['ML', 'Python', 'Data Science'], submittedAt: '2024-02-15', reviewCount: 2, maxReviews: 3 },
        { id: 2, title: 'Distributed Web Crawler', description: 'Concurrent web scraper using Go routines and Redis queue, handles 10k pages/min', author: 'Priya Patel', authorId: 3, status: 'reviewed', tags: ['Go', 'Redis', 'Distributed'], submittedAt: '2024-02-12', reviewCount: 3, maxReviews: 3 },
        { id: 3, title: 'React Native Fitness App', description: 'Cross-platform mobile app with workout tracking, nutrition log, and social features', author: 'Omar Hassan', authorId: 4, status: 'in_progress', tags: ['React Native', 'Mobile', 'Firebase'], submittedAt: '2024-02-18', reviewCount: 1, maxReviews: 3 },
        { id: 4, title: 'Blockchain Voting System', description: 'Decentralized e-voting dApp using Solidity smart contracts and Web3.js', author: 'Alex Johnson', authorId: 2, status: 'submitted', tags: ['Blockchain', 'Solidity', 'Web3'], submittedAt: '2024-02-20', reviewCount: 0, maxReviews: 3 },
    ],
    reviews: [
        { id: 1, projectId: 1, reviewerId: 3, reviewer: 'Priya Patel', rating: 4, comment: 'Excellent implementation! The model accuracy is impressive. Consider adding more comments in the training pipeline.', criteriaScores: { technical: 5, documentation: 3, creativity: 4, presentation: 4 }, submittedAt: '2024-02-17' },
        { id: 2, projectId: 1, reviewerId: 4, reviewer: 'Omar Hassan', rating: 5, comment: 'Outstanding work! The preprocessing pipeline is clean and the visualizations are very clear.', criteriaScores: { technical: 5, documentation: 5, creativity: 4, presentation: 5 }, submittedAt: '2024-02-18' },
        { id: 3, projectId: 2, reviewerId: 2, reviewer: 'Alex Johnson', rating: 4, comment: 'Robust architecture. The Redis implementation shows deep understanding of message queues.', criteriaScores: { technical: 5, documentation: 4, creativity: 4, presentation: 3 }, submittedAt: '2024-02-14' },
    ],
    assignments: [
        { id: 1, title: 'Web Development Final Project Review', description: 'Review and assess peer web development projects focusing on functionality, code quality and UI/UX.', deadline: '2024-03-01', assignedCount: 12, completedCount: 8, criteria: ['Technical Depth', 'Code Quality', 'Documentation', 'Innovation'] },
        { id: 2, title: 'Machine Learning Model Evaluation', description: 'Evaluate ML projects on model selection, data preprocessing, accuracy and explainability.', deadline: '2024-03-10', assignedCount: 10, completedCount: 4, criteria: ['Model Accuracy', 'Data Handling', 'Code Efficiency', 'Report Quality'] },
    ],
    collaborations: [
        { id: 1, name: 'AI Research Group', members: ['Alex', 'Priya', 'Omar'], project: 'NLP Sentiment Analysis', lastActivity: '1 hour ago', messages: 24 },
        { id: 2, name: 'Web Dev Team', members: ['Alex', 'Omar'], project: 'E-Commerce Platform', lastActivity: '3 hours ago', messages: 16 },
    ],
}

// Interceptor — simulate network delay
api.interceptors.request.use(async config => {
    await new Promise(res => setTimeout(res, 300 + Math.random() * 400))
    return config
})

// Override default adapter to return mock data
api.interceptors.response.use(
    res => res,
    error => {
        // Swallow 404s from mock (expected)
        return Promise.resolve({ data: null })
    }
)

// ─── Projects ───────────────────────────────────────────────────────────────
export const projectsAPI = {
    getAll: () => Promise.resolve({ data: mockData.projects }),
    getById: (id) => Promise.resolve({ data: mockData.projects.find(p => p.id === Number(id)) }),
    create: (project) => {
        const newProject = { ...project, id: Date.now(), reviewCount: 0, maxReviews: 3, submittedAt: new Date().toISOString().split('T')[0] }
        mockData.projects.unshift(newProject)
        return Promise.resolve({ data: newProject })
    },
    getForStudent: (studentId) => Promise.resolve({ data: mockData.projects.filter(p => p.authorId !== studentId) }),
}

// ─── Reviews ────────────────────────────────────────────────────────────────
export const reviewsAPI = {
    getAll: () => Promise.resolve({ data: mockData.reviews }),
    getByProject: (projectId) => Promise.resolve({ data: mockData.reviews.filter(r => r.projectId === Number(projectId)) }),
    create: (review) => {
        const newReview = { ...review, id: Date.now(), submittedAt: new Date().toISOString().split('T')[0] }
        mockData.reviews.push(newReview)
        return Promise.resolve({ data: newReview })
    },
}

// ─── Assignments ─────────────────────────────────────────────────────────────
export const assignmentsAPI = {
    getAll: () => Promise.resolve({ data: mockData.assignments }),
    create: (assignment) => {
        const newAssignment = { ...assignment, id: Date.now(), completedCount: 0 }
        mockData.assignments.push(newAssignment)
        return Promise.resolve({ data: newAssignment })
    },
}

// ─── Collaborations ──────────────────────────────────────────────────────────
export const collabAPI = {
    getAll: () => Promise.resolve({ data: mockData.collaborations }),
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const statsAPI = {
    getAdminStats: () => Promise.resolve({
        data: {
            totalStudents: 48,
            totalProjects: mockData.projects.length,
            totalReviews: mockData.reviews.length,
            pendingReviews: mockData.projects.filter(p => p.status === 'pending_review').length,
            completionRate: 78,
            avgRating: (mockData.reviews.reduce((s, r) => s + r.rating, 0) / mockData.reviews.length).toFixed(1),
        }
    }),
    getStudentStats: (id) => Promise.resolve({
        data: {
            submitted: mockData.projects.filter(p => p.authorId === id).length,
            reviewsDone: mockData.reviews.filter(r => r.reviewerId === id).length,
            reviewsReceived: mockData.reviews.length,
            collaborations: mockData.collaborations.length,
        }
    }),
}

export default api
