import React from "react";

export default function AdminSubscribersSection({
  subscribers,
  campaigns,
}) {
  return (
    <div className="space-y-8">
      {/* Subscribers List Section */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-[#888880] font-medium mb-3">
          Registered Subscribers ({subscribers.length})
        </h3>
        {subscribers.length === 0 ? (
          <div className="text-center py-10 bg-[#1A1A17]/20 rounded-lg border border-[rgba(255,255,255,0.05)]">
            <i className="ti ti-mail text-3xl text-[#555550] mb-2 block" />
            <p className="text-[#888880] text-xs italic font-light">No subscribers found in database.</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-lg overflow-hidden bg-[#1A1A17]/30 max-h-72 overflow-y-auto">
            {subscribers.map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="flex justify-between items-center py-3 px-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#2D7A22]/10 text-[#2D7A22] flex items-center justify-center text-xs">
                    <i className="ti ti-user" />
                  </div>
                  <div>
                    <span className="text-white text-xs font-medium">{sub.email}</span>
                    {sub.createdAt && (
                      <p className="text-[10px] text-[#888880] font-light">
                        Subscribed on {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Campaigns History */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-[#888880] font-medium mb-3">
          Broadcast History ({campaigns.length})
        </h3>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 bg-[#1A1A17]/10 rounded-lg border border-[rgba(255,255,255,0.04)]">
            <p className="text-[#888880] text-xs italic font-light">
              No promotional broadcast campaigns dispatched yet. Click "Broadcast Email" above to launch one.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#2D7A22]/10 text-[#2D7A22] border border-[#2D7A22]/20 font-medium">
                      {camp.eyebrow || camp.template}
                    </span>
                    <span className="text-[10px] text-[#888880]">
                      {camp.createdAt ? new Date(camp.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <h4 className="text-white text-xs font-medium">{camp.subject}</h4>
                  <p className="text-[10px] text-[#888880] mt-0.5 line-clamp-1">{camp.headline}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#888880] block">Delivered to</span>
                  <span className="text-xs text-white font-medium">{camp.recipientCount || 0} recipients</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
