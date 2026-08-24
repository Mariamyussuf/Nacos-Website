import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = ["Computer Sciences", "Information Technology", "Cyber Security"];
const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

export default function AdminResourcesSection({
  resources,
  resourceForm,
  setResourceForm,
  resourceFile,
  setResourceFile,
  showForm,
  editingItem,
  isSubmitting,
  handleSaveResource,
  handleResourceFileChange,
  startEdit,
  handleDelete,
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
              {editingItem ? "Edit Vault Resource" : "Upload New Past Question / Resource"}
            </h3>

            <form onSubmit={handleSaveResource} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Course Code</label>
                <input
                  type="text"
                  required
                  value={resourceForm.code}
                  onChange={(e) => setResourceForm({ ...resourceForm, code: e.target.value })}
                  placeholder="e.g. CSC 311"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Course Title</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  placeholder="e.g. Operating Systems"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Department</label>
                <select
                  value={resourceForm.dept}
                  onChange={(e) => setResourceForm({ ...resourceForm, dept: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Academic Level</label>
                <select
                  value={resourceForm.level}
                  onChange={(e) => setResourceForm({ ...resourceForm, level: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Semester</label>
                <select
                  value={resourceForm.semester}
                  onChange={(e) => setResourceForm({ ...resourceForm, semester: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Session Year</label>
                <input
                  type="text"
                  value={resourceForm.year}
                  onChange={(e) => setResourceForm({ ...resourceForm, year: e.target.value })}
                  placeholder="e.g. 2024/2025"
                  className="w-full px-4 py-2 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-white text-sm rounded-md focus:outline-none focus:border-[#2D7A22]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase text-[#888880] mb-1.5 tracking-wider">Upload Past Question (PDF)</label>
                <div className="p-4 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] rounded-md flex items-center justify-between">
                  {resourceFile || resourceForm.filePath ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <i className="ti ti-file-text text-[#2D7A22] text-xl" />
                        <div>
                          <div className="text-xs text-white font-medium">
                            {resourceFile ? resourceFile.name : resourceForm.filePath.split("/").pop()}
                          </div>
                          <div className="text-[10px] text-[#888880]">File Size: {resourceForm.size}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setResourceFile(null); setResourceForm({ ...resourceForm, filePath: "" }); }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded p-1.5 text-xs transition-colors"
                        title="Remove PDF"
                      >
                        <i className="ti ti-trash" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 w-full">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResourceFileChange}
                        className="text-xs text-[#888880] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2D7A22] file:text-[#F0EDE6] hover:file:bg-[#3A9C2D] file:cursor-pointer"
                      />
                      <span className="text-[10px] text-[#555550]">Select a PDF document (uploaded securely to backend server).</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] text-xs uppercase tracking-wider font-medium rounded-md flex items-center gap-2"
                >
                  {isSubmitting ? <i className="ti ti-loader-2 animate-spin text-sm" /> : null}
                  {editingItem ? "Save Changes" : "Upload Resource"}
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

      {/* Resource Records List */}
      {resources.length === 0 ? (
        <p className="text-[#888880] text-xs italic font-light text-center py-8">No resource files uploaded yet.</p>
      ) : (
        resources.map((res, idx) => (
          <div
            key={res.id || idx}
            className="flex justify-between items-center bg-[#1A1A17]/40 border border-[rgba(255,255,255,0.05)] rounded-lg p-4 hover:border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <div className="max-w-[70%]">
              <span className="text-[9px] uppercase tracking-wider text-[#2D7A22] bg-[#2D7A22]/10 border border-[#2D7A22]/20 px-2.5 py-0.5 rounded">
                {res.code}
              </span>
              <h4 className="text-white font-medium text-sm mt-2">{res.title}</h4>
              <p className="text-[10px] text-[#888880] mt-1 font-light">
                {res.dept} · {res.level} · {res.semester} · {res.size}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(res)}
                className="p-2 border border-[rgba(255,255,255,0.07)] hover:border-white/20 text-[#888880] hover:text-white rounded transition-colors text-xs"
                title="Edit"
              >
                <i className="ti ti-edit" />
              </button>
              <button
                onClick={() => handleDelete(res, idx)}
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
