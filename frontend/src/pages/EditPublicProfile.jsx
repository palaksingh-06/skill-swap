// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";

// const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// const PublicProfile = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const { darkMode } = useContext(DarkModeContext);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [username, setUsername] = useState("");
//   const [skillLevel, setSkillLevel] = useState("");
//   const [experience, setExperience] = useState("");
//   const [education, setEducation] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [portfolio, setPortfolio] = useState("");
//   const [skillsOffered, setSkillsOffered] = useState("");
//   const [skillTags, setSkillTags] = useState("");
//   const [tagline, setTagline] = useState("");
//   const [bio, setBio] = useState("");
//   const [demoVideo, setDemoVideo] = useState("");
//   const [availability, setAvailability] = useState([]); // Array of weekdays

//   // Load user data into state
//   useEffect(() => {
//   if (user) {
//     setUsername(user.username || "");
//     setSkillLevel(user.skillLevel || "");
//     setExperience(user.yearsOfExperience || "");
//     setEducation(user.education || "");
//     setLinkedin(user.linkedin || "");
//     setPortfolio(user.portfolio || "");
//     setSkillsOffered(user.skillsOffered?.join(", ") || "");
//     setSkillTags(user.skillTags?.join(", ") || "");
//     setTagline(user.tagline || "");
//     setBio(user.bio || "");
//     setDemoVideo(user.demoVideo || "");
//     setAvailability(
//       user.availability?.map(d => {
//         const date = new Date(d);
//         return weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1] || d;
//       }) || []
//     );
//     setLoading(false);
//   }
// }, [user]);

//   // Toggle weekday selection
//   const handleWeekdayClick = (day) => {
//     if (availability.includes(day)) {
//       setAvailability(availability.filter(d => d !== day));
//     } else {
//       setAvailability([...availability, day]);
//     }
//   };

//   // Save profile
//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         "http://localhost:5000/api/user/public-profile",
//         {
//           username,
//           skillLevel,
//           yearsOfExperience: experience,
//           education,
//           linkedin,
//           portfolio,
//           skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
//           skillTags: skillTags.split(",").map((s) => s.trim()),
//           tagline,
//           bio,
//           demoVideo,
//           availability, // now an array of weekdays
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setUser(res.data.user);
//       alert("Public profile updated successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update public profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-10">Loading...</p>;

//   return (
//     <div
//       className={`min-h-screen flex justify-center items-start py-14 px-4 ${
//         darkMode
//           ? "bg-slate-900 text-white"
//           : "bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900"
//       }`}
//     >
//       <div
//         className={`w-full max-w-4xl rounded-3xl shadow-xl p-10 ${
//           darkMode ? "bg-slate-800" : "bg-white"
//         }`}
//       >
//         {/* HEADER */}
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold mb-2">Edit Public Profile</h1>
//           <p className="text-slate-500">
//             Update your information to stand out to the community.
//           </p>
//         </div>

//         {/* FORM FIELDS */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
         

//           {/* Skill Level */}
//           <div>
//             <label className="block font-medium mb-2">Skill Level</label>
//             <select
//               value={skillLevel}
//               onChange={(e) => setSkillLevel(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
//               }`}
//             >
//               <option value="">Select your level</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//               <option value="Expert">Expert</option>
//             </select>
//           </div>

//           {/* Experience */}
//           <div>
//             <label className="block font-medium mb-2">Years of Experience</label>
//             <input
//               type="number"
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Education */}
//           <div>
//             <label className="block font-medium mb-2">Education</label>
//             <input
//               type="text"
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* LinkedIn */}
//           <div>
//             <label className="block font-medium mb-2">LinkedIn</label>
//             <input
//               type="url"
//               value={linkedin}
//               onChange={(e) => setLinkedin(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Portfolio */}
//           <div>
//             <label className="block font-medium mb-2">Portfolio</label>
//             <input
//               type="url"
//               value={portfolio}
//               onChange={(e) => setPortfolio(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Skills Offered */}
//           <div>
//             <label className="block font-medium mb-2">Skills Offered (comma separated)</label>
//             <input
//               type="text"
//               value={skillsOffered}
//               onChange={(e) => setSkillsOffered(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>



//           {/* Tagline */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Tagline</label>
//             <input
//               type="text"
//               value={tagline}
//               onChange={(e) => setTagline(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Bio */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Bio</label>
//             <textarea
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 h-36 resize-none border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Demo Video */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Demo Video Link</label>
//             <input
//               type="url"
//               value={demoVideo}
//               onChange={(e) => setDemoVideo(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>
//         </div>

