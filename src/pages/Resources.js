import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/Toast";

const DEPARTMENTS = [
  "Computer Sciences",
  "Information Technology",
  "Cyber Security",
];

const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

const PAST_QUESTIONS = [
  {
    code: "CSC 111",
    title: "Introduction to Computer Science",
    dept: "Computer Sciences",
    level: "100 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "1.2 MB",
  },
  {
    code: "CSC 122",
    title: "Introduction to Problem Solving",
    dept: "Computer Sciences",
    level: "100 Level",
    semester: "2nd Semester",
    year: "2023/2024",
    size: "850 KB",
  },
  {
    code: "CSC 211",
    title: "Data Structures & Algorithms",
    dept: "Computer Sciences",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "2.1 MB",
  },
  {
    code: "IFT 211",
    title: "Information Technology Fundamentals",
    dept: "Information Technology",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "1.5 MB",
  },
  {
    code: "CYB 211",
    title: "Introduction to Cybersecurity",
    dept: "Cyber Security",
    level: "200 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "2.1 MB",
  },
  {
    code: "CSC 311",
    title: "Object-Oriented Programming",
    dept: "Computer Sciences",
    level: "300 Level",
    semester: "1st Semester",
    year: "2023/2024",
    size: "1.8 MB",
  },
  {
    code: "CYB 322",
    title: "Cryptography & Network Security",
    dept: "Cyber Security",
    level: "300 Level",
    semester: "2nd Semester",
    year: "2024/2025",
    size: "3.4 MB",
  },
  {
    code: "IFT 411",
    title: "Enterprise Architecture & Cloud",
    dept: "Information Technology",
    level: "400 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "2.8 MB",
  },
  {
    code: "CSC 412",
    title: "Artificial Intelligence & Expert Systems",
    dept: "Computer Sciences",
    level: "400 Level",
    semester: "1st Semester",
    year: "2024/2025",
    size: "4.2 MB",
  },
];

