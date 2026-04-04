import { useState, useEffect } from 'react'
import { fetchTodos } from '@/api/jsonplaceholder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Todo } from '@/types'

type Filter = 'all' | 'done' | 'pending'

export default function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  function toggleTodo(id: number) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const visible = todos.filter((t) => {
    if (filter === 'done') return t.completed
    if (filter === 'pending') return !t.completed
    return true
  })

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'done', label: '✓ Done' },
    { value: 'pending', label: '○ Pending' },
  ]

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-xl">Todos</CardTitle>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">{visible.length} items</p>
            )}
          </div>
          <div className="flex gap-1.5">
            {filters.map(({ value, label }) => (
              <Button
                key={value}
                size="sm"
                variant={filter === value ? 'default' : 'outline'}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">Error: {error}</p>
        ) : (
          <ul className="space-y-1.5">
            {visible.map((todo) => (
              <li
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer select-none transition-colors',
                  todo.completed
                    ? 'bg-muted/40 border-muted text-muted-foreground'
                    : 'bg-white hover:bg-slate-50'
                )}
              >
                {todo.completed
                  ? <CheckCircle2 className="w-4 h-4 shrink-0 text-[hsl(246_80%_60%)]" />
                  : <Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
                }
                <span className={cn('text-sm', todo.completed && 'line-through')}>
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