//        {/* AVAILABILITY */}
// {/* AVAILABILITY */}
// <div className="mb-8">
//   <label className="block font-semibold mb-2">Availability</label>
//   <div className="flex flex-wrap gap-2">
//     {weekdays.map((day) => (
//       <button
//         key={day}
//         type="button"
//         onClick={() => handleWeekdayClick(day)}
//         className={`px-4 py-2 rounded-full border font-medium transition ${
//           availability.includes(day)
//             ? "bg-teal-500 text-white border-teal-500"
//             : darkMode
//             ? "bg-slate-700 text-white border-slate-600"
//             : "bg-slate-100 text-slate-900 border-slate-300"
//         }`}
//       >
//         {day}
//       </button>
//     ))}
//   </div>
//   <div className="mt-2">
//     <strong>Selected Days:</strong>{" "}
//     {availability.length ? availability.join(", ") : "None"}
//   </div>
// </div>
//         {/* SAVE BUTTON */}
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
//         >
//           {saving ? "Saving..." : "Save Public Profile"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PublicProfile;


// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import { DarkModeContext } from "../context/DarkModeContext";

// const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// const PublicProfile = () => {
//   const { user, setUser } = useContext(AuthContext);
//   const { darkMode } = useContext(DarkModeContext);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showXPPopup, setShowXPPopup] = useState(false); // New state for reward UI

//   const [username, setUsername] = useState("");
//   const [skillLevel, setSkillLevel] = useState("");
//   const [experience, setExperience] = useState("");
//   const [education, setEducation] = useState("");
//   const [linkedin, setLinkedin] = useState("");
//   const [portfolio, setPortfolio] = useState("");
//   const [skillsOffered, setSkillsOffered] = useState("");
//   const [skillTags, setSkillTags] = useState("");
//   const [tagline, setTagline] = useState("");
//   const [bio, setBio] = useState("");
//   const [demoVideo, setDemoVideo] = useState("");
//   const [availability, setAvailability] = useState([]);

//   useEffect(() => {
//     if (user) {
//       setUsername(user.username || "");
//       setSkillLevel(user.skillLevel || "");
//       setExperience(user.yearsOfExperience || "");
//       setEducation(user.education || "");
//       setLinkedin(user.linkedin || "");
//       setPortfolio(user.portfolio || "");
//       setSkillsOffered(user.skillsOffered?.join(", ") || "");
//       setSkillTags(user.skillTags?.join(", ") || "");
//       setTagline(user.tagline || "");
//       setBio(user.bio || "");
//       setDemoVideo(user.demoVideo || "");
//       setAvailability(
//         user.availability?.map((d) => {
//           const date = new Date(d);
//           return weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1] || d;
//         }) || []
//       );
//       setLoading(false);
//     }
//   }, [user]);

//   const handleWeekdayClick = (day) => {
//     if (availability.includes(day)) {
//       setAvailability(availability.filter((d) => d !== day));
//     } else {
//       setAvailability([...availability, day]);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         "http://localhost:5000/api/user/public-profile",
//         {
//           username,
//           skillLevel,
//           yearsOfExperience: experience,
//           education,
//           linkedin,
//           portfolio,
//           skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
//           skillTags: skillTags.split(",").map((s) => s.trim()),
//           tagline,
//           bio,
//           demoVideo,
//           availability,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setUser(res.data.user);

//       // Check if backend awarded the 5 XP bonus
//       if (res.data.earnedBonus) {
//         setShowXPPopup(true);
//         setTimeout(() => setShowXPPopup(false), 4000);
//       } else {
//         alert("Public profile updated successfully!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update public profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className="p-10">Loading...</p>;

//   return (
//     <div
//       className={`min-h-screen flex justify-center items-start py-14 px-4 ${
//         darkMode ? "bg-slate-900 text-white" : "bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900"
//       }`}
//     >
//       {/* XP CELEBRATION POPUP */}
//       {showXPPopup && (
//         <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
//           <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/30 backdrop-blur-md">
//             <span className="text-2xl">🎉</span>
//             <div>
//               <p className="font-bold text-lg leading-tight">Profile Complete!</p>
//               <p className="text-teal-50 text-sm">+5 XP added to your total</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className={`w-full max-w-4xl rounded-3xl shadow-xl p-10 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
//         {/* HEADER */}
//         <div className="mb-10">
//           <h1 className="text-3xl font-bold mb-2">Edit Public Profile</h1>
//           <p className="text-slate-500">Update your information to stand out to the community.</p>
//         </div>

//         {/* FORM FIELDS */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           {/* Skill Level */}
//           <div>
//             <label className="block font-medium mb-2">Skill Level</label>
//             <select
//               value={skillLevel}
//               onChange={(e) => setSkillLevel(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
//               }`}
//             >
//               <option value="">Select your level</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//               <option value="Expert">Expert</option>
//             </select>
//           </div>

//           {/* Experience */}
//           <div>
//             <label className="block font-medium mb-2">Years of Experience</label>
//             <input
//               type="number"
//               value={experience}
//               onChange={(e) => setExperience(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Education */}
//           <div>
//             <label className="block font-medium mb-2">Education</label>
//             <input
//               type="text"
//               value={education}
//               onChange={(e) => setEducation(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* LinkedIn */}
//           <div>
//             <label className="block font-medium mb-2">LinkedIn</label>
//             <input
//               type="url"
//               value={linkedin}
//               onChange={(e) => setLinkedin(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Portfolio */}
//           <div>
//             <label className="block font-medium mb-2">Portfolio</label>
//             <input
//               type="url"
//               value={portfolio}
//               onChange={(e) => setPortfolio(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Skills Offered */}
//           <div>
//             <label className="block font-medium mb-2">Skills Offered (comma separated)</label>
//             <input
//               type="text"
//               value={skillsOffered}
//               onChange={(e) => setSkillsOffered(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Tagline */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Tagline</label>
//             <input
//               type="text"
//               value={tagline}
//               onChange={(e) => setTagline(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Bio */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Bio</label>
//             <textarea
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 h-36 resize-none border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>

