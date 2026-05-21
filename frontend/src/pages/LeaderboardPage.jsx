import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import { Trophy, Crown, Medal, Star } from "lucide-react";

const LeaderboardPage = () => {
  const { user: authUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"}`}>
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-teal-500" />
          <p className="text-sm text-gray-500">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load leaderboard</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-10 ${darkMode ? "bg-[#0f172a] text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Trophy className="text-teal-500" /> Leaderboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Top learners ranked by XP earned</p>
          </div>

          <div className={`px-6 py-3 rounded-2xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
            <p className="text-xs text-gray-500">Your Rank</p>
            <p className="text-xl font-bold text-teal-500">
              {leaderboard.find((u) => u._id === authUser?._id)?.rank || "--"}
            </p>
          </div>
        </motion.div>

        {/* TOP 3 CARDS (same beautiful cards, only staggered positions) */}
        <div className="flex justify-center items-end gap-6 mb-14">

          {/* 2nd place */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, y: -5 }}
              transition={{ delay: 0.2 }}
              className="w-64 translate-y-8"
            >
              <div className={`rounded-3xl p-6 text-center bg-gradient-to-b from-slate-400/20 to-slate-400/5 border ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                <Medal className="mx-auto mb-3 text-slate-400" />

                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                  {top3[1].profilePic ? (
                    <img src={top3[1].profilePic} className="w-full h-full object-cover" />
                  ) : (
                    top3[1].name?.[0]?.toUpperCase()
                  )}
                </div>

                <p className="font-semibold">{top3[1].name}</p>
                <p className="text-sm text-gray-500">Rank #{top3[1].rank}</p>
                <p className="text-teal-500 font-bold mt-3 text-lg">{top3[1].xp} XP</p>
              </div>
            </motion.div>
          )}

          {/* 1st place */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -6 }}
              transition={{ delay: 0.1 }}
              className="w-72 -translate-y-6"
            >
              <div className={`rounded-3xl p-7 text-center bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 border ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                <Crown className="mx-auto mb-3 text-yellow-400" />

                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-yellow-400 flex items-center justify-center text-white text-3xl font-bold">
                  {top3[0].profilePic ? (
                    <img src={top3[0].profilePic} className="w-full h-full object-cover" />
                  ) : (
                    top3[0].name?.[0]?.toUpperCase()
                  )}
                </div>

                <p className="font-bold text-lg">{top3[0].name}</p>
                <p className="text-sm text-gray-500">Rank #{top3[0].rank}</p>
                <p className="text-teal-500 font-bold mt-3 text-xl">{top3[0].xp} XP</p>
              </div>
            </motion.div>
          )}

          {/* 3rd place */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, y: -5 }}
              transition={{ delay: 0.3 }}
              className="w-64 translate-y-12"
            >
              <div className={`rounded-3xl p-6 text-center bg-gradient-to-b from-amber-500/20 to-amber-500/5 border ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
                <Medal className="mx-auto mb-3 text-amber-500" />

                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                  {top3[2].profilePic ? (
                    <img src={top3[2].profilePic} className="w-full h-full object-cover" />
                  ) : (
                    top3[2].name?.[0]?.toUpperCase()
                  )}
                </div>

                <p className="font-semibold">{top3[2].name}</p>
                <p className="text-sm text-gray-500">Rank #{top3[2].rank}</p>
                <p className="text-teal-500 font-bold mt-3 text-lg">{top3[2].xp} XP</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* REST LIST (Professional table style like LeetCode) */} 
        <div className={`rounded-3xl overflow-hidden ${darkMode ? "bg-slate-900" : "bg-white"} shadow-sm`}>

          <div className={`grid grid-cols-12 px-6 py-4 text-sm font-semibold ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">User</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-3 text-right">XP</div>
          </div>

          {rest.map((user, index) => {
            const isMe = user._id === authUser?._id;

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
              transition={{ delay: index * 0.04 }}
                className={`grid grid-cols-12 items-center px-6 py-4 border-t ${darkMode ? "border-slate-800" : "border-gray-100"} ${isMe ? "bg-teal-500/10" : ""}`}
              >
                <div className="col-span-2 font-bold text-teal-500">#{user.rank}</div>

                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {user.profilePic ? (
                      <img src={user.profilePic} className="w-full h-full object-cover" />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="font-medium">
                      {user.name} {isMe && <span className="text-xs text-teal-500">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{user.badgeCount} badges</p>
                  </div>
                </div>

                <div className="col-span-2 text-sm">Level {user.level}</div>

                <div className="col-span-3 text-right font-bold text-teal-500">{user.xp} XP</div>
              </motion.div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No leaderboard data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
