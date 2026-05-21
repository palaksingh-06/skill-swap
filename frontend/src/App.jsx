import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import Skills from "./pages/Skills";
import EditProfile from "./pages/EditProfile";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";
import Badges from "./pages/Badges";
import Navbar from "./components/Navbar";
import Settings from "./pages/Settings";
import PublicProfile from "./pages/PublicProfile.jsx";
import EditPublicProfile from "./pages/EditPublicProfile.jsx";
import LoginSuccess from "./pages/LoginSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import SkillCategory from "./pages/SkillCategory";
import SkillMatch from "./pages/SkillMatch";
import VideoCall from "./pages/VideoCall";
import ChatListPage from "./pages/ChatListPage";
import ChatPage from "./pages/ChatPage";
import CompletedSessions from "./pages/Completedsessions";
import ScheduleSession from "./pages/ScheduleSession";
import PostCallReview from "./pages/PostCallReview";
import LeaderboardPage from "./pages/LeaderboardPage";
import BadgeCelebration from "./components/BadgeCelebration";
import NotificationToast from "./components/NotificationToast";
import { DarkModeContext } from "./context/DarkModeContext";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SkillBuddy from "./pages/SkillBuddy";
import SessionSummary from "./pages/Sessionsummary";
import socket from "./socket";

const App = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { loading, user } = useContext(AuthContext);

  // ✅ Apply DaisyUI theme to <html> tag whenever darkMode changes
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    const handleBadgeEarned = (badge) => {
      window.dispatchEvent(
        new CustomEvent("skillswap:badge-earned", { detail: badge })
      );
    };

    socket.on("badge-earned", handleBadgeEarned);

    return () => {
      socket.off("badge-earned", handleBadgeEarned);
    };
  }, [user?._id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-100 text-base-content">
        Loading...
      </div>
    );
  }

  return (
    // ✅ Use DaisyUI semantic classes instead of hardcoded colors
    <div className="bg-base-100 text-base-content min-h-screen">

      <BadgeCelebration />
      <NotificationToast />

      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/skill-buddy" element={<SkillBuddy />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<PublicProfile />} />

        <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
        <Route path="/skills/:category" element={<SkillCategory />} />

        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/edit-public-profile" element={<EditPublicProfile />} />

        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/completed-sessions" element={<ProtectedRoute><CompletedSessions /></ProtectedRoute>} />

        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />

        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/matches" element={<SkillMatch />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        <Route
          path="/sessions/:id/schedule"
          element={
            <ProtectedRoute>
              <ScheduleSession />
            </ProtectedRoute>
          }
        />
        <Route path="/summary/:roomId" element={<SessionSummary />} />
        <Route path="/video-call/:roomId" element={<VideoCall />} />
        <Route path="/messages" element={<ChatListPage />} />

        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:sessionId"
          element={
            <ProtectedRoute>
              <PostCallReview />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;