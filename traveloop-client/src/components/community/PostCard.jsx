import React from 'react';
import { Link } from 'react-router-dom';
import { LuHeart, LuMessageCircle, LuMapPin } from 'react-icons/lu';
import { Avatar } from '../ui/Avatar';

const VISIBILITY_COLORS = {
  PUBLIC: 'bg-green-500/15 text-green-400',
  FRIENDS: 'bg-blue-500/15 text-blue-400',
  PRIVATE: 'bg-white/8 text-neutral-text'
};

export const PostCard = ({ post, onLike }) => {
  const author = post.author || post.user;

  return (
    <div className="bg-[#0A1622] border border-white/5 rounded-[20px] overflow-hidden hover:border-white/10 transition-all group">
      {post.images?.[0] && (
        <div className="h-44 bg-white/5 overflow-hidden">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Author row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={author?.firstName} src={author?.profileImage} size={36} />
            <div>
              <div className="text-sm text-secondary-bg font-semibold">
                {author?.firstName} {author?.lastName}
              </div>
              {post.trip?.destination && (
                <div className="flex items-center gap-1 text-xs text-neutral-text">
                  <LuMapPin className="w-3 h-3" /> {post.trip.destination}
                </div>
              )}
            </div>
          </div>
          {post.visibility && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${VISIBILITY_COLORS[post.visibility] || VISIBILITY_COLORS.PUBLIC}`}>
              {post.visibility}
            </span>
          )}
        </div>

        {/* Title & excerpt */}
        <div>
          <Link to={`/dashboard/community/${post.id}`}>
            <h3 className="text-base font-heading font-bold text-secondary-bg hover:text-accent-blue transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-xs text-neutral-text mt-1.5 line-clamp-2 leading-relaxed">{post.content}</p>
        </div>

        {/* Attached trip pill */}
        {post.trip && (
          <div className="flex items-center gap-2 bg-accent-blue/8 border border-accent-blue/20 rounded-[10px] px-3 py-2">
            <span className="text-xs text-accent-blue font-medium">📍 {post.trip.title}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between text-xs text-neutral-text pt-1 border-t border-white/5">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 hover:text-white transition-colors ${post.isLiked ? 'text-red-400' : ''}`}
          >
            <LuHeart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
            {post.likesCount || 0}
          </button>
          <Link to={`/dashboard/community/${post.id}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <LuMessageCircle className="w-4 h-4" />
            {post.commentsCount || 0}
          </Link>
        </div>
      </div>
    </div>
  );
};
