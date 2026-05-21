// import { useEffect, useState, useContext, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { StreamChat } from "stream-chat";
// import {
//   Chat,
//   Channel,
//   Window,
//   MessageList,
//   Thread,
//   useChannelStateContext,
// } from "stream-chat-react";
// import "stream-chat-react/dist/css/v2/index.css";
// import EmojiPicker from "emoji-picker-react";
// import { AuthContext } from "../context/AuthContext";

// const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// /* =========================
//    THEME — Primary: #1F8F7A on White
// ========================= */
// const buildTheme = () => `
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');



// :root {
//   --str-chat-primary-color: #ffffff;
//   --str-chat-surface-color: transparent;
//   --str-chat-text-color: #ffffff;
//   --str-chat-font-family: 'Inter', sans-serif;
// }

// /* MAIN BACKGROUND */
// .str-chat,
// .str-chat__container,
// .str-chat__channel,
// .str-chat__main-panel {
//   background: linear-gradient(135deg, #CFEDE6, #A9DED4) !important;


//   font-family: 'Inter', sans-serif !important;
// }

// /* MESSAGE AREA */
// .str-chat__list {
//   background: transparent !important;
//   padding: 20px !important;
// }

// /* MY MESSAGE */
// .str-chat__message--me .str-chat__message-bubble {
//   background: #ffffff !important;
//   color: #0f2421 !important;
//   border-radius: 18px 18px 6px 18px !important;
//   box-shadow: 0 6px 18px rgba(0,0,0,0.10) !important;
// }

// /* OTHER MESSAGE */
// .str-chat__message:not(.str-chat__message--me) .str-chat__message-bubble {
//   background: rgba(255,255,255,0.5) !important;
//   backdrop-filter: blur(10px);
//   border: 1px solid rgba(255,255,255,0.6) !important;
//   border-radius: 18px 18px 18px 6px !important;
//   color: #0f2421 !important;
// }

// /* REMOVE AVATAR */
// .str-chat__avatar {
//   display: none !important;
// }

// /* THREAD */
// .str-chat__thread {
//   background: rgba(255,255,255,0.35) !important;
//   backdrop-filter: blur(10px);
// }

// /* DATE */
// .str-chat__date-separator-date {
//   background: rgba(255,255,255,0.7) !important;
//   padding: 4px 12px !important;
//   border-radius: 999px !important;
//   color: #0f2421 !important;
// }

// /* SCROLLBAR */
// .str-chat__list::-webkit-scrollbar {
//   width: 4px;
// }
// .str-chat__list::-webkit-scrollbar-thumb {
//   background: rgba(0,0,0,0.2);
//   border-radius: 10px;
// }
// `;
// /* =========================
//    CUSTOM HEADER
// ========================= */
// const CustomHeader = ({ targetUser, authUser, onBack }) => {
//   const { channel } = useChannelStateContext();
//   const [onlineIds, setOnlineIds] = useState(new Set());

//   useEffect(() => {
//     if (!channel) return;

//     const refresh = () => {
//       const ids = new Set();
//       Object.values(channel.state?.members || {}).forEach((m) => {
//         if (m.user?.online) ids.add(m.user_id || m.user?.id);
//       });
//       setOnlineIds(ids);
//     };

//     refresh();

//     channel.on("user.presence.changed", refresh);
//     channel.on("user.watching.start",   refresh);
//     channel.on("user.watching.stop",    refresh);

//     return () => {
//       channel.off("user.presence.changed", refresh);
//       channel.off("user.watching.start",   refresh);
//       channel.off("user.watching.stop",    refresh);
//     };
//   }, [channel]);

//   const members    = Object.values(channel?.state?.members || {});
//   const onlineCnt  = onlineIds.size;
//   const targetId   = targetUser?._id?.toString() || targetUser?.id?.toString();
//   const isOnline   = onlineIds.has(targetId);

//   const avatar = (u, fallback) => {
//     const src = u?.avatar || u?.profilePic || u?.image;
//     return src || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallback || "U")}&background=1F8F7A&color=fff&size=128`;
//   };

//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: "12px",
//       padding: "14px 20px",
//       background: "#ffffff",
//       borderBottom: "1px solid rgba(31,143,122,0.15)",
//       boxShadow: "0 2px 12px rgba(31,143,122,0.07)",
//     }}>

//       {/* Back */}
//       <button onClick={onBack} title="Back"
//         style={{
//           background: "rgba(31,143,122,0.08)",
//           border: "1px solid rgba(31,143,122,0.22)",
//           borderRadius: "50%", width: "36px", height: "36px",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           cursor: "pointer", flexShrink: 0, transition: "all 0.18s",
//         }}
//         onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.16)"; e.currentTarget.style.borderColor = "#1F8F7A"; }}
//         onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.08)"; e.currentTarget.style.borderColor = "rgba(31,143,122,0.22)"; }}
//       >
//         <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//           <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#1F8F7A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </button>

