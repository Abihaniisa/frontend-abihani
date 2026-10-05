import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, AlertCircle, RefreshCw } from './icons';
import { Post } from '../types/post.types';
import { CommentItem } from '../types/comment.types';
import { PostService } from '../services';
import { useAuthStore } from '../store/auth.store';
import { formatTimeAgo } from '../utils/formatDate';

interface CommentSheetProps {
  post: Post | null;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [inputText, setInputText] = useState('');
  const { currentUser } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!post) return;
    setLoading(true);
    setError(false);

    const timer = setTimeout(() => {
      try {
        const loaded = PostService.getComments(post.id);
        setComments(loaded);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [post]);

  if (!post) return null;

  const handleSend = (): void => {
    if (!inputText.trim()) return;

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      postId: post.id,
      user: currentUser,
      text: inputText.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };

    // Optimistic send
    setComments((prev) => [newComment, ...prev]);
    PostService.addComment(post.id, newComment);
    setInputText('');

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs select-none">
      {/* Outside tap scrim closes */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg mx-auto bg-[#0B0B0F] border-t border-neutral-800 rounded-t-3xl flex flex-col max-h-[75vh] shadow-2xl overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#F5F0E6]">Comments</span>
            <span className="text-xs text-[#B8B2A6] tabular-nums font-medium">
              ({comments.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#B8B2A6] hover:text-white hover:bg-neutral-800 active:scale-95"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar min-h-[220px]">
          {loading ? (
            // Skeleton Loader as mandated by Part 7
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-800" />
                  <div className="flex-1 space-y-2">
                    <div className="w-24 h-3 bg-neutral-800 rounded" />
                    <div className="w-48 h-3 bg-neutral-800/70 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error State with Retry button
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle className="w-8 h-8 text-[#FF3B3B] mb-2" />
              <h4 className="text-sm font-bold text-[#F5F0E6]">Something went wrong</h4>
              <p className="text-xs text-[#B8B2A6] mb-4">Try again later</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(false);
                  setTimeout(() => {
                    setComments(PostService.getComments(post.id));
                    setLoading(false);
                  }, 400);
                }}
                className="w-full max-w-xs h-10 rounded-xl bg-neutral-800 text-[#F5F0E6] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-700"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : comments.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-8 h-8 text-neutral-600 mb-2 stroke-[1.5]" />
              <h4 className="text-sm font-semibold text-[#F5F0E6]">No comments yet</h4>
              <p className="text-xs text-[#B8B2A6] mt-0.5">Start the conversation</p>
            </div>
          ) : (
            // Comments List
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-left">
                <img
                  src={comment.user.avatarUrl}
                  alt={comment.user.displayName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F5F0E6]">
                      @{comment.user.handle}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#F5F0E6]/90 mt-0.5 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Composer Pinned at bottom */}
        <div className="p-3 border-t border-neutral-800/80 bg-[#0B0B0F] flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            autoComplete="off"
            data-lpignore="true"
            data-form-type="other"
            className="flex-1 h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C41E3A] transition-colors"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-xl bg-[#C41E3A] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b01a33] active:scale-95 transition-transform shrink-0"
            aria-label="Send comment"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
