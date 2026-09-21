import React, { useState, useEffect, useCallback } from "react";
import { getFormSubmissions, BACKEND_URL } from "../api";

function exportCSV(form, submissions) {
  if (!submissions.length) return;
  const fields = form.fields || [];
  const headers = ["Submission #", "Submitted At", ...fields.map(f => f.label)];
  const rows = submissions.map((sub, idx) => [
    idx + 1,
    sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "",
    ...fields.map(f => {
      const val = sub.data[f.id];
      if (Array.isArray(val)) return val.join("; ");
      return val ?? "";
    }),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", `${form.slug || form.id}_responses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function FormResponsesModal({ form, isOpen, onClose }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const loadSubmissions = useCallback(async () => {
    if (!form?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFormSubmissions(form.id);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [form?.id]);

  useEffect(() => {
    if (isOpen) loadSubmissions();
    else { setSubmissions([]); setExpandedRow(null); }
  }, [isOpen, loadSubmissions]);

  if (!isOpen) return null;

  const fields = form?.fields || [];

  const renderValue = (field, value) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-[#444440] italic">—</span>;
    }
    if (field.type === "file") {
      const url = String(value).startsWith("/") ? `${BACKEND_URL}${value}` : value;
      return (
        <a href={url} target="_blank" rel="noreferrer"
          className="text-[#2D7A22] hover:text-[#3a9e2c] underline text-xs flex items-center gap-1 transition-colors">
          <i className="ti ti-paperclip" /> View file
        </a>
      );
    }
    if (Array.isArray(value)) return <span>{value.join(", ")}</span>;
    return <span>{String(value)}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.07)] shrink-0">
          <div>
            <h2 className="text-[#F0EDE6] font-display font-semibold text-base">{form?.title}</h2>
            <p className="text-[#555550] text-xs mt-0.5">
              {loading ? "Loading..." : `${submissions.length} response${submissions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportCSV(form, submissions)}
              disabled={!submissions.length}
              className="flex items-center gap-2 px-3 py-2 text-xs border border-[rgba(255,255,255,0.1)] text-[#888880] hover:text-white rounded-lg transition-colors disabled:opacity-30"
            >
              <i className="ti ti-download" /> Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#888880] hover:text-white transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
            >
              <i className="ti ti-x" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-48 text-[#888880]">
              <i className="ti ti-loader-2 animate-spin text-xl mr-2" /> Loading responses...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-48 text-red-400 text-sm">
              <i className="ti ti-alert-circle mr-2" /> {error}
            </div>
          )}
          {!loading && !error && submissions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <i className="ti ti-inbox text-3xl text-[#333330] mb-2" />
              <p className="text-[#555550] text-sm">No responses yet</p>
              <p className="text-[#444440] text-xs mt-1">Share the form link to start collecting responses.</p>
            </div>
          )}
          {!loading && !error && submissions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0E0E0C] border-b border-[rgba(255,255,255,0.07)]">
                    <th className="text-left px-4 py-3 text-[#555550] font-medium whitespace-nowrap">#</th>
                    <th className="text-left px-4 py-3 text-[#555550] font-medium whitespace-nowrap">Submitted</th>
                    {fields.slice(0, 4).map(f => (
                      <th key={f.id} className="text-left px-4 py-3 text-[#555550] font-medium whitespace-nowrap max-w-40 truncate">
                        {f.label}
                      </th>
                    ))}
                    {fields.length > 4 && (
                      <th className="text-left px-4 py-3 text-[#555550] font-medium">+{fields.length - 4} more</th>
                    )}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <React.Fragment key={sub.id}>
                      <tr
                        onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                        className={`border-b border-[rgba(255,255,255,0.04)] cursor-pointer transition-colors ${
                          expandedRow === idx ? "bg-[#161614]" : "hover:bg-[#0E0E0C]"
                        }`}
                      >
                        <td className="px-4 py-3 text-[#555550]">{idx + 1}</td>
                        <td className="px-4 py-3 text-[#888880] whitespace-nowrap">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "—"}
                        </td>
                        {fields.slice(0, 4).map(f => (
                          <td key={f.id} className="px-4 py-3 text-[#F0EDE6] max-w-40 truncate">
                            {renderValue(f, sub.data?.[f.id])}
                          </td>
                        ))}
                        {fields.length > 4 && <td className="px-4 py-3 text-[#555550]">…</td>}
                        <td className="px-4 py-3 text-[#555550]">
                          <i className={`ti ${expandedRow === idx ? "ti-chevron-up" : "ti-chevron-down"}`} />
                        </td>
                      </tr>
                      {expandedRow === idx && (
                        <tr className="bg-[#0A0A08]">
                          <td colSpan={fields.length + 4} className="px-6 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {fields.map(f => (
                                <div key={f.id} className="border border-[rgba(255,255,255,0.07)] rounded-lg p-3 bg-[#111110]">
                                  <p className="text-[9px] uppercase tracking-widest text-[#555550] mb-1.5">{f.label}</p>
                                  <div className="text-sm text-[#F0EDE6] break-words">
                                    {renderValue(f, sub.data?.[f.id])}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
