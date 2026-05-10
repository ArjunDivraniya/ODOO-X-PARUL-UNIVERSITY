import React, { useContext, useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { getPosts, toggleLike } from '../../api/community';
import { PostCard } from '../../components/community/PostCard';
import CreatePostModal from '../../components/community/CreatePostModal';
import { EmptyState } from '../../components/ui/EmptyState';

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('feed');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data.data.posts || []);
      } catch (err) {
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId);
      setPosts(prev => prev.map(post => post.id === postId ? { ...post, likesCount: (post.likesCount || 0) + 1 } : post));
    } catch (err) {
      toast.error('Failed to toggle like');
    }
  };

  const visiblePosts = tab === 'my' ? posts.filter(post => post.author?.id === user?.id) : posts;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary-bg">Community</h1>
          <p className="text-neutral-text text-sm">Share your travel stories and tips.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-accent-blue text-[#0A1622] rounded-[14px] font-semibold text-sm hover:bg-[#5bc0ff] transition-colors flex items-center gap-2"
        >
          <LuPlus className="w-4 h-4" /> Create Post
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('feed')}
          className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${tab === 'feed' ? 'bg-accent-blue text-[#0A1622]' : 'bg-white/5 text-neutral-text'}`}
        >
          Feed
        </button>
        <button
          onClick={() => setTab('my')}
          className={`px-4 py-2 rounded-[12px] text-xs font-medium transition-all ${tab === 'my' ? 'bg-accent-blue text-[#0A1622]' : 'bg-white/5 text-neutral-text'}`}
        >
          My Posts
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-text">Loading posts...</div>
      ) : visiblePosts.length === 0 ? (
        <EmptyState title="No posts yet" description="Start the conversation with your first post." actionLabel="Create Post" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visiblePosts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePostModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={(newPost) => setPosts(prev => [newPost, ...prev])}
        />
      )}
    </div>
  );
};

export default Community;