//       {/* Target avatar */}
//       <div style={{ position: "relative", flexShrink: 0 }}>
//         <img
//           src={avatar(targetUser, targetUser?.name)}
//           alt={targetUser?.name}
//           onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser?.name || "U")}&background=1F8F7A&color=fff&size=128`; }}
//           style={{
//             width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover",
//             border: `2px solid ${isOnline ? "#1F8F7A" : "rgba(31,143,122,0.2)"}`,
//             boxShadow: isOnline ? "0 0 0 3px rgba(31,143,122,0.15)" : "none",
//             transition: "all 0.3s",
//           }}
//         />
//         <span style={{
//           position: "absolute", bottom: "1px", right: "1px",
//           width: "11px", height: "11px",
//           background: isOnline ? "#22c55e" : "#cbd5e1",
//           borderRadius: "50%",
//           border: "2px solid #ffffff",
//           transition: "background 0.3s",
//           boxShadow: isOnline ? "0 0 6px rgba(34,197,94,0.5)" : "none",
//         }} />
//       </div>

//       {/* Name + status */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{
//           color: "#0f2421", fontWeight: 800, fontSize: "15px",
//           fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.3px",
//           overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//         }}>
//           {targetUser?.name || "Chat"}
//         </div>
//         <div style={{
//           fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
//           display: "flex", alignItems: "center", gap: "5px", marginTop: "2px",
//           color: isOnline ? "#22c55e" : "#94a3b8",
//         }}>
//           <span style={{
//             width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
//             background: isOnline ? "#22c55e" : "#cbd5e1",
//             boxShadow: isOnline ? "0 0 5px #22c55e" : "none",
//           }} />
//           {isOnline ? "Active now" : "Offline"}
//         </div>
//       </div>

//       {/* Online badge */}
//       {/* <div style={{
//         background: "rgba(31,143,122,0.08)",
//         border: "1px solid rgba(31,143,122,0.22)",
//         borderRadius: "999px", padding: "5px 14px",
//         color: "#1F8F7A", fontSize: "12px", fontWeight: 700,
//         fontFamily: "'DM Sans', sans-serif",
//         flexShrink: 0,
//       }}>
//         {onlineCnt}/{members.length} online
//       </div> */}

//       {/* Own avatar */}
//       <div style={{ position: "relative", flexShrink: 0 }}>
//         <img
//           src={avatar(authUser, authUser?.name)}
//           alt="You"
//           onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || "Me")}&background=177a67&color=fff&size=128`; }}
//           style={{
//             width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover",
//             border: "2px solid rgba(31,143,122,0.3)",
//             opacity: 0.92,
//           }}
//           title={`You (${authUser?.name})`}
//         />
//         <span style={{
//           position: "absolute", bottom: "1px", right: "1px",
//           width: "9px", height: "9px",
//           background: "#22c55e", borderRadius: "50%",
//           border: "2px solid #ffffff",
//           boxShadow: "0 0 5px rgba(34,197,94,0.5)",
//         }} />
//       </div>
//     </div>
//   );
// };

// /* =========================
//    CUSTOM INPUT
// ========================= */
// const CustomInput = () => {
//   const { channel } = useChannelStateContext();
//   const [value, setValue]               = useState("");
//   const [showEmoji, setShowEmoji]       = useState(false);
//   const [isRecording, setIsRecording]   = useState(false);
//   const [sending, setSending]           = useState(false);
//   const [stagedFiles, setStagedFiles]   = useState([]);
//   const [stagedAudio, setStagedAudio]   = useState(null);
//   const [recordSecs, setRecordSecs]     = useState(0);

//   const fileRef     = useRef(null);
//   const recRef      = useRef(null);
//   const chunksRef   = useRef([]);
//   const emojiRef    = useRef(null);
//   const timerRef    = useRef(null);

//   useEffect(() => {
//     const h = (e) => { if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   useEffect(() => {
//     if (isRecording) {
//       setRecordSecs(0);
//       timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
//     } else {
//       clearInterval(timerRef.current);
//     }
//     return () => clearInterval(timerRef.current);
//   }, [isRecording]);

//   const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

//   const handleSend = async () => {
//     const trimmed = value.trim();
//     if ((!trimmed && !stagedFiles.length && !stagedAudio) || sending) return;
//     setSending(true);
//     try {
//       const attachments = [];
//       for (const f of stagedFiles) {
//         const isImg = f.file.type.startsWith("image/");
//         const res   = isImg ? await channel.sendImage(f.file) : await channel.sendFile(f.file);
//         attachments.push(isImg
//           ? { type: "image", asset_url: res.file, image_url: res.file, title: f.file.name }
//           : { type: "file",  asset_url: res.file, title: f.file.name });
//       }
//       if (stagedAudio) {
//         const af  = new File([stagedAudio.blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
//         const res = await channel.sendFile(af);
//         attachments.push({ type: "audio", asset_url: res.file, title: "Voice message" });
//       }
//       await channel.sendMessage({
//         text: trimmed || (stagedAudio ? "🎙️ Voice message" : ""),
//         ...(attachments.length ? { attachments } : {}),
//       });
//       setValue(""); setStagedFiles([]); setStagedAudio(null);
//     } catch (e) { console.error(e); }
//     finally { setSending(false); }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setStagedFiles((p) => [...p, { file, previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null }]);
//     e.target.value = "";
//   };

