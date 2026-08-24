import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBlogsSection({
  blogs,
  blogForm,
  setBlogForm,
  showForm,
  editingItem,
  isSubmitting,
  handleSaveBlog,
  handleBlogImageChange,
  startEdit,
  handleDelete,
  setPreviewPost,
  resetForms,
}) {
  return (
    <div className="space-y-6">
      {/* Slide Down Form Container */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8 border-b border-[rgba(255,255,255,0.07)] pb-8"
          >
            <h3 className="text-sm uppercase tracking-wider text-[#888880] mb-4 font-normal">
              {editingItem ? "Edit Story Details" : "Publish New Blog Post"}
            </h3>

            <form onSubmit={handleSaveBlog} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Post Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Highlights from Web Dev Bootcamp 2025"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Publication Date</label>
                <input
                  type="text"
                  value={blogForm.date}
                  onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                  placeholder="e.g. Oct 24, 2025"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Category</label>
                <select
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  <option value="News">News</option>
                  <option value="Events">Events</option>
                  <option value="Tech Tips">Tech Tips</option>
                  <option value="Student Life">Student Life</option>
                  <option value="Career">Career</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Author Name</label>
                <input
                  type="text"
                  required
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  placeholder="e.g. Tech Directorate"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Author Role</label>
                <input
                  type="text"
                  value={blogForm.authorRole}
                  onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                  placeholder="e.g. Lead Engineer"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Read Time</label>
                <input
                  type="text"
                  value={blogForm.readTime}
                  onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                  placeholder="e.g. 4 min read"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Tags (comma separated)</label>
                <input
                  type="text"
                  value={blogForm.tagsInput}
                  onChange={(e) => setBlogForm({ ...blogForm, tagsInput: e.target.value })}
                  placeholder="e.g. Bootcamp, Web, Python"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Cover Image (Upload or URL)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageChange}
                    className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                  />
                  <input
                    type="text"
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    placeholder="Or paste an image URL directly"
                    className="flex-1 px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Brief summary shown in article preview cards..."
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Content (Markdown Supported)</label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Full article content in markdown format..."
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22] font-mono text-xs"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                >
                  {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                  {editingItem ? "Save Changes" : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="px-5 py-2.5 bg-[#1A1A17] hover:bg-white/[0.03] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Records List */}
      {blogs.length === 0 ? (
        <p className="text-[#888880] text-xs italic font-light text-center py-8">No stories published yet.</p>
      ) : (
        blogs.map((post, idx) => (
          <div
            key={post.id || idx}
            className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <div className="max-w-[70%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2 py-0.5 rounded font-medium">
                  {post.category}
                </span>
                <span className="text-[10px] text-[#888880] font-light">{post.readTime}</span>
              </div>
              <h4 className="text-white font-medium text-sm mt-1 line-clamp-1">{post.title}</h4>
              <p className="text-[10px] text-[#888880] mt-1 font-light">
                By {post.author} {post.authorRole ? `(${post.authorRole})` : ""} · {post.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewPost(post)}
                className="p-2 border border-[#2D7A22]/30 hover:border-[#2D7A22] text-[#2D7A22] hover:bg-[#2D7A22]/10 rounded transition-colors text-xs"
                title="Preview Article"
              >
                <i className="ti ti-eye" />
              </button>
              <button
                onClick={() => startEdit(post)}
                className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs"
                title="Edit"
              >
                <i className="ti ti-edit" />
              </button>
              <button
                onClick={() => handleDelete(post, idx)}
                className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-500/70 hover:text-red-400 rounded transition-colors text-xs"
                title="Delete"
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
