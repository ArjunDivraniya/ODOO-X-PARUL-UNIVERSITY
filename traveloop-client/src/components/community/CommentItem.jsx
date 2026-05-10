import React from 'react';
import { Avatar } from '../ui/Avatar';

export const CommentItem = ({ comment, onDelete }) => {
  return (
    <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded-[16px] p-4">
      <Avatar name={comment.user?.firstName} src={comment.user?.profileImage} size={32} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-bg font-semibold">{comment.user?.firstName} {comment.user?.lastName}</div>
          {onDelete && (
            <button onClick={onDelete} className="text-xs text-red-300 hover:text-red-200">Delete</button>
          )}
        </div>
        <p className="text-sm text-neutral-text mt-1">{comment.content}</p>
      </div>
    </div>
  );
};