//   const startRec = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const rec = new MediaRecorder(stream);
//       chunksRef.current = [];
//       rec.ondataavailable = (e) => chunksRef.current.push(e.data);
//       rec.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         setStagedAudio({ blob, url: URL.createObjectURL(blob) });
//         stream.getTracks().forEach((t) => t.stop());
//       };
//       rec.start(); recRef.current = rec; setIsRecording(true);
//     } catch (e) { console.error(e); }
//   };

//   const stopRec = () => { recRef.current?.stop(); setIsRecording(false); };

//   const ghostBtn = (onClick, title, children, active = false) => (
//     <button onClick={onClick} title={title} style={{
//       background: active ? "rgba(31,143,122,0.14)" : "rgba(31,143,122,0.06)",
//       border: `1px solid ${active ? "rgba(31,143,122,0.4)" : "rgba(31,143,122,0.18)"}`,
//       borderRadius: "50%", width: "38px", height: "38px",
//       cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//       flexShrink: 0, transition: "all 0.18s",
//     }}
//       onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.16)"; e.currentTarget.style.borderColor = "#1F8F7A"; }}
//       onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(31,143,122,0.14)" : "rgba(31,143,122,0.06)"; e.currentTarget.style.borderColor = active ? "rgba(31,143,122,0.4)" : "rgba(31,143,122,0.18)"; }}
//     >{children}</button>
//   );

//   return (
//     <div style={{ background: "#ffffff", borderTop: "1px solid rgba(31,143,122,0.12)" }}>

//       {/* Emoji picker */}
//       {showEmoji && (
//         <div ref={emojiRef} style={{
//           position: "absolute", bottom: "70px", left: "12px", zIndex: 200,
//           borderRadius: "18px", overflow: "hidden",
//           boxShadow: "0 16px 50px rgba(0,0,0,0.12)",
//           border: "1px solid rgba(31,143,122,0.2)",
//         }}>
//           <EmojiPicker
//             onEmojiClick={(d) => { setValue((p) => p + d.emoji); setShowEmoji(false); }}
//             height={360} width={300}
//             theme="light"
//             skinTonesDisabled
//             searchDisabled={false}
//           />
//         </div>
//       )}

//       {/* Staged previews */}
//       {(stagedFiles.length > 0 || stagedAudio) && (
//         <div style={{
//           display: "flex", flexWrap: "wrap", gap: "8px",
//           padding: "10px 16px 6px",
//           borderBottom: "1px solid rgba(31,143,122,0.10)",
//           background: "#f7fdfb",
//         }}>
//           {stagedFiles.map((f, i) => (
//             <div key={i} style={{
//               position: "relative", borderRadius: "10px",
//               overflow: "hidden",
//               border: "1px solid rgba(31,143,122,0.22)",
//               background: "#fff", flexShrink: 0,
//               boxShadow: "0 2px 8px rgba(31,143,122,0.08)",
//             }}>
//               {f.previewUrl
//                 ? <img src={f.previewUrl} alt="" style={{ width: "64px", height: "64px", objectFit: "cover", display: "block" }} />
//                 : <div style={{ width: "64px", height: "64px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#1F8F7A", padding: "4px", textAlign: "center" }}>
//                     <span style={{ fontSize: "22px" }}>📄</span>
//                     <span style={{ marginTop: "2px" }}>{f.file.name.slice(0, 10)}{f.file.name.length > 10 ? "…" : ""}</span>
//                   </div>
//               }
//               <button onClick={() => setStagedFiles((p) => p.filter((_, j) => j !== i))}
//                 style={{ position: "absolute", top: "3px", right: "3px", width: "16px", height: "16px", borderRadius: "50%", background: "rgba(0,0,0,0.25)", border: "none", color: "#fff", fontSize: "9px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
//             </div>
//           ))}

//           {stagedAudio && (
//             <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid rgba(31,143,122,0.22)", borderRadius: "10px", padding: "8px 12px", boxShadow: "0 2px 8px rgba(31,143,122,0.08)" }}>
//               <span>🎙️</span>
//               <audio src={stagedAudio.url} controls style={{ height: "28px", maxWidth: "160px" }} />
//               <button onClick={() => setStagedAudio(null)}
//                 style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(31,143,122,0.1)", border: "none", color: "#1F8F7A", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Recording bar */}
//       {isRecording && (
//         <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 18px", background: "rgba(239,68,68,0.05)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
//           <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "chatPulse 1s infinite", flexShrink: 0 }} />
//           <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
//             {fmt(recordSecs)}
//           </span>
//           <span style={{ fontSize: "12px", color: "rgba(220,38,38,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
//             recording — tap stop to finish
//           </span>
//         </div>
//       )}

