import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { LayoutGrid } from 'lucide-react'
import PostsTab from './components/PostsTab'
import PostDetail from './components/PostDetail'
import CreatePost from './components/CreatePost'
import UsersTab from './components/UsersTab'
import TodosTab from './components/TodosTab'

const NAV = [
  { to: '/posts', label: 'Posts' },
  { to: '/users', label: 'Users' },
  { to: '/todos', label: 'Todos' },
]

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-[hsl(246_80%_18%)] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[hsl(246_80%_75%)]" />
            <span className="font-bold text-lg tracking-tight">JSONPlaceholder Explorer</span>
          </div>
          <nav className="flex gap-1 ml-4">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[hsl(246_80%_25%)]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<PostsTab />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/users" element={<UsersTab />} />
          <Route path="/todos" element={<TodosTab />} />
        </Routes>
      </main>
    </div>
  )
}
