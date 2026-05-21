// import { useEffect, useState, useCallback } from "react";
// import { useNotifications } from "../context/NotificationContext";

// const TYPE_ICON = {
//   review:   "⭐",
//   badge:    "🏅",
//   session:  "📅",
//   request:  "🤝",
//   accepted: "✅",
//   match:    "🔗",
//   message:  "💬",
// };

// function ToastCard({ notif, onDismiss }) {
//   const [phase, setPhase] = useState("in"); // in → show → out

//   useEffect(() => {
//     const t1 = setTimeout(() => setPhase("show"), 10);
//     const t2 = setTimeout(() => setPhase("out"),  4000);
//     const t3 = setTimeout(() => onDismiss(notif.toastId), 4450);
//     return () => [t1, t2, t3].forEach(clearTimeout);
//   }, []);

//   const close = () => {
//     setPhase("out");
//     setTimeout(() => onDismiss(notif.toastId), 450);
//   };

//   const translate = phase === "show" ? "translateX(0)" : "translateX(110%)";
//   const opacity   = phase === "show" ? 1 : 0;

//   return (
//     <div
//       style={{
//         transform:  translate,
//         opacity,
//         transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
//         position:   "relative",
//         overflow:   "hidden",
//         width:      "320px",
//       }}
//       className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3"
//     >
//       {/* Left accent bar */}
//       <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-l-2xl" />

//       {/* Icon */}
//       <span className="text-2xl leading-none mt-0.5 ml-2 select-none">
//         {TYPE_ICON[notif.type] || "🔔"}
//       </span>

//       {/* Body */}
//       <div className="flex-1 min-w-0">
//         <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-0.5">
//           New Notification
//         </p>
//         <p className="text-sm text-gray-700 leading-snug break-words">
//           {notif.message}
//         </p>
//       </div>

//       {/* Close */}
//       <button
//         onClick={close}
//         className="text-gray-300 hover:text-gray-500 text-xl leading-none flex-shrink-0 transition-colors"
//       >
//         ×
//       </button>

//       {/* Progress bar */}
//       <div
//         className="absolute bottom-0 left-0 h-[3px] bg-teal-400"
//         style={{ animation: "toast-shrink 4s linear forwards" }}
//       />

//       <style>{`
//         @keyframes toast-shrink {
//           from { width: 100%; }
//           to   { width: 0%; }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default function NotificationToast() {
//   const { toasts, dismissToast } = useNotifications();

//   if (!toasts.length) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top:      "80px",
//         right:    "16px",
//         zIndex:   9999,
//         display:  "flex",
//         flexDirection: "column",
//         gap: "10px",
//       }}
//     >
//       {toasts.map(t => (
//         <ToastCard key={t.toastId} notif={t} onDismiss={dismissToast} />
//       ))}
//     </div>
//   );
// }


import { useEffect, useState, useCallback } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Star, Award, CalendarDays, Users, CircleCheck, Link2, MessageSquare, Bell } from "lucide-react";

const TYPE_ICON = {
  review:   <Star         size={20} className="text-amber-500" />,
  badge:    <Award        size={20} className="text-amber-600" />,
  session:  <CalendarDays size={20} className="text-blue-500"  />,
  request:  <Users        size={20} className="text-violet-500"/>,
  accepted: <CircleCheck  size={20} className="text-green-500" />,
  match:    <Link2        size={20} className="text-coral-500" style={{color:"#D85A30"}} />,
  message:  <MessageSquare size={20} className="text-pink-500" />,
};

function ToastCard({ notif, onDismiss }) {
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 10);
    const t2 = setTimeout(() => setPhase("out"),  4000);
    const t3 = setTimeout(() => onDismiss(notif.toastId), 4450);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const close = () => {
    setPhase("out");
    setTimeout(() => onDismiss(notif.toastId), 450);
  };

  const translate = phase === "show" ? "translateX(0)" : "translateX(110%)";
  const opacity   = phase === "show" ? 1 : 0;

  return (
    <div
      style={{
        transform:  translate,
        opacity,
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
        position:   "relative",
        overflow:   "hidden",
        width:      "320px",
      }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-l-2xl" />

      {/* Icon */}
      <span className="mt-0.5 ml-2 flex-shrink-0 flex items-center justify-center">
        {TYPE_ICON[notif.type] || <Bell size={20} className="text-teal-500" />}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-0.5">
          New Notification
        </p>
        <p className="text-sm text-gray-700 leading-snug break-words">
          {notif.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={close}
        className="text-gray-300 hover:text-gray-500 text-xl leading-none flex-shrink-0 transition-colors"
      >
        ×
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-teal-400"
        style={{ animation: "toast-shrink 4s linear forwards" }}
      />

      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export default function NotificationToast() {
  const { toasts, dismissToast } = useNotifications();

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        top:      "80px",
        right:    "16px",
        zIndex:   9999,
        display:  "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {toasts.map(t => (
        <ToastCard key={t.toastId} notif={t} onDismiss={dismissToast} />
      ))}
    </div>
  );
}