//       {/* Input row */}
//       <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px" }}>

//         {/* Emoji */}
//         {ghostBtn(() => setShowEmoji((p) => !p), "Emoji",
//           <span style={{ fontSize: "17px", lineHeight: 1 }}>😊</span>, showEmoji)}

//         {/* Attach */}
//         {ghostBtn(() => fileRef.current?.click(), "Attach file",
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//             <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
//               stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         )}
//         <input ref={fileRef} type="file" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
//           style={{ display: "none" }} onChange={handleFileChange} />

//         {/* Text input */}
//         <input
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
//           placeholder={isRecording ? "Recording in progress…" : "Type a message…"}
//           disabled={isRecording}
//           style={{
//             flex: 1, padding: "11px 20px",
//             borderRadius: "999px",
//             border: "1px solid rgba(31,143,122,0.22)",
//             outline: "none", fontSize: "14px", fontWeight: 500,
//             fontFamily: "'DM Sans', sans-serif",
//             color: "#0f2421",
//             background: "#f7fdfb",
//             transition: "border 0.2s, box-shadow 0.2s",
//             caretColor: "#1F8F7A",
//           }}
//           onFocus={(e) => { e.target.style.borderColor = "#1F8F7A"; e.target.style.boxShadow = "0 0 0 3px rgba(31,143,122,0.12)"; e.target.style.background = "#fff"; }}
//           onBlur={(e)  => { e.target.style.borderColor = "rgba(31,143,122,0.22)"; e.target.style.boxShadow = "none"; e.target.style.background = "#f7fdfb"; }}
//         />

//         {/* Mic / Stop */}
//         <button
//           onClick={isRecording ? stopRec : startRec}
//           title={isRecording ? "Stop" : "Voice message"}
//           style={{
//             width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
//             background: isRecording ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(31,143,122,0.06)",
//             border: isRecording ? "none" : "1px solid rgba(31,143,122,0.18)",
//             cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
//             animation: isRecording ? "recBeat 1.2s infinite" : "none",
//             boxShadow: isRecording ? "0 0 14px rgba(239,68,68,0.3)" : "none",
//             transition: "all 0.2s",
//           }}
//         >
//           {isRecording
//             ? <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>
//             : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//           }
//         </button>

//         {/* Send */}
//         <button
//           onClick={handleSend} disabled={sending} title="Send"
//           style={{
//             width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
//             background: sending ? "rgba(31,143,122,0.25)" : "linear-gradient(135deg,#1F8F7A,#177a67)",
//             border: "none", cursor: sending ? "not-allowed" : "pointer",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: sending ? "none" : "0 4px 16px rgba(31,143,122,0.35)",
//             transition: "all 0.18s",
//           }}
//           onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(31,143,122,0.5)"; } }}
//           onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = sending ? "none" : "0 4px 16px rgba(31,143,122,0.35)"; }}
//         >
//           {sending
//             ? <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "chatSpin 0.7s linear infinite" }} />
//             : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                 <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//           }
//         </button>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    CHAT INNER
// ========================= */
// const ChatInner = ({ targetUser, authUser, onBack }) => (
//   <Window>
//     <CustomHeader targetUser={targetUser} authUser={authUser} onBack={onBack} />
//     <MessageList />
//     <CustomInput />
//   </Window>
// );

// /* =========================
//    MAIN PAGE
// ========================= */
// const ChatPage = () => {
//   const { userId: targetUserId } = useParams();
//   const { user: authUser }       = useContext(AuthContext);
//   const navigate                 = useNavigate();

//   const [client,     setClient]     = useState(null);
//   const [channel,    setChannel]    = useState(null);
//   const [targetUser, setTargetUser] = useState(null);

//   useEffect(() => {
//     if (!authUser) return;
//     let chatClient;

//     const init = async () => {
//       try {
//         const tok = localStorage.getItem("token");

//         const [tokenRes, profileRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/chat/token", {
//             headers: { Authorization: `Bearer ${tok}` },
//           }),
//           axios.get(`http://localhost:5000/api/user/public/profile/${targetUserId}`, {
//             headers: { Authorization: `Bearer ${tok}` },
//           }).catch(() => null),
//         ]);

//         if (profileRes?.data) {
//           const u = profileRes.data.user || profileRes.data;
//           setTargetUser(u);
//         }

//         await axios.post(`http://localhost:5000/api/chat/upsert-user/${targetUserId}`, {},
//           { headers: { Authorization: `Bearer ${tok}` } });

//         chatClient = StreamChat.getInstance(STREAM_API_KEY);

