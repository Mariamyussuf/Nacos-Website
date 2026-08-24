import React from "react";

export default function AdminSidebar({
  adminUser,
  handleLogout,
  activeSection,
  setActiveSection,
  resetForms,
  unreadMessagesCount = 0,
}) {
  const navItems = [
    { id: "blogs", label: "Manage Blogs", icon: "ti ti-news" },
    { id: "events", label: "Manage Events", icon: "ti ti-calendar-event" },
    { id: "resources", label: "Manage Resources", icon: "ti ti-books" },
    { id: "banner", label: "Site Banner", icon: "ti ti-speakerphone" },
    { id: "subscribers", label: "Newsletter Studio", icon: "ti ti-mail" },
    {
      id: "messages",
      label: "Inquiries & Inbox",
      icon: "ti ti-inbox",
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
      <div className="p-4 border border-[rgba(255,255,255,0.07)] bg-[#111110] rounded-xl mb-2 sm:mb-4 text-center relative overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-[#2D7A22]/15 text-[#2D7A22] flex items-center justify-center mx-auto mb-2 font-medium text-sm">
          {adminUser?.username?.[0]?.toUpperCase() || "A"}
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#888880] block mb-0.5">Logged in as</span>
        <h2 className="text-white font-display font-medium text-sm">{adminUser?.username || "Admin"}</h2>
        <button
          onClick={handleLogout}
          className="mt-3 text-[10px] text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <i className="ti ti-logout text-xs" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-1 gap-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                resetForms();
              }}
              className={`w-full px-4 sm:px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-medium text-left border flex items-center justify-between transition-colors ${
                isActive
                  ? "bg-[#2D7A22] border-transparent text-[#F0EDE6]"
                  : "bg-[#111110] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`${item.icon} text-base`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

