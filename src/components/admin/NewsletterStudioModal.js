import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterStudioModal({
  isOpen,
  onClose,
  newsletterForm,
  setNewsletterForm,
  selectedTemplateKey,
  handleSelectTemplate,
  handleNewsletterBannerChange,
  handleAddHighlight,
  handleRemoveHighlight,
  newHighlightInput,
  setNewHighlightInput,
  handleSendTestEmail,
  handleBroadcastNewsletter,
  testEmailAddress,
  setTestEmailAddress,
  testSubmitting,
  broadcastSubmitting,
  subscriberCount,
}) {
  const [previewDevice, setPreviewDevice] = useState("desktop"); // "desktop" | "mobile"

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Modal Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)] bg-[#161614]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2D7A22]/20 text-[#2D7A22] flex items-center justify-center text-base">
                <i className="ti ti-sparkles" />
              </div>
              <div>
                <h2 className="text-white font-display font-medium text-base">Promotional Newsletter Studio</h2>
                <p className="text-[10px] text-[#888880]">Compose standard branded promotional emails with responsive preview & live dispatch.</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#888880] hover:text-white flex items-center justify-center transition-colors"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          {/* Template Quick Selection Strip */}
          <div className="px-6 py-3 bg-[#1A1A17]/60 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase tracking-wider text-[#888880] mr-2 shrink-0">Preset Templates:</span>
            <button
              type="button"
              onClick={() => handleSelectTemplate("event")}
              className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedTemplateKey === "event" ? "bg-[#2D7A22] text-white" : "bg-[#111110] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
              }`}
            >
              🎟️ Event & Tech Fest Promo
            </button>
            <button
              type="button"
              onClick={() => handleSelectTemplate("blog")}
              className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedTemplateKey === "blog" ? "bg-[#2D7A22] text-white" : "bg-[#111110] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
              }`}
            >
              📰 New Story Digest
            </button>
            <button
              type="button"
              onClick={() => handleSelectTemplate("general")}
              className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedTemplateKey === "general" ? "bg-[#2D7A22] text-white" : "bg-[#111110] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
              }`}
            >
              📢 Department Notice
            </button>
            <button
              type="button"
              onClick={() => handleSelectTemplate("custom")}
              className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-colors shrink-0 flex items-center gap-1.5 ${
                selectedTemplateKey === "custom" ? "bg-[#2D7A22] text-white" : "bg-[#111110] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
              }`}
            >
              ⚡ Blank Custom
            </button>
          </div>

          {/* Main Modal Body (Two-Column: Form Left, Live Preview Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-[rgba(255,255,255,0.07)]">

            {/* Left Column: Form Fields */}
            <div className="lg:col-span-6 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={newsletterForm.subject}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                  placeholder="e.g. 🚀 NACOS Tech Fest '26 — Registration Now Open!"
                  className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Preheader Snippet</label>
                  <input
                    type="text"
                    value={newsletterForm.preheader}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, preheader: e.target.value })}
                    placeholder="Snippet preview in inbox..."
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Eyebrow / Category Tag</label>
                  <input
                    type="text"
                    value={newsletterForm.eyebrow}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, eyebrow: e.target.value })}
                    placeholder="e.g. TECH FEST 2026"
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Main Headline</label>
                <input
                  type="text"
                  required
                  value={newsletterForm.headline}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, headline: e.target.value })}
                  placeholder="e.g. Build the Future: Register for Tech Fest '26"
                  className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Hero Promotional Banner Image</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewsletterBannerChange}
                    className="text-xs text-[#888880] file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newsletterForm.bannerImage}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, bannerImage: e.target.value })}
                    placeholder="Or paste an image banner URL directly..."
                    className="w-full px-3.5 py-1.5 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Body Message Paragraphs</label>
                <textarea
                  rows={5}
                  required
                  value={newsletterForm.bodyContent}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, bodyContent: e.target.value })}
                  placeholder="Write your email body here. Double enter creates separate paragraphs..."
                  className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22] leading-relaxed"
                />
              </div>

              {/* Highlights Bullet Point Manager */}
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Key Details & Highlights (Optional)</label>
                <div className="space-y-1.5 mb-2">
                  {(newsletterForm.highlights || []).map((hl, idx) => (
                    <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-[#1A1A17] border border-[rgba(255,255,255,0.05)] rounded text-xs">
                      <span className="text-[#D0CDC6] text-[11px]">{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-red-400 hover:text-red-300 ml-2 text-xs"
                      >
                        <i className="ti ti-x" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlightInput}
                    onChange={(e) => setNewHighlightInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddHighlight(); } }}
                    placeholder="Add a bullet highlight (e.g. 📅 Date: July 12)..."
                    className="flex-1 px-3 py-1.5 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded focus:outline-none focus:border-[#2D7A22]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs rounded font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* CTA Button Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">Call to Action (CTA) Text</label>
                  <input
                    type="text"
                    value={newsletterForm.ctaText}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, ctaText: e.target.value })}
                    placeholder="e.g. Register Now →"
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#888880] mb-1 tracking-wider">CTA Link URL</label>
                  <input
                    type="text"
                    value={newsletterForm.ctaUrl}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, ctaUrl: e.target.value })}
                    placeholder="e.g. https://nacos-bells.vercel.app/events"
                    className="w-full px-3.5 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Email Simulator */}
            <div className="lg:col-span-6 p-6 bg-[#080806] flex flex-col max-h-[70vh]">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-[#888880] font-medium flex items-center gap-1.5">
                  <i className="ti ti-devices text-[#2D7A22]" /> Live Recipient Inbox Simulator
                </span>
                <div className="flex bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      previewDevice === "desktop" ? "bg-[#2D7A22] text-white" : "text-[#888880] hover:text-white"
                    }`}
                  >
                    <i className="ti ti-device-desktop" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      previewDevice === "mobile" ? "bg-[#2D7A22] text-white" : "text-[#888880] hover:text-white"
                    }`}
                  >
                    <i className="ti ti-device-mobile" /> Mobile
                  </button>
                </div>
              </div>

              {/* Simulator Container Frame */}
              <div className="flex-1 overflow-y-auto flex justify-center py-2">
                <div
                  className={`bg-[#111110] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 shadow-2xl transition-all ${
                    previewDevice === "desktop" ? "w-full max-w-[540px]" : "w-[340px]"
                  }`}
                >
                  {/* Email Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(255,255,255,0.08)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2D7A22]" />
                      <strong className="text-white text-xs tracking-wider">NACOS BELLS CHAPTER</strong>
                    </div>
                    <span className="text-[9px] text-[#888880] uppercase tracking-widest">Official Broadcast</span>
                  </div>

                  {/* Eyebrow Tag */}
                  {newsletterForm.eyebrow && (
                    <div className="mb-2">
                      <span className="inline-block bg-[#2D7A22]/15 border border-[#2D7A22]/30 text-[#3A9C2D] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {newsletterForm.eyebrow}
                      </span>
                    </div>
                  )}

                  {/* Headline */}
                  <h2 className="text-white font-display font-medium text-base sm:text-lg mb-3 leading-snug">
                    {newsletterForm.headline || "Promotional Email Headline"}
                  </h2>

                  {/* Hero Image */}
                  {newsletterForm.bannerImage && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.07)]">
                      <img
                        src={newsletterForm.bannerImage}
                        alt="Campaign Hero"
                        className="w-full h-44 object-cover"
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="text-[#C5C2BA] text-xs leading-relaxed space-y-3 mb-4 font-light whitespace-pre-line">
                    {newsletterForm.bodyContent || "Body text content will appear here..."}
                  </div>

                  {/* Highlights */}
                  {newsletterForm.highlights && newsletterForm.highlights.length > 0 && (
                    <div className="p-3 bg-[#161614] border border-[rgba(255,255,255,0.06)] rounded-lg mb-4">
                      <span className="text-[10px] text-[#2D7A22] font-semibold uppercase tracking-wider block mb-1.5">
                        Key Details & Highlights
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#E0DDD5]">
                        {newsletterForm.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#2D7A22]">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  {newsletterForm.ctaText && (
                    <div className="text-center my-5">
                      <a
                        href={newsletterForm.ctaUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs font-semibold px-6 py-2.5 rounded uppercase tracking-wider shadow-lg shadow-[#2D7A22]/20"
                      >
                        {newsletterForm.ctaText}
                      </a>
                    </div>
                  )}

                  {/* Email Footer */}
                  <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)] text-center text-[9px] text-[#888880] space-y-1">
                    <p>Nigeria Association of Computing Students (NACOS) — Bells Chapter</p>
                    <p className="text-[#555550]">Bells University of Technology, Ota, Ogun State</p>
                    <p className="text-[#444440]">You received this email because you subscribed on nacosbells.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Action Footer */}
          <div className="px-6 py-4 bg-[#161614] border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Send Test Email Input */}
            <form onSubmit={handleSendTestEmail} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email to test..."
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="px-3 py-1.5 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded placeholder-[#555550] focus:outline-none focus:border-[#2D7A22] w-full sm:w-64"
              />
              <button
                type="submit"
                disabled={testSubmitting}
                className="px-3 py-1.5 bg-[#1A1A17] hover:bg-white/[0.05] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.08)] text-xs font-medium rounded shrink-0 flex items-center gap-1.5"
              >
                {testSubmitting ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-send" />}
                Send Test
              </button>
            </form>

            {/* Final Broadcast Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1A1A17] hover:bg-white/[0.04] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs uppercase tracking-wider font-medium rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBroadcastNewsletter}
                disabled={broadcastSubmitting}
                className="px-5 py-2 bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2 shadow-lg shadow-[#2D7A22]/20"
              >
                {broadcastSubmitting ? (
                  <>
                    <i className="ti ti-loader-2 animate-spin text-sm" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <i className="ti ti-mail-forward text-sm" />
                    <span>Broadcast to All ({subscriberCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