//         if (!chatClient.userID) {
//           await chatClient.connectUser(
//             {
//               id:    authUser._id,
//               name:  authUser.name,
//               image: authUser.avatar || authUser.profilePic || "",
//             },
//             tokenRes.data.token
//           );
//         }

//         const members = [authUser._id.toString(), targetUserId.toString()].sort();
//         const ch = chatClient.channel("messaging", `chat-${members[0]}-${members[1]}`, { members });
//         await ch.watch();
//         setClient(chatClient);
//         setChannel(ch);
//       } catch (err) {
//         console.error("Chat error:", err);
//       }
//     };

//     init();
//     return () => { if (chatClient) chatClient.disconnectUser(); };
//   }, [authUser, targetUserId]);

//   if (!client || !channel) {
//     return (
//       <div style={{
//         height: "80vh", display: "flex", flexDirection: "column",
//         alignItems: "center", justifyContent: "center", gap: "16px",
//         background: "#f7fdfb", fontFamily: "'DM Sans', sans-serif",
//       }}>
//         <div style={{
//           width: "44px", height: "44px",
//           border: "3px solid rgba(31,143,122,0.15)",
//           borderTop: "3px solid #1F8F7A",
//           borderRadius: "50%", animation: "chatSpin 0.8s linear infinite",
//         }} />
//         <p style={{ color: "#1F8F7A", fontWeight: 600, margin: 0, fontSize: "14px", letterSpacing: "0.03em" }}>
//           Connecting…
//         </p>
//         <style>{`@keyframes chatSpin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{buildTheme()}</style>
//       <div style={{
//         height: "88vh",
//         maxWidth: "920px",
//         margin: "0 auto",
//         borderRadius: "20px",
//         overflow: "hidden",
//         border: "1px solid rgba(31,143,122,0.15)",
//         boxShadow: "0 8px 40px rgba(31,143,122,0.10), 0 2px 8px rgba(0,0,0,0.06)",
//         display: "flex", flexDirection: "column",
//         background: "#f7fdfb",
//         position: "relative",
//       }}>
//         <Chat client={client} theme="messaging light">
//           <Channel channel={channel}>
//             <ChatInner targetUser={targetUser} authUser={authUser} onBack={() => navigate(-1)} />
//             <Thread />
//           </Channel>
//         </Chat>
//       </div>
//     </>
//   );
// };

// export default ChatPage;

import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  Thread,
  useChannelStateContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import EmojiPicker from "emoji-picker-react";
import { AuthContext } from "../context/AuthContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/* =========================
   THEME — Primary: #1F8F7A on White
========================= */
const buildTheme = () => `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');



:root {
  --str-chat-primary-color: #ffffff;
  --str-chat-surface-color: transparent;
  --str-chat-text-color: #ffffff;
  --str-chat-font-family: 'Inter', sans-serif;
}

/* MAIN BACKGROUND */
.str-chat,
.str-chat__container,
.str-chat__channel,
.str-chat__main-panel {
  background: linear-gradient(135deg, #CFEDE6, #A9DED4) !important;


  font-family: 'Inter', sans-serif !important;
}

/* MESSAGE AREA */
.str-chat__list {
  background: transparent !important;
  padding: 20px !important;
}

/* MY MESSAGE */
.str-chat__message--me .str-chat__message-bubble {
  background: #ffffff !important;
  color: #0f2421 !important;
  border-radius: 18px 18px 6px 18px !important;
  box-shadow: 0 6px 18px rgba(0,0,0,0.10) !important;
}

/* OTHER MESSAGE */
.str-chat__message:not(.str-chat__message--me) .str-chat__message-bubble {
  background: rgba(255,255,255,0.5) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.6) !important;
  border-radius: 18px 18px 18px 6px !important;
  color: #0f2421 !important;
}

/* REMOVE AVATAR */
.str-chat__avatar {
  display: none !important;
}

/* THREAD */
.str-chat__thread {
  background: rgba(255,255,255,0.35) !important;
  backdrop-filter: blur(10px);
}

/* DATE */
.str-chat__date-separator-date {
  background: rgba(255,255,255,0.7) !important;
  padding: 4px 12px !important;
  border-radius: 999px !important;
  color: #0f2421 !important;
}

/* SCROLLBAR */
.str-chat__list::-webkit-scrollbar {
  width: 4px;
}
.str-chat__list::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}
`;

