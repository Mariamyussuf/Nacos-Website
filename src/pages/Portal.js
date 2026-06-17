import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

// Image compression helper using Canvas
const compressImage = (base64Str) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
  });
};

const Portal = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [student, setStudent] = useState(null);

  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PGNpcmNsZSBjeD0iMTI4IiBjeT0iOTYiIHI9IjY0IiBmaWxsPSIjMWExYTE3Ii8+PHBhdGggZmlsbD0iIzFhMWExNyIgZD0iTTAsIDE5MiBDMCwgMTYwIDk2LCAxNDQgMTI4LCAxNDQgQzE2MCwgMTQ0IDI1NiwgMTYwIDI1NiwgMTkyIEwyNTYsIDI1NiBMMCwgMjU2IFoiLz48L3N2Zz4=";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) {
      navigate("/login");
      return;
    }

    try {
      setStudent(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawBase64 = event.target.result;
      try {
        const compressed = await compressImage(rawBase64);
        const updatedStudent = { ...student, image: compressed };
        setStudent(updatedStudent);
        localStorage.setItem("userData", JSON.stringify(updatedStudent));
        showToast("Profile picture updated successfully.", "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to process image.", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0A0A08] flex items-center justify-center text-[#888880] text-sm font-light">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-16 bg-[#0A0A08] min-h-screen flex items-center justify-center text-[#F0EDE6] selection:bg-[#2D7A22] selection:text-[#F0EDE6]">
      <motion.div
        className="bg-[#111110] border border-[rgba(255,255,255,0.07)] p-8 rounded-xl max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#888880] mb-4 block font-normal">Student Portal</span>
        
        {/* Student Picture */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6 group cursor-pointer"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={student.image || defaultAvatar}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border border-[rgba(255,255,255,0.07)]"
          />
          <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[9px] text-[#F0EDE6] font-medium border border-[#2D7A22]">
            <i className="ti ti-camera text-base mb-0.5 text-[#2D7A22]" />
            Change Photo
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              className="hidden" 
            />
          </label>
        </motion.div>

        {/* Student Details */}
        <motion.div
          className="space-y-3 text-left max-w-xs mx-auto text-sm border-t border-b border-[rgba(255,255,255,0.07)] py-5 my-5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-4">
            <h2 className="text-lg font-display font-medium text-white">{student.name}</h2>
            <p className="text-xs text-[#888880] mt-1 font-light">COLCOMP Student Identity</p>
          </div>
          
          <div className="flex justify-between">
            <span className="text-[#888880] font-light">Matric Number:</span>
            <span className="text-[#F0EDE6] font-medium">{student.matricNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888880] font-light">Level:</span>
            <span className="text-[#F0EDE6] font-medium">{student.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888880] font-light">Programme:</span>
            <span className="text-[#F0EDE6] font-medium">{student.programme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888880] font-light">Session:</span>
            <span className="text-[#F0EDE6] font-medium">{student.currentSession || "2023/2024"}</span>
          </div>
        </motion.div>

        {/* Barcode */}
        <motion.div
          className="mt-6 bg-[#1A1A17] border border-[rgba(255,255,255,0.07)] p-4 rounded-lg flex items-center justify-center overflow-hidden"
          style={{ height: "100px" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Barcode
            value={student.matricNumber}
            width={1.6}
            height={50}
            displayValue={false}
            background="transparent"
            lineColor="#F0EDE6"
          />
        </motion.div>

        {/* Logout Button */}
        <motion.button
          className="mt-6 px-6 py-2.5 w-full bg-[#1A1A17] text-[#888880] hover:text-[#F0EDE6] hover:bg-[#2D7A22] hover:border-transparent border border-[rgba(255,255,255,0.07)] rounded-md font-medium text-xs uppercase tracking-wider transition-all"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            navigate("/login");
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Portal;