import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPosts, deletePost } from '@/api/jsonplaceholder'
import EditPostModal from './EditPostModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, Plus, Eye, Search, X } from 'lucide-react'
import type { Post } from '@/types'

export default function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [userIdFilter, setUserIdFilter] = useState<string>('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  function handleSave(updated: Post) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditingPost(null)
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Delete post #${post.id}?`)) return
    setDeletingId(post.id)
    try {
      await deletePost(post.id)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  // Unique user IDs for the filter dropdown
  const userIds = useMemo(
    () => [...new Set(posts.map((p) => p.userId))].sort((a, b) => a - b),
    [posts]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        String(p.id).includes(q)
      const matchesUser =
        userIdFilter === 'all' || p.userId === Number(userIdFilter)
      return matchesSearch && matchesUser
    })
  }, [posts, search, userIdFilter])

  const hasFilters = search.trim() !== '' || userIdFilter !== 'all'

  function clearFilters() {
    setSearch('')
    setUserIdFilter('all')
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl">Posts</CardTitle>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {filtered.length} of {posts.length} entries
            </p>
          )}
        </div>
        <Button onClick={() => navigate('/posts/new')} size="sm">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </CardHeader>

      {/* Filter bar */}
      {!loading && !error && (
        <div className="px-6 pb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9 h-9"
              placeholder="Search by title, body or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">User ID</label>
            <select
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(246_80%_60%)]"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
            >
              <option value="all">All</option>
              {userIds.map((uid) => (
                <option key={uid} value={uid}>
                  User {uid}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      )}

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">Error: {error}</p>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No posts match your filters.{' '}
            <button className="underline" onClick={clearFilters}>Clear filters</button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-14">#</TableHead>
                <TableHead className="w-16">User</TableHead>
                <TableHead className="w-72">Title</TableHead>
                <TableHead>Body</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="text-[hsl(246_80%_60%)] font-semibold">{post.id}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[hsl(246_80%_95%)] text-[hsl(246_80%_45%)] text-xs font-semibold">
                      {post.userId}
                    </span>
                  </TableCell>
                  <TableCell
                    className="font-medium text-[hsl(246_80%_45%)] cursor-pointer hover:underline max-w-[280px] truncate"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    {post.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-md truncate">
                    {post.body}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/posts/${post.id}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingPost(post)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(post)}
                        disabled={deletingId === post.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSave={handleSave} />
      )}
    </Card>
  )
}