/* =========================
   CUSTOM HEADER
========================= */
const CustomHeader = ({ targetUser, authUser, onBack }) => {
  const { channel } = useChannelStateContext();
  const [onlineIds, setOnlineIds] = useState(new Set());

  useEffect(() => {
    if (!channel) return;

    const refresh = () => {
      const ids = new Set();
      Object.values(channel.state?.members || {}).forEach((m) => {
        if (m.user?.online) ids.add(m.user_id || m.user?.id);
      });
      setOnlineIds(ids);
    };

    refresh();

    channel.on("user.presence.changed", refresh);
    channel.on("user.watching.start",   refresh);
    channel.on("user.watching.stop",    refresh);

    return () => {
      channel.off("user.presence.changed", refresh);
      channel.off("user.watching.start",   refresh);
      channel.off("user.watching.stop",    refresh);
    };
  }, [channel]);

  const targetId   = targetUser?._id?.toString() || targetUser?.id?.toString();
  const isOnline   = onlineIds.has(targetId);

  const avatar = (u, fallback) => {
    const src = u?.avatar || u?.profilePic || u?.image;
    return src || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallback || "U")}&background=1F8F7A&color=fff&size=128`;
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "14px 20px",
      background: "#ffffff",
      borderBottom: "1px solid rgba(31,143,122,0.15)",
      boxShadow: "0 2px 12px rgba(31,143,122,0.07)",
    }}>

      {/* Back */}
      <button onClick={onBack} title="Back"
        style={{
          background: "rgba(31,143,122,0.08)",
          border: "1px solid rgba(31,143,122,0.22)",
          borderRadius: "50%", width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0, transition: "all 0.18s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.16)"; e.currentTarget.style.borderColor = "#1F8F7A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.08)"; e.currentTarget.style.borderColor = "rgba(31,143,122,0.22)"; }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#1F8F7A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Target avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={avatar(targetUser, targetUser?.name)}
          alt={targetUser?.name}
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser?.name || "U")}&background=1F8F7A&color=fff&size=128`; }}
          style={{
            width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover",
            border: `2px solid ${isOnline ? "#1F8F7A" : "rgba(31,143,122,0.2)"}`,
            boxShadow: isOnline ? "0 0 0 3px rgba(31,143,122,0.15)" : "none",
            transition: "all 0.3s",
          }}
        />
        <span style={{
          position: "absolute", bottom: "1px", right: "1px",
          width: "11px", height: "11px",
          background: isOnline ? "#22c55e" : "#cbd5e1",
          borderRadius: "50%",
          border: "2px solid #ffffff",
          transition: "background 0.3s",
          boxShadow: isOnline ? "0 0 6px rgba(34,197,94,0.5)" : "none",
        }} />
      </div>

      {/* Name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: "#0f2421", fontWeight: 800, fontSize: "15px",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.3px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {targetUser?.name || "Chat"}
        </div>
        <div style={{
          fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
          display: "flex", alignItems: "center", gap: "5px", marginTop: "2px",
          color: isOnline ? "#22c55e" : "#94a3b8",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
            background: isOnline ? "#22c55e" : "#cbd5e1",
            boxShadow: isOnline ? "0 0 5px #22c55e" : "none",
          }} />
          {isOnline ? "Active now" : "Offline"}
        </div>
      </div>

      {/* Own avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={avatar(authUser, authUser?.name)}
          alt="You"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || "Me")}&background=177a67&color=fff&size=128`; }}
          style={{
            width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover",
            border: "2px solid rgba(31,143,122,0.3)",
            opacity: 0.92,
          }}
          title={`You (${authUser?.name})`}
        />
        <span style={{
          position: "absolute", bottom: "1px", right: "1px",
          width: "9px", height: "9px",
          background: "#22c55e", borderRadius: "50%",
          border: "2px solid #ffffff",
          boxShadow: "0 0 5px rgba(34,197,94,0.5)",
        }} />
      </div>
    </div>
  );
};

/* =========================
   CUSTOM INPUT
========================= */
const CustomInput = () => {
  const { channel } = useChannelStateContext();
  const [value, setValue]               = useState("");
  const [showEmoji, setShowEmoji]       = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [sending, setSending]           = useState(false);
  const [stagedFiles, setStagedFiles]   = useState([]);
  const [stagedAudio, setStagedAudio]   = useState(null);
  const [recordSecs, setRecordSecs]     = useState(0);

  const fileRef     = useRef(null);
  const recRef      = useRef(null);
  const chunksRef   = useRef([]);
  const emojiRef    = useRef(null);
  const timerRef    = useRef(null);

  useEffect(() => {
    const h = (e) => { if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (isRecording) {
      setRecordSecs(0);
      timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleSend = async () => {
    const trimmed = value.trim();
    if ((!trimmed && !stagedFiles.length && !stagedAudio) || sending) return;
    setSending(true);
    try {
      const attachments = [];
      for (const f of stagedFiles) {
        const isImg = f.file.type.startsWith("image/");
        const res   = isImg ? await channel.sendImage(f.file) : await channel.sendFile(f.file);
        attachments.push(isImg
          ? { type: "image", asset_url: res.file, image_url: res.file, title: f.file.name }
          : { type: "file",  asset_url: res.file, title: f.file.name });
      }
      if (stagedAudio) {
        const af  = new File([stagedAudio.blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        const res = await channel.sendFile(af);
        attachments.push({ type: "audio", asset_url: res.file, title: "Voice message" });
      }
      await channel.sendMessage({
        text: trimmed || (stagedAudio ? "🎙️ Voice message" : ""),
        ...(attachments.length ? { attachments } : {}),
      });
      setValue(""); setStagedFiles([]); setStagedAudio(null);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStagedFiles((p) => [...p, { file, previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null }]);
    e.target.value = "";
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setStagedAudio({ blob, url: URL.createObjectURL(blob) });
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start(); recRef.current = rec; setIsRecording(true);
    } catch (e) { console.error(e); }
  };

  const stopRec = () => { recRef.current?.stop(); setIsRecording(false); };

  const ghostBtn = (onClick, title, children, active = false) => (
    <button onClick={onClick} title={title} style={{
      background: active ? "rgba(31,143,122,0.14)" : "rgba(31,143,122,0.06)",
      border: `1px solid ${active ? "rgba(31,143,122,0.4)" : "rgba(31,143,122,0.18)"}`,
      borderRadius: "50%", width: "38px", height: "38px",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "all 0.18s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(31,143,122,0.16)"; e.currentTarget.style.borderColor = "#1F8F7A"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(31,143,122,0.14)" : "rgba(31,143,122,0.06)"; e.currentTarget.style.borderColor = active ? "rgba(31,143,122,0.4)" : "rgba(31,143,122,0.18)"; }}
    >{children}</button>
  );

  return (
    <div style={{ background: "#ffffff", borderTop: "1px solid rgba(31,143,122,0.12)" }}>

      {/* Emoji picker */}
      {showEmoji && (
        <div ref={emojiRef} style={{
          position: "absolute", bottom: "70px", left: "12px", zIndex: 200,
          borderRadius: "18px", overflow: "hidden",
          boxShadow: "0 16px 50px rgba(0,0,0,0.12)",
          border: "1px solid rgba(31,143,122,0.2)",
        }}>
          <EmojiPicker
            onEmojiClick={(d) => { setValue((p) => p + d.emoji); setShowEmoji(false); }}
            height={360} width={300}
            theme="light"
            skinTonesDisabled
            searchDisabled={false}
          />
        </div>
      )}

      {/* Staged previews */}
      {(stagedFiles.length > 0 || stagedAudio) && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "8px",
          padding: "10px 16px 6px",
          borderBottom: "1px solid rgba(31,143,122,0.10)",
          background: "#f7fdfb",
        }}>
          {stagedFiles.map((f, i) => (
            <div key={i} style={{
              position: "relative", borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(31,143,122,0.22)",
              background: "#fff", flexShrink: 0,
              boxShadow: "0 2px 8px rgba(31,143,122,0.08)",
            }}>
              {f.previewUrl
                ? <img src={f.previewUrl} alt="" style={{ width: "64px", height: "64px", objectFit: "cover", display: "block" }} />
                : <div style={{ width: "64px", height: "64px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#1F8F7A", padding: "4px", textAlign: "center" }}>
                    <span style={{ fontSize: "22px" }}>📄</span>
                    <span style={{ marginTop: "2px" }}>{f.file.name.slice(0, 10)}{f.file.name.length > 10 ? "…" : ""}</span>
                  </div>
              }
              <button onClick={() => setStagedFiles((p) => p.filter((_, j) => j !== i))}
                style={{ position: "absolute", top: "3px", right: "3px", width: "16px", height: "16px", borderRadius: "50%", background: "rgba(0,0,0,0.25)", border: "none", color: "#fff", fontSize: "9px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
            </div>
          ))}

          {stagedAudio && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid rgba(31,143,122,0.22)", borderRadius: "10px", padding: "8px 12px", boxShadow: "0 2px 8px rgba(31,143,122,0.08)" }}>
              <span>🎙️</span>
              <audio src={stagedAudio.url} controls style={{ height: "28px", maxWidth: "160px" }} />
              <button onClick={() => setStagedAudio(null)}
                style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(31,143,122,0.1)", border: "none", color: "#1F8F7A", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          )}
        </div>
      )}

      {/* Recording bar */}
      {isRecording && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 18px", background: "rgba(239,68,68,0.05)", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "chatPulse 1s infinite", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
            {fmt(recordSecs)}
          </span>
          <span style={{ fontSize: "12px", color: "rgba(220,38,38,0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            recording — tap stop to finish
          </span>
        </div>
      )}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px" }}>

        {/* Emoji */}
        {ghostBtn(() => setShowEmoji((p) => !p), "Emoji",
          <span style={{ fontSize: "17px", lineHeight: 1 }}>😊</span>, showEmoji)}

        {/* Attach */}
        {ghostBtn(() => fileRef.current?.click(), "Attach file",
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
              stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <input ref={fileRef} type="file" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
          style={{ display: "none" }} onChange={handleFileChange} />

        {/* Text input */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(); }}
          placeholder={isRecording ? "Recording in progress…" : "Type a message…"}
          disabled={isRecording}
          style={{
            flex: 1, padding: "11px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(31,143,122,0.22)",
            outline: "none", fontSize: "14px", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            color: "#0f2421",
            background: "#f7fdfb",
            transition: "border 0.2s, box-shadow 0.2s",
            caretColor: "#1F8F7A",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#1F8F7A"; e.target.style.boxShadow = "0 0 0 3px rgba(31,143,122,0.12)"; e.target.style.background = "#fff"; }}
          onBlur={(e)  => { e.target.style.borderColor = "rgba(31,143,122,0.22)"; e.target.style.boxShadow = "none"; e.target.style.background = "#f7fdfb"; }}
        />

        {/* Mic / Stop */}
        <button
          onClick={isRecording ? stopRec : startRec}
          title={isRecording ? "Stop" : "Voice message"}
          style={{
            width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
            background: isRecording ? "linear-gradient(135deg,#dc2626,#ef4444)" : "rgba(31,143,122,0.06)",
            border: isRecording ? "none" : "1px solid rgba(31,143,122,0.18)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            animation: isRecording ? "recBeat 1.2s infinite" : "none",
            boxShadow: isRecording ? "0 0 14px rgba(239,68,68,0.3)" : "none",
            transition: "all 0.2s",
          }}
        >
          {isRecording
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="#1F8F7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          }
        </button>

        {/* Send */}
        <button
          onClick={handleSend} disabled={sending} title="Send"
          style={{
            width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
            background: sending ? "rgba(31,143,122,0.25)" : "linear-gradient(135deg,#1F8F7A,#177a67)",
            border: "none", cursor: sending ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: sending ? "none" : "0 4px 16px rgba(31,143,122,0.35)",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(31,143,122,0.5)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = sending ? "none" : "0 4px 16px rgba(31,143,122,0.35)"; }}
        >
          {sending
            ? <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "chatSpin 0.7s linear infinite" }} />
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          }
        </button>
      </div>
    </div>
  );
};

/* =========================
   CHAT INNER
========================= */
const ChatInner = ({ targetUser, authUser, onBack }) => (
  <Window>
    <CustomHeader targetUser={targetUser} authUser={authUser} onBack={onBack} />
    <MessageList />
    <CustomInput />
  </Window>
);

/* =========================
   MAIN PAGE
========================= */
const ChatPage = () => {
  const { userId: targetUserId } = useParams();
  const { user: authUser }       = useContext(AuthContext);
  const navigate                 = useNavigate();

  const [client,     setClient]     = useState(null);
  const [channel,    setChannel]    = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    if (!authUser) return;
    let chatClient;

    const init = async () => {
      try {
        const tok = localStorage.getItem("token");

        const [tokenRes, profileRes] = await Promise.all([
          axios.get("http://localhost:5000/api/chat/token", {
            headers: { Authorization: `Bearer ${tok}` },
          }),
          axios.get(`http://localhost:5000/api/user/public/profile/${targetUserId}`, {
            headers: { Authorization: `Bearer ${tok}` },
          }).catch(() => null),
        ]);

        if (profileRes?.data) {
          const u = profileRes.data.user || profileRes.data;
          setTargetUser(u);
        }

        await axios.post(`http://localhost:5000/api/chat/upsert-user/${targetUserId}`, {},
          { headers: { Authorization: `Bearer ${tok}` } });

        chatClient = StreamChat.getInstance(STREAM_API_KEY);

        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id:    authUser._id,
              name:  authUser.name,
              image: authUser.avatar || authUser.profilePic || "",
            },
            tokenRes.data.token
          );
        }

        const members = [authUser._id.toString(), targetUserId.toString()].sort();
        const ch = chatClient.channel("messaging", `chat-${members[0]}-${members[1]}`, { members });
        await ch.watch();
        setClient(chatClient);
        setChannel(ch);
      } catch (err) {
        console.error("Chat error:", err);
      }
    };

    init();
    return () => { if (chatClient) chatClient.disconnectUser(); };
  }, [authUser, targetUserId]);

  if (!client || !channel) {
    return (
      <div style={{
        height: "80vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
        background: "#f7fdfb", fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: "3px solid rgba(31,143,122,0.15)",
          borderTop: "3px solid #1F8F7A",
          borderRadius: "50%", animation: "chatSpin 0.8s linear infinite",
        }} />
        <p style={{ color: "#1F8F7A", fontWeight: 600, margin: 0, fontSize: "14px", letterSpacing: "0.03em" }}>
          Connecting…
        </p>
        <style>{`@keyframes chatSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{buildTheme()}</style>
      <div style={{
        height: "88vh",
        maxWidth: "920px",
        margin: "0 auto",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(31,143,122,0.15)",
        boxShadow: "0 8px 40px rgba(31,143,122,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column",
        background: "#f7fdfb",
        position: "relative",
      }}>
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <ChatInner targetUser={targetUser} authUser={authUser} onBack={() => navigate(-1)} />
            <Thread />
          </Channel>
        </Chat>
      </div>
    </>
  );
};

export default ChatPage;