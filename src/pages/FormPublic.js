import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicForm, submitForm } from "../components/api";

function PublicField({ field, value, onChange, onFileChange, error }) {
  const inputBase =
    "w-full bg-[rgba(255,255,255,0.04)] border rounded-xl px-4 py-3 text-[#F0EDE6] placeholder-[#444440] focus:outline-none transition-all text-sm " +
    (error
      ? "border-red-500/50 focus:border-red-400"
      : "border-[rgba(255,255,255,0.1)] focus:border-[#2D7A22]");

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          id={field.id}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={`${inputBase} resize-none`}
        />
      );

    case "select":
      return (
        <select
          id={field.id}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} bg-[#0E0E0C] appearance-none cursor-pointer`}
        >
          <option value="">Select an option…</option>
          {(field.options || []).map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2.5">
          {(field.options || []).map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                value === opt
                  ? "border-[#2D7A22] bg-[#2D7A22]"
                  : "border-[rgba(255,255,255,0.2)] group-hover:border-[#2D7A22]/50"
              }`}>
                {value === opt && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input type="radio" className="sr-only" name={field.id} value={opt}
                onChange={() => onChange(opt)} checked={value === opt} />
              <span className="text-sm text-[#C8C5BE]">{opt}</span>
            </label>
          ))}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2.5">
          {(field.options || []).map((opt, i) => {
            const checked = Array.isArray(value) && value.includes(opt);
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  checked
                    ? "border-[#2D7A22] bg-[#2D7A22]"
                    : "border-[rgba(255,255,255,0.2)] group-hover:border-[#2D7A22]/50"
                }`}>
                  {checked && <i className="ti ti-check text-white text-xs" />}
                </div>
                <input type="checkbox" className="sr-only"
                  checked={checked}
                  onChange={() => {
                    const current = Array.isArray(value) ? value : [];
                    onChange(checked ? current.filter(v => v !== opt) : [...current, opt]);
                  }}
                />
                <span className="text-sm text-[#C8C5BE]">{opt}</span>
              </label>
            );
          })}
        </div>
      );

    case "file":
      return (
        <div>
          <label
            htmlFor={field.id}
            className={`flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              error ? "border-red-500/40" : "border-[rgba(255,255,255,0.1)] hover:border-[#2D7A22]/50"
            } bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]`}
          >
            <i className="ti ti-upload text-xl text-[#555550]" />
            <span className="text-xs text-[#555550]">
              {value ? <span className="text-[#4ade80]"><i className="ti ti-file-check mr-1" />{typeof value === "object" ? value.name : "File selected"}</span>
               : `Click to upload${field.accept ? ` (${field.accept})` : ""}${field.maxFileSizeMb ? ` — max ${field.maxFileSizeMb}MB` : ""}`}
            </span>
            <input
              id={field.id}
              type="file"
              className="sr-only"
              accept={field.accept}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                if (field.maxFileSizeMb && file.size > field.maxFileSizeMb * 1024 * 1024) {
                  alert(`File too large. Max size is ${field.maxFileSizeMb}MB.`);
                  e.target.value = "";
                  return;
                }
                onFileChange(file);
              }}
            />
          </label>
        </div>
      );

    default:
      return (
        <input
          id={field.id}
          type={field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputBase}
        />
      );
  }
}

