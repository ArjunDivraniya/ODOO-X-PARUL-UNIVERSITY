import React from 'react';
import { Link } from 'react-router-dom';
import { LuHeart, LuMessageCircle } from 'react-icons/lu';
import { Avatar } from '../ui/Avatar';

export const PostCard = ({ post, onLike }) => {
  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[20px] overflow-hidden">
      {post.image && (
        <div className="h-40 bg-white/5">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar name={post.author?.firstName} src={post.author?.profileImage} size={36} />
          <div>
            <div className="text-sm text-secondary-bg font-semibold">{post.author?.firstName} {post.author?.lastName}</div>
            <div className="text-xs text-neutral-text">{post.visibility || 'PUBLIC'}</div>
          </div>
        </div>

        <div>
          <Link to={`/dashboard/community/${post.id}`}>
            <h3 className="text-lg font-heading font-bold text-secondary-bg hover:text-accent-blue transition-colors">{post.title}</h3>
          </Link>
          <p className="text-sm text-neutral-text mt-2 line-clamp-2">{post.content}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-text">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-2 hover:text-white">
            <LuHeart className="w-4 h-4" /> {post.likesCount || 0}
          </button>
          <div className="flex items-center gap-2">
            <LuMessageCircle className="w-4 h-4" /> {post.commentsCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
};
