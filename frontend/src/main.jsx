// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import AuthProvider from "./context/AuthContext";
// import DarkModeProvider from "./context/DarkModeContext"; // correct import
// import "@stream-io/video-react-sdk/dist/css/styles.css";
// import "./index.css";

// // React Query setup
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <QueryClientProvider client={queryClient}>
//       <AuthProvider>
//         <DarkModeProvider> 
//           <App />
//         </DarkModeProvider>
//       </AuthProvider>
//     </QueryClientProvider>
//   </BrowserRouter>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import DarkModeProvider from "./context/DarkModeContext";
import { NotificationProvider } from "./context/NotificationContext";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./index.css";

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </DarkModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
