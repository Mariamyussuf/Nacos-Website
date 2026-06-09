import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Barcode from "react-barcode";
import { useNavigate } from "react-router-dom";

const Portal = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PGNpcmNsZSBjeD0iMTI4IiBjeT0iOTYiIHI9IjY0IiBmaWxsPSIjZTJlOGYwIi8+PHBhdGggZmlsbD0iI2UyZThmMCIgZD0iTTAsIDE5MiBDMCwgMTYwIDk2LCAxNDQgMTI4LCAxNDQgQzE2MCwgMTQ0IDI1NiwgMTYwIDI1NiwgMTkyIEwyNTYsIDI1NiBMMCwgMjU2IFoiLz48L3N2Zz4=";

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

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Student Picture */}
        <motion.img
          src={student.image || defaultAvatar}
          alt={student.name}
          className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-md"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Student Details */}
        <motion.div
          className="space-y-4 text-gray-800"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold">{student.name}</h2>
          <p className="text-sm">
            <strong>Matric Number:</strong> {student.matricNumber}
          </p>
          <p className="text-sm">
            <strong>Level:</strong> {student.level}
          </p>
          <p className="text-sm">
            <strong>Programme:</strong> {student.programme}
          </p>
          <p className="text-sm">
            <strong>Session:</strong> {student.currentSession || "2023/2024"}
          </p>
        </motion.div>

        {/* Barcode */}
        <motion.div
          className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner flex items-center justify-center"
          style={{ height: "120px" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Barcode
            value={student.matricNumber}
            width={2.5}
            height={100}
            displayValue={false}
            background="#ffffff"
            lineColor="#000000"
          />
        </motion.div>

        {/* Logout Button */}
        <motion.button
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            navigate("/login");
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Portal;