export default function FormPublic() {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [values, setValues] = useState({});
  const [fileValues, setFileValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const topRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPublicForm(slug);
        setForm(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const validate = () => {
    const errors = {};
    for (const field of form.fields || []) {
      if (!field.required) continue;
      if (field.type === "file") {
        if (!fileValues[field.id]) errors[field.id] = "This file is required";
      } else {
        const val = values[field.id];
        if (!val || (Array.isArray(val) && val.length === 0) || String(val).trim() === "") {
          errors[field.id] = "This field is required";
        }
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      await submitForm(form.id, values, fileValues);
      setSubmitted(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setSubmitError(err.message);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render states ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A08] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#888880]">
          <i className="ti ti-loader-2 animate-spin text-xl" />
          <span>Loading form…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A08] flex flex-col items-center justify-center px-4 text-center">
        <i className="ti ti-forms text-5xl text-[#333330] mb-4" />
        <h1 className="text-[#F0EDE6] font-display text-2xl font-semibold mb-2">Form Not Found</h1>
        <p className="text-[#555550] text-sm max-w-xs">{error}</p>
        <Link to="/" className="mt-6 text-[#2D7A22] hover:text-[#3a9e2c] text-sm flex items-center gap-1 transition-colors">
          <i className="ti ti-arrow-left" /> Back to NACOS
        </Link>
      </div>
    );
  }

  if (form?.status === "closed") {
    return (
      <div className="min-h-screen bg-[#0A0A08] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-5">
          <i className="ti ti-lock text-2xl text-[#555550]" />
        </div>
        <h1 className="text-[#F0EDE6] font-display text-2xl font-semibold mb-2">{form.title}</h1>
        <p className="text-[#555550] text-sm">This form is no longer accepting responses.</p>
        <Link to="/" className="mt-6 text-[#2D7A22] hover:text-[#3a9e2c] text-sm flex items-center gap-1 transition-colors">
          <i className="ti ti-arrow-left" /> Back to NACOS
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A08] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#2D7A22]/10 border border-[#2D7A22]/20 flex items-center justify-center mb-6 mx-auto">
            <i className="ti ti-circle-check text-4xl text-[#4ade80]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#2D7A22] flex items-center justify-center">
            <i className="ti ti-check text-white text-xs" />
          </div>
        </div>
        <h1 className="text-[#F0EDE6] font-display text-2xl font-semibold mb-2">Response Recorded!</h1>
        <p className="text-[#888880] text-sm max-w-sm">Thank you for completing <strong className="text-[#F0EDE6]">{form.title}</strong>. Your response has been saved.</p>
        <Link to="/" className="mt-8 px-6 py-3 bg-[#2D7A22] hover:bg-[#3a9e2c] text-white text-sm rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto">
          <i className="ti ti-home" /> Back to NACOS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A08] py-12 px-4" ref={topRef}>
      {/* NACOS watermark header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#444440] hover:text-[#888880] text-xs transition-colors">
          <i className="ti ti-arrow-left text-xs" />
          NACOS — Bells University
        </Link>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Form card */}
        <div className="bg-[#111110] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-2xl">
          {/* Form header */}
          <div className="bg-gradient-to-b from-[#2D7A22]/10 to-transparent border-b border-[rgba(255,255,255,0.07)] px-8 py-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#2D7A22]" />
              <span className="text-[9px] uppercase tracking-widest text-[#2D7A22] font-medium">NACOS Official Form</span>
            </div>
            <h1 className="text-[#F0EDE6] font-display text-xl font-semibold leading-tight">{form.title}</h1>
            {form.description && (
              <p className="text-[#888880] text-sm mt-2 leading-relaxed">{form.description}</p>
            )}
          </div>

          {/* Error banner */}
          {submitError && (
            <div className="mx-6 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <i className="ti ti-alert-circle text-red-400 text-sm mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{submitError}</p>
            </div>
          )}

          {/* Fields */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {(form.fields || []).map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-[#D0CEC8] mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <PublicField
                  field={field}
                  value={values[field.id]}
                  onChange={val => setValues(prev => ({ ...prev, [field.id]: val }))}
                  onFileChange={file => setFileValues(prev => ({ ...prev, [field.id]: file }))}
                  error={fieldErrors[field.id]}
                />
                {fieldErrors[field.id] && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <i className="ti ti-alert-circle" /> {fieldErrors[field.id]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#2D7A22] hover:bg-[#3a9e2c] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 shadow-lg shadow-[#2D7A22]/20 mt-2"
            >
              {submitting ? (
                <><i className="ti ti-loader-2 animate-spin" /> Submitting…</>
              ) : (
                <><i className="ti ti-send" /> Submit Response</>
              )}
            </button>

            <p className="text-center text-[10px] text-[#444440] pb-2">
              Your response is securely recorded by NACOS, Bells University
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
