
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../Toast";
import { getForms, createForm, updateForm, deleteForm, BACKEND_URL } from "../api";
import FormBuilderCanvas from "./FormBuilderCanvas";
import FormResponsesModal from "./FormResponsesModal";

const STATUS_STYLES = {
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  published: "bg-[#2D7A22]/10 text-[#4ade80] border-[#2D7A22]/30",
  closed: "bg-[rgba(255,255,255,0.04)] text-[#555550] border-[rgba(255,255,255,0.08)]",
};

const STATUS_ICONS = {
  draft: "ti-pencil",
  published: "ti-world",
  closed: "ti-lock",
};

function FormCard({ form, onEdit, onViewResponses, onDelete, onCopyLink, onToggleStatus }) {
  return (
    <div className="border border-[rgba(255,255,255,0.07)] bg-[#111110] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.12)] transition-all group">
      <div className="p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[#F0EDE6] font-medium text-sm leading-tight truncate">{form.title}</h3>
            {form.description && (
              <p className="text-[#555550] text-xs mt-1 line-clamp-2">{form.description}</p>
            )}
          </div>
          <span className={`shrink-0 px-2 py-1 rounded-md text-[9px] uppercase tracking-widest font-medium border ${STATUS_STYLES[form.status] || STATUS_STYLES.draft}`}>
            <i className={`ti ${STATUS_ICONS[form.status] || "ti-pencil"} mr-1`} />{form.status}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-[#555550] mb-4">
          <span><i className="ti ti-layout-list mr-1" />{(form.fields || []).length} fields</span>
          <span><i className="ti ti-inbox mr-1" />{form.submissionCount || 0} responses</span>
          <span className="font-mono truncate text-[#444440]">/{form.slug}</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onEdit(form)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1a1a18] border border-[rgba(255,255,255,0.07)] text-[#888880] rounded-lg hover:text-white transition-colors"
          >
            <i className="ti ti-edit text-xs" /> Edit
          </button>
          <button
            onClick={() => onViewResponses(form)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1a1a18] border border-[rgba(255,255,255,0.07)] text-[#888880] rounded-lg hover:text-white transition-colors"
          >
            <i className="ti ti-table text-xs" /> Responses
            {form.submissionCount > 0 && (
              <span className="px-1.5 py-0.5 bg-[#2D7A22] text-white text-[9px] rounded-full font-bold">
                {form.submissionCount}
              </span>
            )}
          </button>
          {form.status === "published" && (
            <button
              onClick={() => onCopyLink(form)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#2D7A22]/10 border border-[#2D7A22]/20 text-[#4ade80] rounded-lg hover:bg-[#2D7A22]/20 transition-colors"
            >
              <i className="ti ti-link text-xs" /> Copy Link
            </button>
          )}
          {form.status === "published" && (
            <button
              onClick={() => onToggleStatus(form, "closed")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#666660] rounded-lg hover:text-amber-400 transition-colors"
            >
              <i className="ti ti-lock text-xs" /> Close
            </button>
          )}
          {form.status === "closed" && (
            <button
              onClick={() => onToggleStatus(form, "published")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#666660] rounded-lg hover:text-[#4ade80] transition-colors"
            >
              <i className="ti ti-world text-xs" /> Re-publish
            </button>
          )}
          <button
            onClick={() => onDelete(form)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#444440] hover:text-red-400 transition-colors ml-auto"
          >
            <i className="ti ti-trash text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminFormsSection() {
  const showToast = useToast();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // "list" | "builder"
  const [editingForm, setEditingForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [responsesForm, setResponsesForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadForms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getForms();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(`Failed to load forms: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const handleCreateNew = () => {
    setEditingForm(null);
    setViewMode("builder");
  };

  const handleEdit = (form) => {
    setEditingForm(form);
    setViewMode("builder");
  };

  const handleSave = async ({ title, slug, description, status, fields }) => {
    setIsSaving(true);
    try {
      if (editingForm?.id) {
        await updateForm(editingForm.id, { title, slug, description, status, fields });
        showToast(`Form "${title}" updated successfully!`, "success");
      } else {
        await createForm({ title, slug, description, status, fields });
        showToast(`Form "${title}" ${status === "published" ? "published" : "saved as draft"}!`, "success");
      }
      await loadForms();
      setViewMode("list");
      setEditingForm(null);
    } catch (err) {
      showToast(`Error saving form: ${err.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (form) => {
    if (!window.confirm(`Delete "${form.title}" and ALL its responses? This cannot be undone.`)) return;
    try {
      await deleteForm(form.id);
      showToast("Form deleted", "success");
      setForms(prev => prev.filter(f => f.id !== form.id));
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  const handleCopyLink = (form) => {
    const url = `${window.location.origin}/forms/${form.slug}`;
    navigator.clipboard.writeText(url);
    showToast(`Link copied: ${url}`, "success");
  };

  const handleToggleStatus = async (form, newStatus) => {
    try {
      await updateForm(form.id, { status: newStatus });
      showToast(`Form ${newStatus === "published" ? "re-published" : "closed"}`, "info");
      loadForms();
    } catch (err) {
      showToast(`Failed: ${err.message}`, "error");
    }
  };

  const filteredForms = forms.filter(f =>
    !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Builder view ────────────────────────────────────────────────────────────

  if (viewMode === "builder") {
    return (
      <div className="flex flex-col h-[calc(100vh-5rem)] -mx-4 sm:-mx-6 overflow-hidden">
        <FormBuilderCanvas
          initialForm={editingForm}
          onSave={handleSave}
          onCancel={() => { setViewMode("list"); setEditingForm(null); }}
          isSaving={isSaving}
        />
      </div>
    );
  }

  // ── List view ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Responses modal */}
      <FormResponsesModal
        form={responsesForm}
        isOpen={Boolean(responsesForm)}
        onClose={() => setResponsesForm(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[#F0EDE6] font-display font-semibold text-lg">Form Builder</h2>
          <p className="text-[#555550] text-xs mt-0.5">Create and manage custom forms — surveys, applications, feedback and more.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2D7A22] text-white text-sm rounded-xl hover:bg-[#3a9e2c] transition-colors font-medium shadow-lg shadow-[#2D7A22]/20"
        >
          <i className="ti ti-plus" /> New Form
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Forms", value: forms.length, icon: "ti-layout-list", color: "text-[#888880]" },
          { label: "Published", value: forms.filter(f => f.status === "published").length, icon: "ti-world", color: "text-[#4ade80]" },
          { label: "Responses", value: forms.reduce((acc, f) => acc + (f.submissionCount || 0), 0), icon: "ti-inbox", color: "text-amber-400" },
        ].map(stat => (
          <div key={stat.label} className="border border-[rgba(255,255,255,0.07)] bg-[#111110] rounded-xl p-4 text-center">
            <i className={`ti ${stat.icon} text-xl ${stat.color} mb-1 block`} />
            <p className="text-[#F0EDE6] text-xl font-semibold font-display">{stat.value}</p>
            <p className="text-[#555550] text-[10px] uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[#555550]" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search forms..."
          className="w-full bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22]/50 transition-colors"
        />
      </div>

      {/* Forms grid */}
      {loading ? (
        <div className="flex items-center justify-center h-36 text-[#888880]">
          <i className="ti ti-loader-2 animate-spin text-xl mr-2" /> Loading forms...
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[rgba(255,255,255,0.07)] rounded-xl text-center">
          <i className="ti ti-forms text-4xl text-[#333330] mb-3" />
          <p className="text-[#555550] text-sm">
            {searchQuery ? "No forms match your search" : "No forms yet"}
          </p>
          {!searchQuery && (
            <button onClick={handleCreateNew}
              className="mt-3 text-[#2D7A22] hover:text-[#3a9e2c] text-xs flex items-center gap-1 transition-colors">
              <i className="ti ti-plus" /> Create your first form
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredForms.map(form => (
            <FormCard
              key={form.id}
              form={form}
              onEdit={handleEdit}
              onViewResponses={setResponsesForm}
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
