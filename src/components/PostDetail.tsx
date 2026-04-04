import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPost } from '@/api/jsonplaceholder'
import EditPostModal from './EditPostModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Pencil, User } from 'lucide-react'
import type { Post } from '@/types'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchPost(Number(id))
      .then(setPost)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/posts')}>
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </Button>
        {post && (
          <Button size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4" /> Edit
          </Button>
        )}
      </div>

      <Card className="max-w-3xl">
        {loading ? (
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        ) : error ? (
          <CardContent className="p-8">
            <p className="text-sm text-destructive">Error: {error}</p>
          </CardContent>
        ) : post ? (
          <>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-[hsl(246_80%_95%)] text-[hsl(246_80%_45%)]">
                  Post #{post.id}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" /> User {post.userId}
                </span>
              </div>
              <h2 className="text-2xl font-bold leading-snug capitalize">{post.title}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-base">{post.body}</p>
            </CardContent>
          </>
        ) : (
          <CardContent className="p-8">
            <p className="text-sm text-muted-foreground">Post not found.</p>
          </CardContent>
        )}
      </Card>

      {editing && post && (
        <EditPostModal
          post={post}
          onClose={() => setEditing(false)}
          onSave={(updated) => { setPost(updated); setEditing(false) }}
        />
      )}
    </>
  )
}
