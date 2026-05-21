import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DarkModeContext } from "../context/DarkModeContext";
import { AuthContext } from "../context/AuthContext";
import { FaRegCommentDots, FaYoutube, FaLinkedin, FaBriefcase } from "react-icons/fa";
import ReviewsSection from "../components/ReviewsSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Star, Clock, ExternalLink,
  Send, Calendar, Award, User, MapPin
} from "lucide-react";

/* ═══════════════════════════════════════════
   THEME — fully teal-green anchored
═══════════════════════════════════════════ */
const T = (dark) => ({
  pageBg:        dark ? "#050d0c"               : "#e8f5f4",
  heroBg:        dark ? "#061412"               : "#0d2b27",
  cardBg:        dark ? "#0a1f1c"               : "#ffffff",
  sectionBg:     dark ? "#0d2420"               : "#f0faf9",
  border:        dark ? "rgba(20,184,166,0.12)" : "rgba(20,184,166,0.18)",
  borderMid:     dark ? "rgba(20,184,166,0.22)" : "rgba(20,184,166,0.28)",
  textPrimary:   dark ? "#e8faf8"               : "#0a1f1c",
  textSecondary: dark ? "#7fb8b2"               : "#2d6b64",
  textMuted:     dark ? "#3d7a73"               : "#5a9e97",
  teal300: "#5eead4",
  teal400: "#2dd4bf",
  teal500: "#14b8a6",
  teal600: "#0d9488",
  teal700: "#0f766e",
  green:   "#10b981",
  grad:    "linear-gradient(135deg, #14b8a6 0%, #0d9488 60%, #065f56 100%)",
});

const WEEKDAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/* ─── Stat chip — dark-glass so it pops on the teal hero ─── */
const HeroStat = ({ icon: Icon, label, value }) => (
  <div style={{
    display:"flex", flexDirection:"column", alignItems:"center", gap:4,
    background:"rgba(0,0,0,0.20)",
    border:"1.5px solid rgba(255,255,255,0.22)",
    borderRadius:16, padding:"14px 24px", minWidth:110,
    backdropFilter:"blur(12px)",
    WebkitBackdropFilter:"blur(12px)",
  }}>
    <Icon size={15} color="rgba(255,255,255,0.80)" strokeWidth={2} />
    <span style={{
      fontFamily:"'Clash Display',sans-serif",
      fontSize:26, fontWeight:700, color:"#ffffff", lineHeight:1,
    }}>
      {value}
    </span>
    <span style={{
      fontFamily:"'DM Sans',sans-serif",
      fontSize:11, fontWeight:700, textTransform:"uppercase",
      letterSpacing:"0.09em", color:"rgba(255,255,255,0.60)",
    }}>
      {label}
    </span>
  </div>
);

/* ─── Skill pill ─── */
const SkillPill = ({ skill, onRequest, dark }) => {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      whileHover={{ scale:1.04, y:-1 }} whileTap={{ scale:0.97 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:8,
        background: hover
          ? "linear-gradient(135deg,rgba(20,184,166,0.22),rgba(13,148,136,0.16))"
          : (dark ? "rgba(20,184,166,0.10)" : "rgba(20,184,166,0.08)"),
        border:`1.5px solid ${hover ? "rgba(20,184,166,0.50)" : "rgba(20,184,166,0.22)"}`,
        borderRadius:999, padding:"8px 16px 8px 14px",
        transition:"all 0.2s ease",
        fontFamily:"'DM Sans',sans-serif",
      }}
    >
      <span style={{ fontSize:14, fontWeight:700, color: dark ? "#2dd4bf" : "#0d9488" }}>
        {skill}
      </span>
      {onRequest && (
        <motion.button
          whileHover={{ scale:1.08, boxShadow:"0 4px 14px rgba(20,184,166,0.45)" }}
          whileTap={{ scale:0.93 }}
          onClick={() => onRequest(skill)}
          style={{
            display:"flex", alignItems:"center", gap:4,
            background:"linear-gradient(135deg,#14b8a6,#0d9488)",
            border:"none", borderRadius:999,
            padding:"4px 12px", cursor:"pointer",
            color:"#fff", fontSize:12, fontWeight:800,
            letterSpacing:"0.04em", fontFamily:"'DM Sans',sans-serif",
          }}
        >
          <Send size={10} strokeWidth={3}/> Request
        </motion.button>
      )}
    </motion.div>
  );
};