//           {/* Demo Video */}
//           <div className="md:col-span-2">
//             <label className="block font-semibold mb-2">Demo Video Link</label>
//             <input
//               type="url"
//               value={demoVideo}
//               onChange={(e) => setDemoVideo(e.target.value)}
//               className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
//                 darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
//               }`}
//             />
//           </div>
//         </div>

//         {/* AVAILABILITY */}
//         <div className="mb-8">
//           <label className="block font-semibold mb-2">Availability</label>
//           <div className="flex flex-wrap gap-2">
//             {weekdays.map((day) => (
//               <button
//                 key={day}
//                 type="button"
//                 onClick={() => handleWeekdayClick(day)}
//                 className={`px-4 py-2 rounded-full border font-medium transition ${
//                   availability.includes(day)
//                     ? "bg-teal-500 text-white border-teal-500"
//                     : darkMode
//                     ? "bg-slate-700 text-white border-slate-600"
//                     : "bg-slate-100 text-slate-900 border-slate-300"
//                 }`}
//               >
//                 {day}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2">
//             <strong>Selected Days:</strong> {availability.length ? availability.join(", ") : "None"}
//           </div>
//         </div>

//         {/* SAVE BUTTON */}
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
//         >
//           {saving ? "Saving..." : "Save Public Profile"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PublicProfile;




import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PublicProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate(); // 2. Initialize navigate

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showXPPopup, setShowXPPopup] = useState(false);

  const [username, setUsername] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillTags, setSkillTags] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setSkillLevel(user.skillLevel || "");
      setExperience(user.yearsOfExperience || "");
      setEducation(user.education || "");
      setLinkedin(user.linkedin || "");
      setPortfolio(user.portfolio || "");
      setSkillsOffered(user.skillsOffered?.join(", ") || "");
      setSkillTags(user.skillTags?.join(", ") || "");
      setTagline(user.tagline || "");
      setBio(user.bio || "");
      setDemoVideo(user.demoVideo || "");
      setAvailability(
        user.availability?.map((d) => {
          const date = new Date(d);
          return weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1] || d;
        }) || []
      );
      setLoading(false);
    }
  }, [user]);

  const handleWeekdayClick = (day) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter((d) => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://skill-swap-zkfd.onrender.com/api/user/public-profile",
        {
          username,
          skillLevel,
          yearsOfExperience: experience,
          education,
          linkedin,
          portfolio,
          skillsOffered: skillsOffered.split(",").map((s) => s.trim()),
          skillTags: skillTags.split(",").map((s) => s.trim()),
          tagline,
          bio,
          demoVideo,
          availability,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data.user);

      if (res.data.earnedBonus) {
        setShowXPPopup(true);
        // Wait for the popup to show briefly before redirecting
        setTimeout(() => {
          setShowXPPopup(false);
          navigate("/profile"); // 3. Redirect after bonus
        }, 3000);
      } else {
        // 4. Redirect immediately if no bonus
        navigate("/profile"); 
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update public profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div
      className={`min-h-screen flex justify-center items-start py-14 px-4 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900"
      }`}
    >
      {showXPPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-white/30 backdrop-blur-md">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-lg leading-tight">Profile Complete!</p>
              <p className="text-teal-50 text-sm">+5 XP added to your total</p>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full max-w-4xl rounded-3xl shadow-xl p-10 ${darkMode ? "bg-slate-800" : "bg-white"}`}>
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Edit Public Profile</h1>
          <p className="text-slate-500">Update your information to stand out to the community.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-medium mb-2">Skill Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200"
              }`}
            >
              <option value="">Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Education</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Portfolio</label>
            <input
              type="url"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Skills Offered (comma separated)</label>
            <input
              type="text"
              value={skillsOffered}
              onChange={(e) => setSkillsOffered(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 h-36 resize-none border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Demo Video Link</label>
            <input
              type="url"
              value={demoVideo}
              onChange={(e) => setDemoVideo(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"
              }`}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block font-semibold mb-2">Availability</label>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleWeekdayClick(day)}
                className={`px-4 py-2 rounded-full border font-medium transition ${
                  availability.includes(day)
                    ? "bg-teal-500 text-white border-teal-500"
                    : darkMode
                    ? "bg-slate-700 text-white border-slate-600"
                    : "bg-slate-100 text-slate-900 border-slate-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <strong>Selected Days:</strong> {availability.length ? availability.join(", ") : "None"}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Public Profile"}
        </button>
      </div>
    </div>
  );
};

export default PublicProfile;