import React, { useState, useRef } from "react";
const uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));

const FIELD_TYPES = [
  { type: "text", label: "Short Text", icon: "ti-forms", desc: "Single-line text input" },
  { type: "email", label: "Email", icon: "ti-mail", desc: "Email address field" },
  { type: "number", label: "Number", icon: "ti-number-123", desc: "Numeric input" },
  { type: "date", label: "Date", icon: "ti-calendar", desc: "Date picker" },
  { type: "textarea", label: "Long Text", icon: "ti-align-left", desc: "Multi-line text area" },
  { type: "select", label: "Dropdown", icon: "ti-selector", desc: "Choose from a list" },
  { type: "radio", label: "Multiple Choice", icon: "ti-circle-dot", desc: "Pick one option" },
  { type: "checkbox", label: "Checkboxes", icon: "ti-checkbox", desc: "Pick multiple options" },
  { type: "file", label: "File Upload", icon: "ti-upload", desc: "Allow file attachment" },
];

function FieldPill({ fieldType, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(fieldType)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0E0E0C] hover:bg-[#1a1a18] hover:border-[#2D7A22]/50 text-left transition-all group"
    >
      <div className="w-8 h-8 rounded-md bg-[#2D7A22]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2D7A22]/20 transition-colors">
        <i className={`ti ${fieldType.icon} text-[#2D7A22] text-sm`} />
      </div>
      <div className="min-w-0">
        <p className="text-[#F0EDE6] text-xs font-medium leading-tight">{fieldType.label}</p>
        <p className="text-[#555550] text-[10px] leading-tight truncate">{fieldType.desc}</p>
      </div>
    </button>
  );
}

