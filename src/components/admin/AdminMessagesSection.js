import React, { useState } from "react";

export default function AdminMessagesSection({
  messages,
  handleMarkRead,
  handleDeleteMessage,
}) {
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"
  const [expandedId, setExpandedId] = useState(null);

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return m.status === "unread";
    if (filter === "read") return m.status === "read";
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* Top Filter Strip */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === "all"
                ? "bg-[#2D7A22] text-white"
                : "bg-[#1A1A17] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === "unread"
                ? "bg-[#2D7A22] text-white"
                : "bg-[#1A1A17] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider transition-colors ${
              filter === "read"
                ? "bg-[#2D7A22] text-white"
                : "bg-[#1A1A17] text-[#888880] hover:text-white border border-[rgba(255,255,255,0.05)]"
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        <span className="text-[10px] text-[#888880]">
          Showing {filteredMessages.length} inquiry message(s)
        </span>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1A17]/20 rounded-lg border border-[rgba(255,255,255,0.05)]">
          <i className="ti ti-inbox text-3xl text-[#555550] mb-2 block" />
          <p className="text-[#888880] text-xs italic font-light">No messages in this folder.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isUnread = msg.status === "unread";
            const isExpanded = expandedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`border rounded-xl transition-all ${
                  isUnread
                    ? "bg-[#1A1A17]/80 border-[rgba(45,122,34,0.3)] shadow-lg shadow-black/20"
                    : "bg-[#1A1A17]/40 border-[rgba(255,255,255,0.05)]"
                }`}
              >
                {/* Message Header Item */}
                <div
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg.id);
                    if (isUnread) handleMarkRead(msg.id, "read");
                  }}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        isUnread ? "bg-[#2D7A22]/20 text-[#3A9C2D]" : "bg-white/5 text-[#888880]"
                      }`}
                    >
                      <i className="ti ti-mail" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-medium">{msg.name}</span>
                        {isUnread && (
                          <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                            New
                          </span>
                        )}
                        <span className="text-[10px] text-[#888880] font-light">({msg.email})</span>
                      </div>
                      <h4 className="text-white font-medium text-xs mt-0.5">{msg.subject || "General Inquiry"}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-[10px] text-[#888880]">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                    </span>
                    <i
                      className={`ti ti-chevron-${isExpanded ? "up" : "down"} text-xs text-[#888880] transition-transform`}
                    />
                  </div>
                </div>

                {/* Expanded Message Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[rgba(255,255,255,0.05)] mt-1 space-y-4">
                    <div className="p-4 bg-[#111110] border border-[rgba(255,255,255,0.05)] rounded-lg text-[#D0CDC6] text-xs leading-relaxed whitespace-pre-line font-light">
                      {msg.message}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Inquiry to NACOS Bells Chapter")}`}
                          className="px-4 py-1.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                        >
                          <i className="ti ti-mail-forward" />
                          Reply via Email
                        </a>
                        <button
                          type="button"
                          onClick={() => handleMarkRead(msg.id, isUnread ? "read" : "unread")}
                          className="px-3 py-1.5 bg-[#1A1A17] hover:bg-white/5 text-[#888880] hover:text-white border border-[rgba(255,255,255,0.07)] text-xs font-medium rounded transition-colors"
                        >
                          {isUnread ? "Mark as Read" : "Mark as Unread"}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-xs transition-colors flex items-center gap-1"
                      >
                        <i className="ti ti-trash" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