const Folder = ({ name, itemCount, onClick, type = "dept" }) => (
  <motion.div
    className="relative pt-4 cursor-pointer select-none group"
    onClick={onClick}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
  >
    {/* Folder top tab */}
    <div className={`w-20 h-5 rounded-t-xl absolute top-0 left-4 transition-colors duration-300 ${
      type === "dept"
        ? "bg-[#2D7A22] group-hover:bg-[#3A9C2D]"
        : "bg-[#555550] group-hover:bg-[#888880]"
    }`} />
    
    {/* Folder main body */}
    <div className="bg-[#111110] border border-[rgba(255,255,255,0.07)] group-hover:border-[rgba(255,255,255,0.12)] rounded-xl rounded-tl-none p-6 shadow-xl relative z-10 transition-all duration-300 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
          type === "dept" ? "bg-[#2D7A22]/10 text-[#2D7A22]" : "bg-[#555550]/15 text-[#888880]"
        }`}>
          <i className={type === "dept" ? "ti ti-folder" : "ti ti-folder-open"} />
        </div>
        <div>
          <h4 className="text-white font-display font-medium text-base leading-tight">{name}</h4>
          <p className="text-[#888880] text-xs mt-1 font-light">{itemCount} Course Files</p>
        </div>
      </div>
      <i className={`ti ti-chevron-right text-[#555550] transition-transform duration-300 group-hover:translate-x-1 ${
        type === "dept" ? "group-hover:text-[#2D7A22]" : "group-hover:text-white"
      }`} />
    </div>
  </motion.div>
);

const Resources = () => {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState("pq"); // "pq" or "dues"
  
  // Folder navigation path: [] -> [dept] -> [dept, level]
  const [navPath, setNavPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [pastQuestionsList] = useState(() => {
    const saved = localStorage.getItem("past_questions");
    return saved ? JSON.parse(saved) : PAST_QUESTIONS;
  });

  const handleFolderClick = (node) => {
    setNavPath([...navPath, node]);
  };

  const handleDownload = (pq) => {
    if (pq.fileData) {
      try {
        const link = document.createElement("a");
        link.href = pq.fileData;
        link.download = `${pq.code.replace(/\s+/g, "_")}_${pq.title.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Downloading ${pq.code} PDF...`, "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to download PDF.", "error");
      }
    } else {
      showToast(`${pq.code} download coming soon — files are being uploaded!`, "info");
    }
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setNavPath([]);
    } else {
      setNavPath(navPath.slice(0, index + 1));
    }
  };

  // Helper to count files inside directories
  const countFiles = (dept, level = null) => {
    return pastQuestionsList.filter((pq) => {
      const matchDept = pq.dept === dept;
      const matchLevel = !level || pq.level === level;
      return matchDept && matchLevel;
    }).length;
  };

  // If searching, we display flat results bypassing folder hierarchy
  const isSearching = searchQuery.trim().length > 0;
  
  const searchedPQs = pastQuestionsList.filter((pq) =>
    pq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pq.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Files in current navigation folder
  const currentFiles = pastQuestionsList.filter((pq) => {
    if (navPath.length === 2) {
      return pq.dept === navPath[0] && pq.level === navPath[1];
    }
    return false;
  });

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen text-[#F0EDE6] relative selection:bg-[#2D7A22] selection:text-[#F0EDE6]">

      {/* ====== PAGE HEADER ====== */}
      <section className="relative py-20 z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] bg-white/[0.02] px-4 py-1.5 rounded-full text-[#888880] text-xs font-normal uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#2D7A22] rounded-full flex-shrink-0" />
            Portal Hub
          </motion.div>
          <motion.h1
            className="font-display font-medium text-5xl text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Student <span className="text-[#2D7A22]">Resources</span>
          </motion.h1>
          <motion.p
            className="text-[#888880] text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Explore the digital vault for computing past questions, academic resources, and departmental dues payments.
          </motion.p>
        </div>
      </section>

      {/* ====== TABS SECTION ====== */}
      <section className="relative z-10 py-8 max-w-7xl mx-auto px-6">
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => { setActiveTab("pq"); setSearchQuery(""); setNavPath([]); }}
            className={`px-6 py-3 rounded-full font-medium text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              activeTab === "pq"
                ? "bg-[#2D7A22] border-transparent text-[#F0EDE6] scale-102"
                : "bg-white/[0.02] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
            }`}
          >
            <i className="ti ti-books text-sm" /> Past Questions
          </button>
          <button
            onClick={() => setActiveTab("dues")}
            className={`px-6 py-3 rounded-full font-medium text-xs uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              activeTab === "dues"
                ? "bg-[#2D7A22] border-transparent text-[#F0EDE6] scale-102"
                : "bg-white/[0.02] border-[rgba(255,255,255,0.07)] text-[#888880] hover:text-white"
            }`}
          >
            <i className="ti ti-credit-card text-sm" /> Pay Association Dues
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "pq" ? (
            <motion.div
              key="pq"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search bar */}
              <div className="max-w-2xl mx-auto mb-10">
                <div className="relative">
                  <i className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-[#555550] text-lg" />
                  <input
                    type="text"
                    placeholder="Search past questions instantly (e.g. CSC 311, OOP)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-5 py-3.5 rounded-md bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] text-[#F0EDE6] placeholder-[#555550] text-sm focus:outline-none focus:border-[#2D7A22]/40 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555550] hover:text-white"
                    >
                      <i className="ti ti-x" />
                    </button>
                  )}
                </div>
              </div>

              {isSearching ? (
                /* Flat Search Results View */
                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-6 flex items-center gap-2">
                    <i className="ti ti-search text-[#2D7A22]" />
                    Search Results for "{searchQuery}"
                  </h3>
                  
                  {searchedPQs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchedPQs.map((pq, index) => (
                        <motion.div
                          key={index}
                          className="card p-6 flex flex-col justify-between group relative overflow-hidden"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#2D7A22]/50" />
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-xs font-medium uppercase bg-[#2D7A22]/10 text-[#2D7A22] border border-[#2D7A22]/20 px-2.5 py-1 rounded-md">
                                {pq.code}
                              </span>
                              <span className="text-[10px] text-[#888880] font-normal uppercase">{pq.year}</span>
                            </div>
                            <h3 className="font-display font-medium text-white text-base mb-2 group-hover:text-[#2D7A22] transition-colors">
                              {pq.title}
                            </h3>
                            <p className="text-[#888880] text-xs mb-4">{pq.dept}</p>
                            <div className="flex gap-2 mb-6">
                              <span className="text-[9px] bg-white/[0.02] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded text-[#888880] font-normal">{pq.level}</span>
                              <span className="text-[9px] bg-white/[0.02] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded text-[#888880] font-normal">{pq.semester}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownload(pq)}
                            className="w-full py-2.5 rounded-md bg-[#1A1A17] hover:bg-[#2D7A22] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)] hover:border-transparent text-[#888880] hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
                          >
                            <i className="ti ti-download text-sm" /> Download PDF ({pq.size})
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl">
                      <i className="ti ti-folder-off text-4xl text-[#555550] mb-4 block" />
                      <p className="text-[#888880] text-sm font-light">No match found. Try a different course code.</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Folders Explorers UI */
                <div>
                  {/* Breadcrumb navigator */}
                  <div className="flex items-center gap-2 mb-8 bg-[#111110] border border-[rgba(255,255,255,0.07)] px-5 py-3 rounded-md w-max max-w-full text-xs font-normal">
                    <button
                      onClick={() => handleBreadcrumbClick(-1)}
                      className="text-[#888880] hover:text-white flex items-center gap-1.5"
                    >
                      <i className="ti ti-home" /> Vault
                    </button>
                    {navPath.map((node, index) => (
                      <React.Fragment key={index}>
                        <span className="text-[#555550]">/</span>
                        <button
                          onClick={() => handleBreadcrumbClick(index)}
                          className={`hover:text-white ${
                            index === navPath.length - 1 ? "text-[#2D7A22]" : "text-[#888880]"
                          }`}
                        >
                          {node}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {navPath.length === 0 ? (
                      /* Root level: Department Folders */
                      <motion.div
                        key="root-folders"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid md:grid-cols-3 gap-6"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <Folder
                            key={dept}
                            name={dept}
                            itemCount={countFiles(dept)}
                            onClick={() => handleFolderClick(dept)}
                            type="dept"
                          />
                        ))}
                      </motion.div>
                    ) : navPath.length === 1 ? (
                      /* Level Selection Folders */
                      <motion.div
                        key="level-folders"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid md:grid-cols-4 gap-6"
                      >
                        {LEVELS.map((lvl) => (
                          <Folder
                            key={lvl}
                            name={lvl}
                            itemCount={countFiles(navPath[0], lvl)}
                            onClick={() => handleFolderClick(lvl)}
                            type="lvl"
                          />
                        ))}
                      </motion.div>
                    ) : (
                      /* File View: List of PDFs */
                      <motion.div
                        key="files-list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {currentFiles.length > 0 ? (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentFiles.map((pq, index) => (
                              <div
                                key={index}
                                className="card p-6 flex flex-col justify-between group relative overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#2D7A22]/50" />
                                <div>
                                  <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-medium uppercase bg-[#2D7A22]/10 text-[#2D7A22] border border-[#2D7A22]/20 px-2.5 py-1 rounded-md">
                                      {pq.code}
                                    </span>
                                    <span className="text-[10px] text-[#888880] font-normal uppercase">{pq.year}</span>
                                  </div>
                                  <h3 className="font-display font-medium text-white text-base mb-2 group-hover:text-[#2D7A22] transition-colors">
                                    {pq.title}
                                  </h3>
                                  <p className="text-[#888880] text-xs mb-4">{pq.dept}</p>
                                  <div className="flex gap-2 mb-6">
                                    <span className="text-[9px] bg-white/[0.02] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded text-[#888880] font-normal">{pq.level}</span>
                                    <span className="text-[9px] bg-white/[0.02] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded text-[#888880] font-normal">{pq.semester}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDownload(pq)}
                                  className="w-full py-2.5 rounded-md bg-[#1A1A17] hover:bg-[#2D7A22] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)] hover:border-transparent text-[#888880] hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
                                >
                                  <i className="ti ti-download text-sm" /> Download PDF ({pq.size})
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-20 bg-[#111110] border border-[rgba(255,255,255,0.07)] rounded-xl">
                            <i className="ti ti-folder-off text-4xl text-[#555550] mb-4 block" />
                            <p className="text-[#888880] text-sm font-light">No questions uploaded for this folder yet.</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dues"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-display font-medium text-white mb-2">Student Dues Payment</h2>
                <p className="text-[#888880] text-sm max-w-md mx-auto font-light">
                  Process official payments for your departmental and college representative dues.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* NACOS Due Card */}
                <motion.div
                  className="card p-8 relative overflow-hidden group flex flex-col justify-between"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#2D7A22]" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="nacos-badge">Sessionly Due</span>
                      <i className="ti ti-award text-[#2D7A22] text-2xl" />
                    </div>

                    <h3 className="font-display font-medium text-white text-2xl mb-1">NACOS Dues</h3>
                    <p className="text-[#888880] text-xs mb-4">Official Departmental Association dues</p>
                    
                    <div className="my-6">
                      <span className="text-4xl font-display font-medium text-white">₦8,500</span>
                      <span className="text-[#555550] text-xs font-normal ml-2">/ Academic Session</span>
                    </div>

                    <ul className="space-y-2.5 mb-8 text-xs text-[#888880] font-light">
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#2D7A22]" /> Covers all departmental student services</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#2D7A22]" /> Required for Tech Fest event registration</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#2D7A22]" /> Grants access to code libraries and labs</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#2D7A22]" /> Valid for both semesters of the session</li>
                    </ul>
                  </div>

                  <a
                    href="https://payment.bellsuniversity.edu.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3.5 rounded-md bg-[#2D7A22] hover:bg-[#3A9C2D] text-[#F0EDE6] font-medium text-sm transition-all duration-300 block"
                  >
                    Pay NACOS Dues Now →
                  </a>
                </motion.div>

                {/* College Due Card */}
                <motion.div
                  className="card p-8 relative overflow-hidden group flex flex-col justify-between"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#555550]" />
                  
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="gold-badge">Semester Due</span>
                      <i className="ti ti-building-columns text-[#888880] text-2xl" />
                    </div>

                    <h3 className="font-display font-medium text-white text-2xl mb-1">COLCOMP College Dues</h3>
                    <p className="text-[#888880] text-xs mb-4">College of Computing representative dues</p>
                    
                    <div className="my-6">
                      <span className="text-4xl font-display font-medium text-white">₦10,000</span>
                      <span className="text-[#555550] text-xs font-normal ml-2">/ Semester</span>
                    </div>

                    <ul className="space-y-2.5 mb-8 text-xs text-[#888880] font-light">
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#888880]" /> College student council representative fee</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#888880]" /> Required for examination clearance</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#888880]" /> Funds college-level research and contests</li>
                      <li className="flex items-center gap-2"><i className="ti ti-check text-[#888880]" /> Paid each semester individually</li>
                    </ul>
                  </div>

                  <a
                    href="https://payment.bellsuniversity.edu.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3.5 rounded-md bg-[#1A1A17] hover:bg-[#1A1A17]/80 text-[#888880] hover:text-[#F0EDE6] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] font-medium text-sm transition-all duration-300 block"
                  >
                    Pay College Dues Now →
                  </a>
                </motion.div>
              </div>

              {/* Extra Notice */}
              <div className="max-w-4xl mx-auto mt-12 bg-white/[0.02] border border-[rgba(255,255,255,0.07)] rounded-xl p-6 text-center">
                <i className="ti ti-info-circle text-[#2D7A22] text-xl mb-2 block" />
                <p className="text-[#888880] text-xs leading-relaxed font-light">
                  Please keep your payment receipts securely. Receipts are required to generate clearance slips 
                  for final exams and to register for physical certification workshops. For support, contact the welfare secretary.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default Resources;
