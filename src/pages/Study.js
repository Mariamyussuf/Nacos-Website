import React from "react";
import { motion } from "framer-motion";

const Study = () => {
  const courses = [
    {
      title: "Computer Science",
      description:
        "Explore the foundations of computing, algorithms, and software development. Our program prepares students for careers in software engineering, data science, and AI.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Chemistry, Physics, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and Chemistry.",
      ],
    },
    {
      title: "Information Technology",
      description:
        "Learn to manage and analyze information systems critical for modern businesses. This program focuses on IT management, data systems, and business analytics.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Economics, Physics, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Biology, Chemistry, or Economics.",
      ],
    },
    {
      title: "Cybersecurity",
      description:
        "Our Cybersecurity program equips you with the skills needed to protect organizations from cyber threats. Learn about network security, ethical hacking, and cryptography to defend critical systems.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Physics, Chemistry, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Chemistry, Computer Studies, or Economics.",
      ],
    },
    {
      title: "Data Science",
      description:
        "The Data Science program teaches students how to analyze and interpret complex data. Gain skills in machine learning, statistics, and data visualization to solve real-world problems using data.",
      requirements: [
        "5 O'Level credits in Mathematics, English, Physics, Chemistry, and one other science subject.",
        "UTME Subjects: Use of English, Mathematics, Physics, and one of Computer Studies, Economics, or Geography.",
      ],
    },
  ];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.section
        className="text-center py-12 bg-gradient-to-r from-blue-600 to-blue-400 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-extrabold">Our Programs</h1>
        <p className="mt-4 text-lg max-w-3xl mx-auto">
          Choose from our world-class programs designed to equip you with the
          skills and knowledge needed to excel in your chosen field.
        </p>
      </motion.section>

      {/* Courses Section */}
      <motion.section
        className="py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 * index }}
          >
            <h3 className="text-2xl font-bold text-blue-600">{course.title}</h3>
            <p className="text-gray-700 mt-4">{course.description}</p>
            <h4 className="text-lg font-semibold text-gray-800 mt-6">
              Admission Requirements
            </h4>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {course.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.section>

      {/* Resources Section */}
      <motion.section
        className="py-12 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Additional Resources
          </h2>
          <p className="text-gray-600 mt-4">
            Explore more about the programs and resources available to help you
            succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <a
              href="https://www.nacos.org.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
            >
              Visit NACOS Website
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Study;