/* ─── Availability pill ─── */
const DayPill = ({ day, dark }) => (
  <div style={{
    display:"inline-flex", alignItems:"center", gap:6,
    background:"rgba(20,184,166,0.10)",
    border:"1.5px solid rgba(20,184,166,0.25)",
    borderRadius:999, padding:"7px 16px",
    fontSize:13, fontWeight:700,
    color: dark ? "#5eead4" : "#0f766e",
    fontFamily:"'DM Sans',sans-serif",
  }}>
    <Calendar size={12} strokeWidth={2.5}/>{day}
  </div>
);

/* ─── Big Section Card ─── */
const SectionCard = ({ icon: Icon, label, dark, children }) => (
  <motion.div
    initial={{ opacity:0, y:18 }}
    animate={{ opacity:1, y:0 }}
    transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
    style={{
      background: dark ? "rgba(10,31,28,0.85)" : "#ffffff",
      border:`1.5px solid ${dark ? "rgba(20,184,166,0.18)" : "rgba(20,184,166,0.22)"}`,
      borderRadius:20,
      padding:"32px 36px",
      boxShadow: dark
        ? "0 4px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(20,184,166,0.06)"
        : "0 4px 24px rgba(20,184,166,0.08), 0 1px 4px rgba(20,184,166,0.06)",
      position:"relative",
      overflow:"hidden",
    }}
  >
    {/* top accent line */}
    <div style={{
      position:"absolute", top:0, left:0, right:0, height:2,
      background:"linear-gradient(90deg, #14b8a6, #0d9488, transparent)",
      borderRadius:"20px 20px 0 0",
    }}/>
    {/* card header */}
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
      <div style={{
        width:40, height:40, borderRadius:12, flexShrink:0,
        background:"linear-gradient(135deg, rgba(20,184,166,0.20), rgba(13,148,136,0.12))",
        border:"1.5px solid rgba(20,184,166,0.28)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <Icon size={17} color="#14b8a6" strokeWidth={2.2}/>
      </div>
      <span style={{
        fontFamily:"'Clash Display',sans-serif",
        fontSize:14, fontWeight:700,
        textTransform:"uppercase", letterSpacing:"0.13em",
        color: dark ? "#2dd4bf" : "#0d9488",
      }}>
        {label}
      </span>
    </div>
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
const PublicProfile = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const { user: loggedInUser } = useContext(AuthContext);
  const theme = T(darkMode);

  const [profileUser,  setProfileUser]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState("about");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/user/public/profile/${id}`)
      .then(res => {
        const u = res.data.user || res.data;
        setProfileUser(u);
        setAvailability(Array.isArray(u.availability) ? u.availability : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const sendRequest = async (skill) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");
      await axios.post("http://localhost:5000/api/requests/send",
        { toUser: profileUser._id, skill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request sent!");
    } catch { alert("Failed to send request"); }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return m?.[2] ? `https://www.youtube.com/embed/${m[2]}` : url;
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:theme.pageBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
        style={{ width:38, height:38, border:"3px solid rgba(20,184,166,0.15)", borderTopColor:"#14b8a6", borderRadius:"50%" }}/>
      <p style={{ color:theme.textMuted, fontFamily:"'DM Sans',sans-serif", fontSize:15 }}>Loading profile…</p>
    </div>
  );

  if (!profileUser) return (
    <div style={{ minHeight:"100vh", background:theme.pageBg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <p style={{ color:theme.textMuted, fontFamily:"'DM Sans',sans-serif" }}>User not found</p>
    </div>
  );

  const avatarSrc = profileUser.avatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name||"U")}&background=14b8a6&color=fff&size=200`;

  const sortedAvail = [...availability].sort((a,b) => {
    const da = typeof a==="string"?a:a.day, db = typeof b==="string"?b:b.day;
    return WEEKDAY_ORDER.indexOf(da) - WEEKDAY_ORDER.indexOf(db);
  });

  /* "Details" tab (was "About") */
  const tabs = [
    { key:"about",   label:"Details" },
    { key:"reviews", label:`Reviews${profileUser.totalReviews>0?` (${profileUser.totalReviews})`:""}` },
  ];

  const fadeUp  = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{type:"spring",stiffness:230,damping:22}} };
  const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.09 } } };

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(20,184,166,0.3); border-radius:99px; }
      `}</style>

      <div style={{ minHeight:"100vh", background:theme.pageBg, fontFamily:"'DM Sans',sans-serif", color:theme.textPrimary }}>

        {/* ═══ HERO — full teal-green gradient ═══ */}
        <div style={{
          background:"linear-gradient(135deg, #14b8a6 0%, #0d9488 55%, #065f56 100%)",
          width:"100%", position:"relative", overflow:"hidden",
          paddingBottom:60,
        }}>
          {/* Light decorative circles */}

<div style={{
  position: "absolute",
  top: "-120px",
  left: "-120px",
  width: "380px",
  height: "380px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.08)",
  pointerEvents: "none",
}} />

<div style={{
  position: "absolute",
  top: "40px",
  right: "-100px",
  width: "300px",
  height: "300px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.06)",
  pointerEvents: "none",
}} />

<div style={{
  position: "absolute",
  top: "120px",
  left: "60px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.05)",
  pointerEvents: "none",
}} />
          {/* depth radials */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:`
              radial-gradient(ellipse 55% 70% at 5% 50%, rgba(255,255,255,0.10) 0%, transparent 55%),
              radial-gradient(ellipse 40% 50% at 95% 10%, rgba(0,0,0,0.22) 0%, transparent 55%)
            `,
          }}/>

          <div style={{ width:"100%", padding:"52px 48px 0", position:"relative", zIndex:1 }}>

            {/* ── top bar: only Message button, blinking badge removed ── */}
            <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}
              style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", marginBottom:40 }}
            >
              {loggedInUser?._id !== profileUser._id && (
                <motion.button
                  whileHover={{ scale:1.05, boxShadow:"0 8px 28px rgba(0,0,0,0.25)" }}
                  whileTap={{ scale:0.95 }}
                  onClick={() => navigate(`/chat/${profileUser._id}`)}
                  style={{
                    display:"flex", alignItems:"center", gap:9,
                    background:"rgba(0,0,0,0.22)",
                    backdropFilter:"blur(8px)",
                    WebkitBackdropFilter:"blur(8px)",
                    border:"1.5px solid rgba(255,255,255,0.30)",
                    borderRadius:14, padding:"12px 24px",
                    color:"#fff", fontFamily:"'DM Sans',sans-serif",
                    fontWeight:700, fontSize:14, cursor:"pointer",
                    letterSpacing:"0.02em",
                  }}
                >
                  <FaRegCommentDots size={15}/> Message
                </motion.button>
              )}
            </motion.div>

            {/* ── identity row ── */}
            <motion.div variants={stagger} initial="hidden" animate="show"
              style={{ display:"flex", alignItems:"flex-end", gap:32, flexWrap:"wrap" }}
            >
              {/* avatar — green dot removed */}
              <motion.div variants={fadeUp} style={{ position:"relative", flexShrink:0 }}>
                <div style={{
                  width:120, height:120, borderRadius:"50%", padding:3,
                  background:"rgba(255,255,255,0.25)",
                  boxShadow:"0 0 48px rgba(0,0,0,0.20), 0 0 96px rgba(0,0,0,0.10)",
                }}>
                  <img
                    src={avatarSrc} alt={profileUser.name}
                    onClick={() => setLightboxOpen(true)}
                    style={{
                      width:"100%", height:"100%", borderRadius:"50%",
                      objectFit:"cover", cursor:"pointer",
                      border:"3px solid rgba(255,255,255,0.30)",
                    }}
                  />
                </div>
                {/* green dot intentionally removed */}
              </motion.div>

              {/* name + tagline — frosted glass box */}
              <motion.div variants={fadeUp} style={{ flex:1, minWidth:240 }}>
               <div style={{
  display:"inline-block",
  background:"transparent",   // ← makes the color uniform
  borderRadius:20,
  padding:"20px 0px 22px",    // removed box spacing so it looks clean
  marginBottom:20,
}}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:6 }}>
                    <h1 style={{
                      fontFamily:"'Clash Display',sans-serif",
                      fontSize:"clamp(30px,4.5vw,52px)",
                      fontWeight:700, lineHeight:1,
                      color:"#ffffff", letterSpacing:"-0.025em",
                    }}>
                      {profileUser.name}
                    </h1>
                    {profileUser.skillLevel && (
                      <span style={{
                        background:"rgba(255,255,255,0.18)",
                        border:"1.5px solid rgba(255,255,255,0.35)",
                        borderRadius:999, padding:"4px 12px",
                        fontSize:11, fontWeight:800, color:"#ffffff",
                        letterSpacing:"0.10em", textTransform:"uppercase",
                        fontFamily:"'DM Sans',sans-serif",
                      }}>
                        {profileUser.skillLevel}
                      </span>
                    )}
                  </div>
                  {profileUser.tagline && (
                    <p style={{
                      color:"rgba(255,255,255,0.72)", fontSize:15,
                      fontWeight:400, lineHeight:1.5,
                      fontFamily:"'DM Sans',sans-serif",
                    }}>
                      {profileUser.tagline}
                    </p>
                  )}
                </div>

                {/* stat chips — dark glass so numbers are visible on teal */}
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  {profileUser.yearsOfExperience > 0 && (
                    <HeroStat icon={Award}         label="Yrs Exp"    value={profileUser.yearsOfExperience}/>
                  )}
                  {profileUser.totalReviews > 0 && (
                    <HeroStat icon={Star}          label="Reviews"    value={profileUser.totalReviews}/>
                  )}
                  {profileUser.skillsTeach?.length > 0 && (
                    <HeroStat icon={GraduationCap} label="Teaches"    value={profileUser.skillsTeach.length}/>
                  )}
                  {profileUser.skillsLearn?.length > 0 && (
                    <HeroStat icon={BookOpen}      label="Learns"     value={profileUser.skillsLearn.length}/>
                  )}
                  {sortedAvail.length > 0 && (
                    <HeroStat icon={Clock}         label="Days Avail" value={sortedAvail.length}/>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT AREA ═══ */}
        <motion.div
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.25, duration:0.55, ease:[0.22,1,0.36,1] }}
          style={{
            width:"100%",
            background: theme.cardBg,
            borderTop:"2px solid rgba(20,184,166,0.20)",
            marginTop:-2,
            boxShadow: darkMode
              ? "0 -8px 60px rgba(0,0,0,0.6)"
              : "0 -8px 40px rgba(20,184,166,0.08)",
            minHeight:"60vh",
          }}
        >
          {/* tab bar */}
          <div style={{
            display:"flex",
            borderBottom:`1.5px solid ${theme.border}`,
            padding:"0 48px",
            background: darkMode ? "rgba(6,20,18,0.80)" : "rgba(240,250,249,0.80)",
          }}>
            {tabs.map(tab => {
              const active = activeTab === tab.key;
              return (
                <motion.button key={tab.key} whileTap={{ scale:0.97 }}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding:"20px 6px", marginRight:36,
                    background:"none", border:"none", cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:15, fontWeight: active ? 700 : 500,
                    color: active ? "#14b8a6" : theme.textMuted,
                    borderBottom: active ? "2.5px solid #14b8a6" : "2.5px solid transparent",
                    marginBottom:-1.5, transition:"all 0.2s ease",
                    letterSpacing:"0.01em",
                  }}
                >
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              transition={{ duration:0.28, ease:[0.22,1,0.36,1] }}
              style={{ padding:"48px 48px 80px" }}
            >
              {activeTab === "about" ? (
                <motion.div variants={stagger} initial="hidden" animate="show"
                  style={{ display:"flex", flexDirection:"column", gap:24 }}
                >

                  {/* Skills Offered — full width */}
                  {profileUser.skillsTeach?.length > 0 && (
                    <SectionCard icon={GraduationCap} label="Skills Offered" dark={darkMode}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                        {profileUser.skillsTeach.map((skill,i) => (
                          <SkillPill key={i} skill={skill.name||skill} onRequest={loggedInUser?sendRequest:null} dark={darkMode}/>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {/* About Me — full width */}
                  <SectionCard icon={User} label="About Me" dark={darkMode}>
                    <p style={{
  fontSize:18,              // same size as education
  fontWeight:600,           // same thickness
  lineHeight:1.6,           // same spacing
  color: darkMode ? "#e8faf8" : "#0a1f1c",
  fontFamily:"'DM Sans',sans-serif",
}}>
  {profileUser.bio || "No bio set."}
</p>
                  </SectionCard>

                  {/* Education + Experience — 2 col */}
                  {(profileUser.education || profileUser.yearsOfExperience > 0) && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                      {profileUser.education && (
                        <SectionCard icon={GraduationCap} label="Education" dark={darkMode}>
                          <p style={{
                            fontSize:18, fontWeight:600, lineHeight:1.6,
                            color: darkMode ? "#e8faf8" : "#0a1f1c",
                            fontFamily:"'DM Sans',sans-serif",
                          }}>
                            {profileUser.education}
                          </p>
                        </SectionCard>
                      )}
                      {profileUser.yearsOfExperience > 0 && (
                        <SectionCard icon={Award} label="Experience" dark={darkMode}>
                          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                          <span style={{
  fontSize:18,
  fontWeight:600,
  color: darkMode ? "#e8faf8" : "#0a1f1c",
  fontFamily:"'DM Sans',sans-serif",
}}>
  {profileUser.yearsOfExperience}
</span>
                            <span style={{
                              fontSize:18, fontWeight:600,
                              color: darkMode ? "#e8faf8" : "#0a1f1c",
                              fontFamily:"'DM Sans',sans-serif",
                            }}>
                              years of experience
                            </span>
                          </div>
                        </SectionCard>
                      )}
                    </div>
                  )}

                  {/* LinkedIn + Portfolio — 2 col */}
                  {(profileUser.linkedin || profileUser.portfolio) && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                      {profileUser.linkedin && (
                        <SectionCard icon={FaLinkedin} label="LinkedIn" dark={darkMode}>
                          <a href={profileUser.linkedin} target="_blank" rel="noreferrer"
                            style={{
                              display:"inline-flex", alignItems:"center", gap:8,
                              background:"linear-gradient(135deg,#14b8a6,#0d9488)",
                              borderRadius:12, padding:"12px 22px",
                              color:"#fff", fontSize:14, fontWeight:700,
                              textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
                              letterSpacing:"0.02em",
                            }}>
                            View LinkedIn Profile <ExternalLink size={14} strokeWidth={2.5}/>
                          </a>
                        </SectionCard>
                      )}
                      {profileUser.portfolio && (
                        <SectionCard icon={FaBriefcase} label="Portfolio" dark={darkMode}>
                          <a href={profileUser.portfolio} target="_blank" rel="noreferrer"
                            style={{
                              display:"inline-flex", alignItems:"center", gap:8,
                              background:"linear-gradient(135deg,#14b8a6,#0d9488)",
                              borderRadius:12, padding:"12px 22px",
                              color:"#fff", fontSize:14, fontWeight:700,
                              textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
                              letterSpacing:"0.02em",
                            }}>
                            View Portfolio <ExternalLink size={14} strokeWidth={2.5}/>
                          </a>
                        </SectionCard>
                      )}
                    </div>
                  )}

                  {/* Weekly Availability — full width */}
                  <SectionCard icon={Calendar} label="Weekly Availability" dark={darkMode}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                      {sortedAvail.length > 0
                        ? sortedAvail.map((item,i) => (
                            <DayPill key={i} day={typeof item==="string"?item:item.day} dark={darkMode}/>
                          ))
                        : <p style={{
                            color: darkMode ? "#3d7a73" : "#5a9e97",
                            fontSize:15, fontFamily:"'DM Sans',sans-serif",
                          }}>No availability set</p>
                      }
                    </div>
                  </SectionCard>

                  {/* Demo Video — full width */}
                  {profileUser.demoVideo && (
                    <SectionCard icon={FaYoutube} label="Demo Video" dark={darkMode}>
                      <div style={{
                        borderRadius:14, overflow:"hidden",
                        border:`1.5px solid ${darkMode ? "rgba(20,184,166,0.22)" : "rgba(20,184,166,0.28)"}`,
                        boxShadow: darkMode ? "0 12px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(20,184,166,0.12)",
                        position:"relative", paddingBottom:"56.25%",
                      }}>
                        <iframe
                          src={getEmbedUrl(profileUser.demoVideo)}
                          style={{ position:"absolute",top:0,left:0,width:"100%",height:"100%" }}
                          allowFullScreen title="Demo Video"
                        />
                      </div>
                    </SectionCard>
                  )}

                </motion.div>
              ) : (
                <ReviewsSection userId={profileUser._id}/>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setLightboxOpen(false)}
            style={{
              position:"fixed", inset:0, zIndex:999,
              background:"rgba(0,0,0,0.88)",
              display:"flex", alignItems:"center", justifyContent:"center",
              backdropFilter:"blur(10px)",
            }}
          >
            <motion.img
              initial={{ scale:0.85 }} animate={{ scale:1 }} exit={{ scale:0.85 }}
              src={avatarSrc} alt={profileUser.name}
              style={{
                width:300, height:300, borderRadius:"50%", objectFit:"cover",
                border:"4px solid #14b8a6", boxShadow:"0 0 80px rgba(20,184,166,0.5)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicProfile;