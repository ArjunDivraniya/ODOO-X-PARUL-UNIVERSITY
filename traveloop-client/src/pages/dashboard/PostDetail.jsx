import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LuHeart, LuMessageCircle, LuCopy, LuBookmark, LuMapPin,
  LuCalendar, LuArrowRight, LuStickyNote, LuChevronDown, LuChevronUp
} from 'react-icons/lu';
import { AuthContext } from '../../context/AuthContext';
import { getPost, addComment, toggleLike, saveTrip, copyTrip } from '../../api/community';
import { CommentItem } from '../../components/community/CommentItem';
import { Avatar } from '../../components/ui/Avatar';

// ─── tiny helpers ────────────────────────────────────────────────────────────
const fmt = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

const ItinerarySection = ({ section }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/8 rounded-[16px] overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/8 transition-colors"
      >
        <span className="text-sm font-semibold text-secondary-bg">{section.title}</span>
        {open ? <LuChevronUp className="w-4 h-4 text-neutral-text" /> : <LuChevronDown className="w-4 h-4 text-neutral-text" />}
      </button>
      {open && section.activities?.length > 0 && (
        <div className="divide-y divide-white/5">
          {section.activities.map(act => (
            <div key={act.id} className="flex items-start gap-4 px-5 py-4">
              {act.image && (
                <img src={act.image} alt={act.title} className="w-14 h-14 rounded-[10px] object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-secondary-bg">{act.title}</div>
                {act.description && <p className="text-xs text-neutral-text mt-0.5 line-clamp-2">{act.description}</p>}
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-neutral-text">
                  {act.location && <span className="flex items-center gap-1"><LuMapPin className="w-3 h-3" />{act.location}</span>}
                  {act.startTime && <span className="flex items-center gap-1"><LuCalendar className="w-3 h-3" />{fmt(act.startTime)}</span>}
                  {act.price > 0 && <span className="text-accent-blue font-semibold">₹{act.price}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && (!section.activities || section.activities.length === 0) && (
        <p className="px-5 py-4 text-xs text-neutral-text">No activities in this section.</p>
      )}
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [tripAction, setTripAction] = useState(null); // 'saving' | 'copying'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPost(postId);
        setPost(res.data.data.post);
      } catch {
        toast.error('Failed to load post');
      }
    };
    load();
  }, [postId]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await toggleLike(postId);
      const liked = res.data.data.liked;
      setPost(prev => ({
        ...prev,
        isLiked: liked,
        likesCount: liked ? (prev.likesCount || 0) + 1 : Math.max((prev.likesCount || 0) - 1, 0)
      }));
    } catch {
      toast.error('Failed to toggle like');
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await addComment(postId, { content: comment });
      setPost(prev => ({
        ...prev,
        comments: [res.data.data.comment, ...(prev.comments || [])],
        commentsCount: (prev.commentsCount || 0) + 1
      }));
      setComment('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveTrip = async () => {
    if (tripAction) return;
    setTripAction('saving');
    try {
      await saveTrip(postId);
      toast.success('Trip saved to your account!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setTripAction(null);
    }
  };

  const handleCopyTrip = async () => {
    if (tripAction) return;
    setTripAction('copying');
    try {
      const res = await copyTrip(postId);
      toast.success('Trip copied! Redirecting...');
      setTimeout(() => navigate(`/dashboard/trips/${res.data.data.trip.id}`), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to copy trip');
      setTripAction(null);
    }
  };

  if (!post) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  const trip = post.trip;
  const symbol = trip ? (CURRENCY_SYMBOLS[trip.currency] || '₹') : '₹';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* ── Post Card ─────────────────────────────────────── */}
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] overflow-hidden">
        {post.images?.length > 0 && (
          <div className="h-64 bg-white/5">
            <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 space-y-5">
          {/* Author + meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={post.author?.firstName} src={post.author?.profileImage} size={44} />
              <div>
                <div className="text-sm text-secondary-bg font-semibold">
                  {post.author?.firstName} {post.author?.lastName}
                </div>
                {post.author?.bio && <div className="text-xs text-neutral-text line-clamp-1">{post.author.bio}</div>}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.visibility === 'PUBLIC' ? 'bg-green-500/15 text-green-400' :
              post.visibility === 'FRIENDS' ? 'bg-blue-500/15 text-blue-400' :
              'bg-white/8 text-neutral-text'
            }`}>
              {post.visibility}
            </span>
          </div>

          {/* Title & Content */}
          <div>
            <h1 className="text-2xl font-heading font-bold text-secondary-bg">{post.title}</h1>
            <p className="text-sm text-neutral-text mt-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Like / Comment stats */}
          <div className="flex items-center gap-6 pt-2 border-t border-white/5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-400' : 'text-neutral-text hover:text-white'}`}
            >
              <LuHeart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
              {post.likesCount || 0} Likes
            </button>
            <div className="flex items-center gap-2 text-sm text-neutral-text">
              <LuMessageCircle className="w-4 h-4" />
              {post.commentsCount || 0} Comments
            </div>
          </div>
        </div>
      </div>

      {/* ── Attached Trip ─────────────────────────────────── */}
      {trip && (
        <div className="bg-[#0A1622] border border-white/5 rounded-[24px] overflow-hidden">
          {/* Trip header */}
          <div className="relative">
            {trip.coverImage && (
              <img src={trip.coverImage} alt={trip.title} className="w-full h-48 object-cover opacity-60" />
            )}
            <div className={`p-6 ${trip.coverImage ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A1622]' : ''}`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs text-accent-blue font-semibold uppercase tracking-wider mb-1">Attached Trip</div>
                  <h2 className="text-xl font-heading font-bold text-secondary-bg">{trip.title}</h2>
                  {trip.destination && (
                    <div className="flex items-center gap-1 text-xs text-neutral-text mt-1">
                      <LuMapPin className="w-3 h-3" />{trip.destination}
                    </div>
                  )}
                </div>
                {/* Save / Copy buttons */}
                {user && post.author?.id !== user.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveTrip}
                      disabled={!!tripAction}
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] border border-white/10 bg-white/5 text-sm text-neutral-text hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                      <LuBookmark className="w-4 h-4" />
                      {tripAction === 'saving' ? 'Saving...' : 'Save Trip'}
                    </button>
                    <button
                      onClick={handleCopyTrip}
                      disabled={!!tripAction}
                      className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-accent-blue text-[#0A1622] text-sm font-semibold hover:bg-[#5bc0ff] transition-all disabled:opacity-50"
                    >
                      <LuCopy className="w-4 h-4" />
                      {tripAction === 'copying' ? 'Copying...' : 'Copy & Edit'}
                    </button>
                  </div>
                )}
              </div>

              {/* Trip stats */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-neutral-text">
                {trip.startDate && (
                  <span className="flex items-center gap-1">
                    <LuCalendar className="w-3 h-3" />
                    {fmt(trip.startDate)}
                    {trip.endDate && <><LuArrowRight className="w-3 h-3" />{fmt(trip.endDate)}</>}
                  </span>
                )}
                {trip.estimatedBudget && (
                  <span className="text-green-400 font-semibold">{symbol}{trip.estimatedBudget.toLocaleString('en-IN')} est.</span>
                )}
              </div>
            </div>
          </div>

          {/* Trip description */}
          {trip.description && (
            <p className="px-6 py-4 text-sm text-neutral-text border-t border-white/5">{trip.description}</p>
          )}

          {/* Itinerary Sections */}
          {trip.itinerarySections?.length > 0 && (
            <div className="px-6 pb-6 space-y-3">
              <h3 className="text-sm font-semibold text-secondary-bg mt-2">Itinerary</h3>
              {trip.itinerarySections.map(sec => (
                <ItinerarySection key={sec.id} section={sec} />
              ))}
            </div>
          )}

          {/* Notes */}
          {trip.notes?.length > 0 && (
            <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-secondary-bg flex items-center gap-2">
                <LuStickyNote className="w-4 h-4 text-accent-blue" /> Travel Notes
              </h3>
              {trip.notes.map(note => (
                <div key={note.id} className="bg-white/3 border border-white/5 rounded-[14px] p-4">
                  {note.title && <div className="text-xs font-semibold text-secondary-bg mb-1">{note.title}</div>}
                  <p className="text-xs text-neutral-text">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Comments ──────────────────────────────────────── */}
      <div className="bg-[#0A1622] border border-white/5 rounded-[24px] p-6 space-y-5">
        <h2 className="text-lg font-heading font-bold text-secondary-bg">
          Comments <span className="text-neutral-text text-sm font-normal">({post.commentsCount || 0})</span>
        </h2>

        {/* Add comment */}
        {user && (
          <div className="flex items-start gap-3">
            <Avatar name={user?.firstName} src={user?.profileImage} size={36} />
            <div className="flex-1 flex gap-2">
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                placeholder="Write a comment... (Enter to send)"
                className="flex-1 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-secondary-bg focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
              />
              <button
                onClick={handleAddComment}
                disabled={submitting || !comment.trim()}
                className="px-4 py-3 bg-accent-blue text-[#0A1622] rounded-[14px] text-sm font-semibold hover:bg-[#5bc0ff] transition-colors disabled:opacity-50"
              >
                {submitting ? '...' : 'Post'}
              </button>
            </div>
          </div>
        )}

        {/* Comment list */}
        <div className="space-y-3">
          {post.comments?.length > 0 ? (
            post.comments.map(item => <CommentItem key={item.id} comment={item} />)
          ) : (
            <p className="text-sm text-neutral-text">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
