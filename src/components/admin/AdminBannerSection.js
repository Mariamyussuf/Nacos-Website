import React from "react";

export default function AdminBannerSection({
  bannerForm,
  setBannerForm,
  handleSaveBanner,
  bannerSaving,
}) {
  return (
    <div className="space-y-8">
      {/* Live Preview Card */}
      <div className="bg-[#161614] border border-[rgba(255,255,255,0.07)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-wider text-[#888880] font-medium flex items-center gap-1.5">
            <i className="ti ti-eye text-xs text-[#2D7A22]" /> Live Header Banner Preview
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${bannerForm.enabled ? "bg-[#2D7A22]/15 text-[#2D7A22]" : "bg-red-500/10 text-red-400"}`}>
            {bannerForm.enabled ? "Active on Website" : "Hidden (Disabled)"}
          </span>
        </div>

        <div className={`p-3 rounded-lg border flex items-center justify-center gap-2 text-center text-xs ${
          bannerForm.accentColor === "green" ? "bg-[#2D7A22]/5 border-[#2D7A22]/30" :
          bannerForm.accentColor === "amber" ? "bg-amber-500/5 border-amber-500/30" :
          bannerForm.accentColor === "cyan" ? "bg-cyan-500/5 border-cyan-500/30" :
          "bg-rose-500/5 border-rose-500/30"
        }`}>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
            bannerForm.accentColor === "green" ? "bg-[#2D7A22]" :
            bannerForm.accentColor === "amber" ? "bg-amber-400" :
            bannerForm.accentColor === "cyan" ? "bg-cyan-400" :
            "bg-rose-400"
          }`} />
          <span className="text-[#888880]">
            {bannerForm.badge && <strong className="text-white font-medium mr-1">{bannerForm.badge}</strong>}
            <span>{bannerForm.text}</span>
            {bannerForm.linkText && (
              <span className={`font-medium underline ml-1.5 ${
                bannerForm.accentColor === "green" ? "text-[#2D7A22]" :
                bannerForm.accentColor === "amber" ? "text-amber-400" :
                bannerForm.accentColor === "cyan" ? "text-cyan-400" :
                "text-rose-400"
              }`}>
                {bannerForm.linkText}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Banner Editor Form */}
      <form onSubmit={handleSaveBanner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 flex items-center justify-between p-4 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] rounded-lg">
          <div>
            <h4 className="text-white text-xs font-medium uppercase tracking-wider">Enable Announcement Banner</h4>
            <p className="text-[10px] text-[#888880] mt-0.5">Toggle banner display on top of all pages across the website.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bannerForm.enabled}
              onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#222220] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7A22]"></div>
          </label>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Highlight Badge / Title</label>
          <input
            type="text"
            value={bannerForm.badge}
            onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
            placeholder="e.g. NACOS Tech Fest '26"
            className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Accent Theme Color</label>
          <select
            value={bannerForm.accentColor}
            onChange={(e) => setBannerForm({ ...bannerForm, accentColor: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
          >
            <option value="green">Emerald Green (Default)</option>
            <option value="amber">Electric Amber (Urgent / Hackathons)</option>
            <option value="cyan">Tech Cyan (Announcements)</option>
            <option value="coral">Alert Coral (Deadlines / Exams)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Announcement Message</label>
          <input
            type="text"
            required
            value={bannerForm.text}
            onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
            placeholder="e.g. — July 12–16, Main Auditorium."
            className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Button / Link Text</label>
          <input
            type="text"
            value={bannerForm.linkText}
            onChange={(e) => setBannerForm({ ...bannerForm, linkText: e.target.value })}
            placeholder="e.g. Register Now →"
            className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Target Link URL</label>
          <input
            type="text"
            value={bannerForm.linkUrl}
            onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
            placeholder="e.g. /events or https://..."
            className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-xs rounded-md focus:outline-none focus:border-[#2D7A22]"
          />
        </div>

        <div className="sm:col-span-2 flex gap-3 mt-4">
          <button
            type="submit"
            disabled={bannerSaving}
            className="px-6 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
          >
            {bannerSaving ? <i className="ti ti-loader-2 animate-spin text-sm" /> : <i className="ti ti-check text-sm" />}
            Save & Publish Banner
          </button>
        </div>
      </form>
    </div>
  );
}
