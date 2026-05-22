import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaBookOpen } from "react-icons/fa";

const Skills = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const [skillsTeach, setSkillsTeach] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSkillsTeach(user.skillsTeach || []);
      setSkillsLearn(user.skillsLearn || []);
    }
  }, [user]);

  if (!user) return <p className="p-6">Loading skills...</p>;

  const removeSkill = async (type, skillId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "https://skill-swap-zkfd.onrender.com/api/user/remove-skill",
        { type, skillId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (type === "teach") setSkillsTeach(res.data.user.skillsTeach);
      else setSkillsLearn(res.data.user.skillsLearn);

      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to remove skill", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* PAGE CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Your Skills
            </h1>
            <p className={`mt-2 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
              Manage what you can teach and what you want to learn.
            </p>
          </div>

        
        </div>

        {/* GRID LAYOUT */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* SKILLS TO TEACH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 shadow-lg ${
              darkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaChalkboardTeacher className="text-teal-500 text-2xl" />
              <h2 className="text-2xl font-semibold">Skills You Can Teach</h2>
            </div>

            {skillsTeach.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skillsTeach.map((skill) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={skill._id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                      darkMode
                        ? "bg-teal-700 text-teal-100"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {skill.name}

                    <button
                      disabled={loading}
                      onClick={() => removeSkill("teach", skill._id)}
                      className="ml-1 text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className={`p-6 rounded-xl text-center border ${
                  darkMode ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"
                }`}
              >
                You haven’t added any teaching skills yet.
              </div>
            )}
          </motion.div>

          {/* SKILLS TO LEARN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl p-8 shadow-lg ${
              darkMode ? "bg-slate-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <FaBookOpen className="text-teal-500 text-2xl" />
              <h2 className="text-2xl font-semibold">Skills You Want to Learn</h2>
            </div>

            {skillsLearn.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {skillsLearn.map((skill) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={skill._id}
                   className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
  darkMode
    ? "bg-teal-700 text-teal-100"
    : "bg-teal-100 text-teal-700"
}`}
                  >
                    {skill.name}

                    <button
                      disabled={loading}
                      onClick={() => removeSkill("learn", skill._id)}
                      className="ml-1 text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className={`p-6 rounded-xl text-center border ${
                  darkMode ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"
                }`}
              >
                You haven’t added any learning skills yet.
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Skills;