function FieldEditor({ field, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [newOption, setNewOption] = useState("");
  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

  const addOption = () => {
    if (!newOption.trim()) return;
    onChange({ ...field, options: [...(field.options || []), newOption.trim()] });
    setNewOption("");
  };

  const removeOption = (idx) => {
    onChange({ ...field, options: field.options.filter((_, i) => i !== idx) });
  };

  return (
    <div className="border border-[rgba(255,255,255,0.08)] rounded-xl bg-[#111110] overflow-hidden group">
      {/* Field header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0E0E0C] border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2 min-w-0">
          <i className={`ti ${FIELD_TYPES.find(f => f.type === field.type)?.icon || "ti-forms"} text-[#2D7A22] text-sm shrink-0`} />
          <span className="text-[10px] uppercase tracking-widest text-[#2D7A22] font-medium">
            {FIELD_TYPES.find(f => f.type === field.type)?.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={isFirst}
            className="p-1.5 rounded text-[#555550] hover:text-white disabled:opacity-20 transition-colors">
            <i className="ti ti-chevron-up text-xs" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={isLast}
            className="p-1.5 rounded text-[#555550] hover:text-white disabled:opacity-20 transition-colors">
            <i className="ti ti-chevron-down text-xs" />
          </button>
          <button type="button" onClick={onDelete}
            className="p-1.5 rounded text-[#555550] hover:text-red-400 transition-colors ml-1">
            <i className="ti ti-trash text-xs" />
          </button>
        </div>
      </div>

      {/* Field settings */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Field Label *</label>
            <input
              value={field.label}
              onChange={e => onChange({ ...field, label: e.target.value })}
              placeholder="e.g. Full Name"
              className="w-full bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors"
            />
          </div>
          {field.type !== "file" && (
            <div>
              <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Placeholder</label>
              <input
                value={field.placeholder || ""}
                onChange={e => onChange({ ...field, placeholder: e.target.value })}
                placeholder="e.g. Enter your full name..."
                className="w-full bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors"
              />
            </div>
          )}
        </div>

        {/* File field settings */}
        {field.type === "file" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Accepted Types</label>
              <input
                value={field.accept || ""}
                onChange={e => onChange({ ...field, accept: e.target.value })}
                placeholder=".pdf,.jpg,.png"
                className="w-full bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Max Size (MB)</label>
              <input
                type="number"
                value={field.maxFileSizeMb || 10}
                min={1}
                max={10}
                onChange={e => onChange({ ...field, maxFileSizeMb: Number(e.target.value) })}
                className="w-full bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] focus:outline-none focus:border-[#2D7A22] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Options for select/radio/checkbox */}
        {hasOptions && (
          <div>
            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-2">Options</label>
            <div className="space-y-1.5 mb-2">
              {(field.options || []).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 shrink-0 rounded border border-[rgba(255,255,255,0.1)] bg-[#0A0A08] flex items-center justify-center text-[#555550]">
                    {field.type === "radio" ? <i className="ti ti-circle text-[9px]" /> :
                     field.type === "checkbox" ? <i className="ti ti-square text-[9px]" /> :
                     <i className="ti ti-grip-vertical text-[9px]" />}
                  </span>
                  <input
                    value={opt}
                    onChange={e => {
                      const opts = [...field.options];
                      opts[idx] = e.target.value;
                      onChange({ ...field, options: opts });
                    }}
                    className="flex-1 bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-sm text-[#F0EDE6] focus:outline-none focus:border-[#2D7A22] transition-colors"
                  />
                  <button type="button" onClick={() => removeOption(idx)}
                    className="text-[#555550] hover:text-red-400 transition-colors">
                    <i className="ti ti-x text-xs" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newOption}
                onChange={e => setNewOption(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addOption())}
                placeholder="Add an option..."
                className="flex-1 bg-[#0A0A08] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-1.5 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors"
              />
              <button type="button" onClick={addOption}
                className="px-3 py-1.5 bg-[#2D7A22]/15 border border-[#2D7A22]/30 text-[#2D7A22] rounded-lg text-xs hover:bg-[#2D7A22]/25 transition-colors">
                <i className="ti ti-plus" />
              </button>
            </div>
          </div>
        )}

        {/* Required toggle */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onChange({ ...field, required: !field.required })}
            className={`relative w-9 h-5 rounded-full transition-colors ${field.required ? "bg-[#2D7A22]" : "bg-[#333330]"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${field.required ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <span className="text-xs text-[#888880]">Required field</span>
        </div>
      </div>
    </div>
  );
}

export default function FormBuilderCanvas({ initialForm, onSave, onCancel, isSaving }) {
  const [meta, setMeta] = useState({
    title: initialForm?.title || "",
    description: initialForm?.description || "",
    slug: initialForm?.slug || "",
    status: initialForm?.status || "draft",
  });
  const [fields, setFields] = useState(initialForm?.fields || []);
  const canvasRef = useRef(null);

  const addField = (fieldType) => {
    const newField = {
      id: uuidv4(),
      type: fieldType.type,
      label: fieldType.label,
      placeholder: "",
      required: false,
      options: fieldType.type === "select" || fieldType.type === "radio" || fieldType.type === "checkbox"
        ? ["Option 1", "Option 2"]
        : undefined,
    };
    setFields(prev => [...prev, newField]);
    setTimeout(() => canvasRef.current?.scrollTo({ top: canvasRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const updateField = (idx, updatedField) => {
    setFields(prev => prev.map((f, i) => i === idx ? updatedField : f));
  };

  const deleteField = (idx) => {
    setFields(prev => prev.filter((_, i) => i !== idx));
  };

  const moveField = (idx, direction) => {
    setFields(prev => {
      const arr = [...prev];
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= arr.length) return arr;
      [arr[idx], arr[swapWith]] = [arr[swapWith], arr[idx]];
      return arr;
    });
  };

  const handleSave = (status) => {
    if (!meta.title.trim()) {
      alert("Please enter a form title before saving.");
      return;
    }
    onSave({ ...meta, status, fields });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Builder top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.07)] bg-[#0E0E0C] shrink-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel}
            className="flex items-center gap-2 text-[#888880] hover:text-white text-xs transition-colors">
            <i className="ti ti-arrow-left" />
            Back to Forms
          </button>
          <span className="text-[rgba(255,255,255,0.15)]">|</span>
          <span className="text-[#F0EDE6] text-sm font-medium truncate max-w-48">
            {meta.title || "Untitled Form"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSave("draft")} disabled={isSaving}
            className="px-3 py-1.5 text-xs border border-[rgba(255,255,255,0.1)] text-[#888880] rounded-lg hover:text-white transition-colors disabled:opacity-50">
            {isSaving ? <i className="ti ti-loader-2 animate-spin" /> : "Save Draft"}
          </button>
          <button type="button" onClick={() => handleSave("published")} disabled={isSaving}
            className="px-4 py-1.5 text-xs bg-[#2D7A22] text-white rounded-lg hover:bg-[#3a9e2c] transition-colors font-medium disabled:opacity-50">
            {isSaving ? <i className="ti ti-loader-2 animate-spin" /> : "Publish Form"}
          </button>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Field palette */}
        <div className="w-52 shrink-0 border-r border-[rgba(255,255,255,0.07)] bg-[#0A0A08] flex flex-col overflow-y-auto p-3 gap-1.5">
          <p className="text-[9px] uppercase tracking-widest text-[#555550] font-medium px-1 mb-1">
            <i className="ti ti-layout-list mr-1" />Add Field
          </p>
          {FIELD_TYPES.map(ft => (
            <FieldPill key={ft.type} fieldType={ft} onClick={addField} />
          ))}
        </div>

        {/* Centre: Canvas */}
        <div ref={canvasRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0A0A08]">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
              <i className="ti ti-layout-list text-3xl text-[#333330] mb-2" />
              <p className="text-[#555550] text-sm">Click a field type on the left to add it</p>
            </div>
          ) : (
            fields.map((field, idx) => (
              <FieldEditor
                key={field.id}
                field={field}
                onChange={updated => updateField(idx, updated)}
                onDelete={() => deleteField(idx)}
                onMoveUp={() => moveField(idx, "up")}
                onMoveDown={() => moveField(idx, "down")}
                isFirst={idx === 0}
                isLast={idx === fields.length - 1}
              />
            ))
          )}
        </div>

        {/* Right: Form metadata */}
        <div className="w-60 shrink-0 border-l border-[rgba(255,255,255,0.07)] bg-[#0A0A08] overflow-y-auto p-4 space-y-4">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-[#555550] font-medium mb-3">
              <i className="ti ti-settings mr-1" />Form Settings
            </p>

            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Form Title *</label>
            <input
              value={meta.title}
              onChange={e => setMeta(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Membership Application"
              className="w-full bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors mb-3"
            />

            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">URL Slug</label>
            <input
              value={meta.slug}
              onChange={e => setMeta(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
              placeholder="auto-generated"
              className="w-full bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] font-mono transition-colors mb-3"
            />

            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Description</label>
            <textarea
              value={meta.description}
              onChange={e => setMeta(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief description shown to respondents..."
              rows={3}
              className="w-full bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] placeholder-[#444440] focus:outline-none focus:border-[#2D7A22] transition-colors resize-none mb-3"
            />

            <label className="block text-[10px] text-[#888880] uppercase tracking-wider mb-1">Status</label>
            <select
              value={meta.status}
              onChange={e => setMeta(p => ({ ...p, status: e.target.value }))}
              className="w-full bg-[#111110] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm text-[#F0EDE6] focus:outline-none focus:border-[#2D7A22] transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4">
            <p className="text-[9px] uppercase tracking-widest text-[#555550] font-medium mb-2">
              <i className="ti ti-info-circle mr-1" />Summary
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666660]">Total fields</span>
                <span className="text-[#F0EDE6] font-medium">{fields.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666660]">Required</span>
                <span className="text-[#F0EDE6] font-medium">{fields.filter(f => f.required).length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666660]">File uploads</span>
                <span className="text-[#F0EDE6] font-medium">{fields.filter(f => f.type === "file").length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

