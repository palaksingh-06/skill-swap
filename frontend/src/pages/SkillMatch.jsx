// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";
// import { useNavigate } from "react-router-dom";

// const SkillMatch = () => {
//   const { user, loading } = useContext(AuthContext);
//   const { darkMode } = useContext(DarkModeContext);

//   const [matches, setMatches] = useState([]);
//   const [sentRequests, setSentRequests] = useState([]);
//   const [successMsg, setSuccessMsg] = useState("");
//   const navigate = useNavigate();
//   const openProfile = async (name) => {
//   try {
//     const res = await axios.get(
//       `/api/public/user-by-name/${encodeURIComponent(name)}`
//     );

//     const userId = res.data._id;
//     navigate(`/profile/${userId}`);
//   } catch (err) {
//     console.error("Profile open failed", err);
//     alert("User not found");
//   }
// };


//   useEffect(() => {
//     if (!user) return;

//     const fetchMatches = async () => {
//       const res = await axios.get(
//         `http://localhost:5000/api/match/skill-match/${user._id}`
//       );
//       setMatches(res.data);
//     };

//     fetchMatches();
//   }, [user]);

//   // ✅ SEND REQUEST → STORED IN DB
// const sendRequest = async (toUserId, skillName) => {
//   try {
//     const token = localStorage.getItem("token");

//     await axios.post(
//       "http://localhost:5000/api/requests/send",
//       {
//         toUser: toUserId,
//         skill: skillName, // ✅ REQUIRED FIELD
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setSentRequests((prev) => [...prev, toUserId]);
//   } catch (err) {
//     console.error(err.response?.data || err);
//     alert("Failed to send request");
//   }
// };



//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!user) return <p className="text-center mt-10">Please login</p>;

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "bg-slate-900 text-white" : "bg-slate-50"
//       }`}
//     >
//       {/* ===== HEADER ===== */}
//       <div className="bg-teal-600 text-white py-20 text-center">
//         <h1 className="text-4xl font-bold mb-2">Skill Matches</h1>
//         <p className="text-sm opacity-90">
//           Find students who match your learning goals
//         </p>
//       </div>

//       {/* ✅ CONFIRMATION MESSAGE */}
//       {successMsg && (
//         <div className="max-w-xl mx-auto mt-6 bg-teal-100 text-teal-800 px-6 py-3 rounded-xl text-center font-medium">
//           {successMsg}
//         </div>
//       )}

//       {/* ===== MATCH CARDS ===== */}
//       <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
//         {matches.length === 0 && (
//           <p className="col-span-3 text-center text-gray-500">
//             No matches found
//           </p>
//         )}

//         {matches.map((u) => {
//           const isSent = sentRequests.includes(u._id);

//           return (
//             <div
//               key={u._id}
//               className={`rounded-2xl p-6 shadow-md transition hover:-translate-y-1 ${
//                 darkMode ? "bg-slate-800" : "bg-white"
//               }`}
//             >
//               {/* NAME ONLY (NO IMAGE) */}
//               <div className="mb-4">
//                 <h3 className="font-semibold text-lg">{u.name}</h3>
//                 <p className="text-sm text-gray-500">
//                   {u.location || "Remote"}
//                 </p>
//               </div>

//               {/* TEACHES */}
//               <div className="mb-4">
//                 <p className="text-xs font-semibold text-gray-400 mb-1">
//                   TEACHES
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {u.skillsTeach.map((s) => (
//                     <span
//                       key={s._id}
//                       className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs"
//                     >
//                       {s.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* WANTS TO LEARN */}
//               <div className="mb-6">
//                 <p className="text-xs font-semibold text-gray-400 mb-1">
//                   WANTS TO LEARN
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {u.skillsLearn.map((s) => (
//                     <span
//                       key={s._id}
//                       className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs"
//                     >
//                       {s.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* SEND REQUEST */}
//         <button
//   onClick={() => navigate(`/profile/${u._id}`)}
//   className="mt-5 w-full py-2 rounded-xl border text-teal-600 border-teal-400 hover:bg-teal-50 transition"
// >
//   View Details
// </button>



//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SkillMatch;



import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";

const SkillMatch = () => {
  const { user, loading } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const openProfile = async (name) => {
    try {
      const res = await axios.get(
        `/api/public/user-by-name/${encodeURIComponent(name)}`
      );
      const userId = res.data._id;
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error("Profile open failed", err);
      alert("User not found");
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchMatches = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/match/skill-match/${user._id}`
      );
      setMatches(res.data);
    };
    fetchMatches();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">Please login</p>;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-50"
      }`}
    >
      {/* ===== HERO SECTION ===== */}
<div className="relative bg-teal-600 overflow-hidden">
  {/* Decorative shapes inside hero */}
  <div className="absolute top-10 left-10 w-48 h-48 bg-teal-500 rounded-full opacity-40"></div>
  <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-400 rounded-full opacity-30"></div>

  <div className="relative max-w-6xl mx-auto py-24 px-6 text-center">
    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
      Skill Matches
    </h1>
    <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl mx-auto drop-shadow-sm">
      Connect with students who share your learning goals and start collaborating today!
    </p>

    {/* CTA BUTTON */}
    <button
      onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
      className="mt-8 px-8 py-3 bg-white text-teal-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
    >
      Explore Matches
    </button>
  </div>
</div>

      {/* ✅ CONFIRMATION MESSAGE */}
      {successMsg && (
        <div className="max-w-xl mx-auto mt-6 bg-teal-100 text-teal-800 px-6 py-3 rounded-xl text-center font-medium shadow-sm">
          {successMsg}
        </div>
      )}

      {/* ===== MATCH CARDS ===== */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.length === 0 && (
          <p className="col-span-3 text-center text-gray-500">
            No matches found
          </p>
        )}

        {matches.map((u) => {
          const isSent = sentRequests.includes(u._id);

          return (
            <div
              key={u._id}
              className={`rounded-3xl p-6 shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300 ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              {/* PROFILE HEADER */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-teal-400 flex items-center justify-center text-white font-bold text-lg">
  {u.avatar ? (
    <img
      src={u.avatar}
      alt={u.name}
      className="w-full h-full object-cover"
    />
  ) : (
    u.name?.[0]?.toUpperCase() || "U"
  )}
</div>
                <div>
                  <h3 className="font-semibold text-lg">{u.name}</h3>
                  <p className="text-sm text-gray-400">{u.location || "Remote"}</p>
                </div>
              </div>

              {/* TEACHES */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2 tracking-wide">
                  TEACHES
                </p>
                <div className="flex flex-wrap gap-2">
                  {u.skillsTeach.map((s) => (
                    <span
                      key={s._id}
                      className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-medium"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* WANTS TO LEARN */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 mb-2 tracking-wide">
                  WANTS TO LEARN
                </p>
                <div className="flex flex-wrap gap-2">
                  {u.skillsLearn.map((s) => (
                    <span
                      key={s._id}
                      className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-medium"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* VIEW PROFILE BUTTON */}
              <button
                onClick={() => navigate(`/profile/${u._id}`)}
                className="mt-4 w-full py-2 rounded-xl border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold transition-colors"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillMatch;
