import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { getPost, addComment } from '../../api/community';
import { CommentItem } from '../../components/community/CommentItem';
import { Avatar } from '../../components/ui/Avatar';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPost(postId);
        setPost(res.data.data.post);
      } catch (err) {
        toast.error('Failed to load post');
      }
    };
    load();
  }, [postId]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await addComment(postId, { content: comment });
      setPost(prev => ({ ...prev, comments: [res.data.data.comment, ...(prev.comments || [])] }));
      setComment('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  if (!post) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] overflow-hidden">
        {post.image && (
          <div className="h-56 bg-white/5">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={post.author?.firstName} src={post.author?.profileImage} size={40} />
            <div>
              <div className="text-sm text-secondary-bg font-semibold">{post.author?.firstName} {post.author?.lastName}</div>
              <div className="text-xs text-neutral-text">{post.visibility || 'PUBLIC'}</div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary-bg">{post.title}</h1>
            <p className="text-sm text-neutral-text mt-2">{post.content}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 space-y-4">
        <h2 className="text-lg font-heading font-bold text-secondary-bg">Comments</h2>
        <div className="flex items-center gap-3">
          <Avatar name={user?.firstName} src={user?.profileImage} size={36} />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary-bg focus:outline-none"
          />
          <button onClick={handleAddComment} className="px-4 py-3 bg-accent-blue text-[#0A1622] rounded-[14px] text-sm font-semibold">Post</button>
        </div>

        <div className="space-y-3">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map(item => (
              <CommentItem
                key={item.id}
                comment={item}
              />
            ))
          ) : (
            <p className="text-sm text-neutral-text">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
