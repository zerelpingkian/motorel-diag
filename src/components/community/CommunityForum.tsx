import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  CheckCircle2,
  Send,
  Flag,
  Search,
  Filter,
  Wrench,
  ShieldAlert,
  X,
  Star,
  Edit,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { CommunityPost, CommunityComment, Role } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CommunityForum: React.FC = () => {
  const { currentUser, role } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // Submission notification state
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'Troubleshooting Help' | 'DIY Repairs' | 'Maintenance Tip' | 'General'>('Troubleshooting Help');
  const [postSymptomTag, setPostSymptomTag] = useState('');

  // Edit Post Form State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<'Troubleshooting Help' | 'DIY Repairs' | 'Maintenance Tip' | 'General'>('Troubleshooting Help');
  const [editSymptomTag, setEditSymptomTag] = useState('');
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);

  // Comment State
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const list = await api.getPosts();
    setPosts(list);
  };

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = await api.likePost(postId, currentUser.id);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(updated);
    }
  };

  const handleRatePost = async (postId: string, rating: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const updated = await api.ratePost(postId, currentUser.id, rating);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(updated);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent || !currentUser) return;

    const newPost = await api.createPost({
      userId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      title: postTitle,
      content: postContent,
      category: postCategory,
      symptomTag: postSymptomTag || undefined
    });

    setPosts([newPost, ...posts]);
    setNewPostModalOpen(false);
    setPostTitle('');
    setPostContent('');
    setPostSymptomTag('');

    if (newPost.status === 'pending') {
      setSubmittedMessage('Your question or tip has been submitted! It is currently being reviewed by a moderator before it will be visible publicly on the community feed.');
    } else {
      setSubmittedMessage('Your question or tip has been published directly to the community feed.');
    }
  };

  const handleOpenEditModal = (post: CommunityPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setEditSymptomTag(post.symptomTag || '');
    setEditModalOpen(true);
  };

  const handleSaveEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editTitle || !editContent) return;

    const updated = await api.updatePost(editingPost.id, {
      title: editTitle,
      content: editContent,
      category: editCategory,
      symptomTag: editSymptomTag || undefined
    });

    setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)));
    if (selectedPost && selectedPost.id === editingPost.id) {
      setSelectedPost(updated);
    }
    setEditModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmPostId(postId);
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirmPostId) return;
    const postId = deleteConfirmPostId;
    setDeleteConfirmPostId(null);

    await api.deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleOpenPostDetail = async (post: CommunityPost) => {
    setSelectedPost(post);
    const comms = await api.getComments(post.id);
    setComments(comms);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !selectedPost || !currentUser) return;

    const added = await api.addComment(selectedPost.id, {
      userId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newCommentText
    });

    setComments([...comments, added]);
    setNewCommentText('');
    setPosts((prev) =>
      prev.map((p) => (p.id === selectedPost.id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
    );
  };

  const categories = ['All', 'Troubleshooting Help', 'DIY Repairs', 'Maintenance Tip', 'General'];

  const filteredPosts = posts.filter((p) => {
    // Hide rejected posts unless Admin
    if (p.status === 'rejected' && role !== 'admin') return false;

    // Hide pending posts unless Admin or the Post's Author
    if (p.status === 'pending' && role !== 'admin' && currentUser?.id !== p.userId) return false;

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.symptomTag && p.symptomTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderStars = (post: CommunityPost) => {
    const avg = post.averageRating || 0;
    const count = post.ratingCount || 0;
    const userRating = (currentUser && post.ratings) ? post.ratings[currentUser.id] : 0;

    return (
      <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = userRating ? star <= userRating : star <= Math.round(avg);
            return (
              <button
                key={star}
                disabled={!currentUser}
                title={currentUser ? `Vote ${star} star${star > 1 ? 's' : ''}` : 'Sign in to rate'}
                onClick={(e) => handleRatePost(post.id, star, e)}
                className={`p-0.5 transition-transform hover:scale-115 ${
                  filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-300'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${filled ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-bold text-slate-800">
          {avg > 0 ? avg.toFixed(1) : 'Unrated'}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          ({count})
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>Philippine Mechanics & Riders Community</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Community Q&A & Repair Forum
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Share real motorcycle troubleshooting experiences, ask questions, and learn from certified mechanics.
            </p>
          </div>

          <button
            onClick={() => setNewPostModalOpen(true)}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ask Question / Post Tip</span>
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-orange-400 border border-orange-500/50'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submission Alert Notification Banner */}
      {submittedMessage && (
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 text-xs font-semibold text-amber-200 flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{submittedMessage}</p>
          </div>
          <button
            onClick={() => setSubmittedMessage(null)}
            className="text-amber-400 hover:text-white transition-colors text-base font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List Column */}
        <div className={`space-y-4 ${selectedPost ? 'lg:col-span-1 hidden lg:block' : 'lg:col-span-3'}`}>
          {filteredPosts.map((post) => {
            const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
            const isSelected = selectedPost?.id === post.id;
            const canManage = currentUser && (currentUser.id === post.userId || role === 'admin');

            return (
              <div
                key={post.id}
                onClick={() => handleOpenPostDetail(post)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all space-y-3 shadow-sm ${
                  isSelected ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{post.authorName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-slate-700 font-semibold rounded text-[10px] uppercase border border-gray-200">
                      {post.authorRole}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[10px]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                    {/* Edit & Delete quick controls */}
                    {canManage && (
                      <div className="flex items-center space-x-1 pl-2 border-l border-gray-200" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenEditModal(post, e)}
                          title="Edit Post"
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-orange-600 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePost(post.id, e)}
                          title="Delete Post"
                          className="p-1 hover:bg-red-50 rounded text-slate-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                      {post.category}
                    </span>
                    {post.symptomTag && (
                      <span className="text-[10px] text-slate-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-medium">
                        {post.symptomTag}
                      </span>
                    )}
                    {post.isSolved && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span>Solved</span>
                      </span>
                    )}
                    {post.status === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pending Moderation</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className={`flex items-center space-x-1 font-semibold ${
                        isLiked ? 'text-orange-600' : 'hover:text-slate-900'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-orange-600 text-orange-600' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>

                  {/* 5-Star Rating Control */}
                  {renderStars(post)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Post Detail Drawer Column */}
        {selectedPost && (
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="lg:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-xl text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Post Header */}
            <div className="border-b border-gray-200 pb-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{selectedPost.authorName}</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold uppercase rounded border border-orange-200">
                    {selectedPost.authorRole}
                  </span>
                  {selectedPost.status === 'pending' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-300 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Under Moderation</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>{new Date(selectedPost.createdAt).toLocaleString()}</span>
                  {currentUser && (currentUser.id === selectedPost.userId || role === 'admin') && (
                    <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
                      <button
                        onClick={(e) => handleOpenEditModal(selectedPost, e)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDeletePost(selectedPost.id, e)}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{selectedPost.title}</h2>

              {/* Rating header in Detail Drawer */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Community Quality Rating:</span>
                {renderStars(selectedPost)}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-200 font-medium">
                {selectedPost.content}
              </p>
            </div>

            {/* Comments Thread */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <span>Discussion Replies ({comments.length})</span>
              </h3>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-900">{comment.authorName} ({comment.authorRole})</span>
                      <span className="text-[10px]">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-1 font-medium">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              {currentUser && (
                <form onSubmit={handleAddComment} className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Write a mechanics reply..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shrink-0 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ask Question or Share Experience</h3>
              <button onClick={() => setNewPostModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Moderation Notice:</strong> New questions and repair tips are submitted for moderator review prior to public posting to maintain community quality and prevent spam.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Category</label>
                <select
                  value={postCategory}
                  onChange={(e: any) => setPostCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="Troubleshooting Help">Troubleshooting Help</option>
                  <option value="DIY Repairs">DIY Repairs</option>
                  <option value="Maintenance Tip">Maintenance Tip</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. Honda Click 125 wont start after heavy rain"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Symptom Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. No Crank / FI Light Code 12"
                  value={postSymptomTag}
                  onChange={(e) => setPostSymptomTag(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Details & Inspection Findings</label>
                <textarea
                  rows={4}
                  placeholder="Describe motorcycle model, symptoms, what tools you tested with, and your findings..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold rounded-xl border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Community Post</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPost} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Category</label>
                <select
                  value={editCategory}
                  onChange={(e: any) => setEditCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="Troubleshooting Help">Troubleshooting Help</option>
                  <option value="DIY Repairs">DIY Repairs</option>
                  <option value="Maintenance Tip">Maintenance Tip</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Post Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Symptom Tag</label>
                <input
                  type="text"
                  value={editSymptomTag}
                  onChange={(e) => setEditSymptomTag(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Post Content</label>
                <textarea
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold rounded-xl border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      {deleteConfirmPostId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-xl border border-red-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-[11px] text-slate-500">Community Discussion Post</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Are you sure you want to delete this community post permanently?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmPostId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
