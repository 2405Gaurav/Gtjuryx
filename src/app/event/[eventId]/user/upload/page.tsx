

// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useUploadStore, useUserDetails } from "@/hooks/useStore";
// import { unzipFromUrl } from "@/libs/unzip-utils";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CloudDownload,
//   Loader2,
//   Database,
//   Clock,
//   ArrowRight,
//   ShieldCheck,
//   Upload,
//   Maximize2,
//   FileCode,
//   Terminal,
//   Cpu,
//   CheckCircle2,
// } from "lucide-react";

// // Import your existing component
// import UserUpload from "@/component/UserUpload";

// interface TeamParticipant {
//   id: number;
//   email: string;
//   storageUrl: string | null;
// }

// interface TeamData {
//   id: string;
//   name: string;
//   participants: TeamParticipant[];
//   storageUrl?: string | null;
// }

// export default function ProjectUploadPage() {
//   const router = useRouter();
//   const { eventId } = useParams();
//   const { user } = useUserDetails();
//   const { setFiles } = useUploadStore();

//   // State
//   const [existingUrl, setExistingUrl] = useState<TeamData["storageUrl"]>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isFetchingTeam, setIsFetchingTeam] = useState(true);
//   const [showUploadPanel, setShowUploadPanel] = useState(false);

//   // --- 1. Fetch Team Data ---
//   useEffect(() => {
//     const fetchTeam = async () => {
//       if (!user || !eventId) return;
//       try {
//         const res = await axios.get(
//           `/api/users/getTeam?eventId=${eventId}&userId=${user.id}`
//         );
//         console.log("Fetched team data:", res.data);
//         const teamData: TeamData = res.data.team || res.data;
//         console.log("Team Data:", teamData);
//         if (teamData) {
//           // const uploader = teamData.participants.find((p) => p.storageUrl);
//           // if (uploader?.storageUrl) {
//           // }
//           setExistingUrl(teamData.storageUrl);
//         }
//       } catch (error) {
//         console.error("Error fetching team:", error);
//       } finally {
//         setIsFetchingTeam(false);
//       }
//     };
//     fetchTeam();
//   }, [user, eventId]);

//   // --- 2. Handle Load Existing Project ---
//   const handleLoadExisting = async () => {
//     if (!existingUrl) return;
//     setIsLoading(true);

//     try {
//       const filesMap = await unzipFromUrl(existingUrl);
//       const reconstructedFiles: File[] = Object.entries(filesMap).map(
//         ([path, content]) => {
//           const file = new File([content as string], path, {
//             type: "text/plain",
//           });
//           Object.defineProperty(file, "webkitRelativePath", {
//             value: path.startsWith("/") ? path.slice(1) : path,
//           });
//           return file;
//         }
//       );
//       setFiles(reconstructedFiles);
//       setTimeout(() => {
//         router.push(`/event/${eventId}/user/dashboard`);
//       }, 1000);
//     } catch (error) {
//       console.error("Failed to load existing project:", error);
//       alert("Failed to download or unzip project files.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-[100vh] mt-18 bg-zinc-950 text-zinc-300 font-sans overflow-hidden relative flex selection:bg-indigo-500/30">
//       {/* --- 1. Background (Grid + Vignette - No Purple Blobs) --- */}
//       <div className="absolute inset-0 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-100" />
//         <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
//       </div>

//       {/* --- 2. LEFT PANEL: DASHBOARD --- */}
//       <motion.div
//         layout
//         initial={{ width: "100%" }}
//         animate={{ width: showUploadPanel ? "55%" : "100%" }}
//         transition={{ type: "spring", stiffness: 200, damping: 25 }}
//         className="h-full z-10 flex flex-col relative"
//       >
//         <div className="w-full h-full flex flex-col p-8 max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="flex items-start justify-between mb-10 shrink-0">
//             <div>
//               <div className="flex items-center gap-3 mb-1">
//                 <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 shadow-sm">
//                   <Terminal className="w-5 h-5 text-indigo-500" />
//                 </div>
//                 <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
//                   Source Control
//                 </h1>
//               </div>
//               <p className="text-zinc-500 text-sm ml-[3.25rem]">
//                 Manage repository and deployment artifacts.
//               </p>
//             </div>

//             {/* Sync Status Badge */}
//             <div className="hidden md:flex items-center gap-2 text-[11px] font-medium bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//               </span>
//               <span>System Online</span>
//             </div>
//           </div>

//           {/* Main Content Area - Centered Verticality */}
//           <div className="flex flex-col pb-20">
//             {isFetchingTeam ? (
//               <div className="flex items-center gap-3 text-sm text-zinc-500 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 mx-auto ">
//                 <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
//                 Retrieving project data...
//               </div>
//             ) : (
//               <div className="w-full max-w-2xl ">
//                 {/* === CASE A: EXISTING PROJECT CARD === */}
//                 {existingUrl ? (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 rounded-xl overflow-hidden shadow-2xl shadow-black/20"
//                   >
//                     {/* Top Decoration Line */}
//                     <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-indigo-600 opacity-100" />

//                     {/* --- STATUS BANNER (User Request) --- */}
//                     <div className="px-6 py-2 bg-emerald-950/20 border-b border-emerald-500/10 flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
//                         <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
//                           Existing Project Found
//                         </span>
//                       </div>
//                       <span className="text-[10px] text-emerald-500/60 font-mono">
//                         v1.0.2-stable
//                       </span>
//                     </div>

//                     <div className="p-6">
//                       <div className="flex items-start justify-between gap-5 mb-8">
//                         <div className="flex gap-5">
//                           {/* File Icon */}
//                           <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500 shadow-inner">
//                             <CloudDownload className="w-7 h-7" />
//                           </div>

//                           {/* Details */}
//                           <div>
//                             <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                               Project Archive
//                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
//                             </h3>
//                             <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
//                               <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800">
//                                 <Database className="w-3 h-3" />
//                                 <span className="font-mono text-zinc-300 truncate max-w-[150px]">
//                                   {existingUrl.split("/").pop()}
//                                 </span>
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <Clock className="w-3 h-3" /> Ready
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-3">
//                         <button
//                           onClick={handleLoadExisting}
//                           disabled={isLoading}
//                           className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
//                         >
//                           {isLoading ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : (
//                             <FileCode className="w-4 h-4" />
//                           )}
//                           Load Project
//                         </button>

//                         <button
//                           onClick={() => setShowUploadPanel(true)}
//                           disabled={showUploadPanel}
//                           className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-lg border border-zinc-700 transition-colors flex items-center gap-2"
//                           title="Upload a new project archive to replace the existing one"
//                         >
//                           <Upload className="w-4 h-4" />
//                           Update
//                         </button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ) : (
//                   /* === CASE B: EMPTY STATE (INITIAL) === */
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden"
//                   >
//                     <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center mb-5 text-indigo-400 shadow-xl">
//                       <Cpu className="w-8 h-8" />
//                     </div>

//                     <h2 className="text-xl font-bold text-white mb-2">
//                       Initialize Repository
//                     </h2>
//                     <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
//                       Upload your project source code to begin. We accept
//                       compressed archives (.zip) containing your root directory.
//                     </p>

//                     <button
//                       onClick={() => setShowUploadPanel(true)}
//                       disabled={showUploadPanel}
//                       className={`group flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/20 ${
//                         showUploadPanel ? "opacity-50 cursor-default" : ""
//                       }`}
//                     >
//                       <Upload className="w-4 h-4" />
//                       <span>Upload Source Code</span>
//                       <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
//                     </button>
//                   </motion.div>
//                 )}

//                 {/* Footer Info */}
//                 {!showUploadPanel && (
//                   <div className="mt-6 text-center">
//                     <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
//                       Secure Environment • End-to-End Encrypted
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* --- 3. RIGHT PANEL: UPLOAD WIZARD --- */}
//       <AnimatePresence>
//         {showUploadPanel && (
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 25,
//               mass: 0.8,
//             }}
//             className="w-[45%] h-full z-20 border-l border-zinc-800 bg-zinc-950/80 backdrop-blur-xl absolute right-0 top-0 shadow-2xl shadow-black"
//           >
//             <div className="h-full flex flex-col">
//               {/* Header */}
//               <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
//                   <div>
//                     <h2 className="text-sm font-bold text-white uppercase tracking-wider">
//                       Upload Manager
//                     </h2>
//                     <p className="text-[10px] text-zinc-500">
//                       Awaiting files...
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowUploadPanel(false)}
//                   className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
//                 >
//                   <Maximize2 className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Upload Component Container */}
//               <div className="flex-1 relative overflow-hidden bg-zinc-900/20">
//                 <div className="absolute inset-0 p-6 flex flex-col justify-center">
//                   <div className="w-full max-w-md mx-auto h-full max-h-[500px]">
//                     {/* The UserUpload component renders here */}
//                     <UserUpload />
//                   </div>
//                 </div>
//               </div>

//               {/* Bottom Decoration */}
//               <div className="h-1 w-full bg-gradient-to-r from-zinc-900 via-indigo-900/20 to-zinc-900"></div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUploadStore } from "@/hooks/useStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Upload,
  Terminal,
  Cpu,
  FileCode,
  X,
  FolderOpen,
} from "lucide-react";

export default function ProjectUploadPage() {
  const router = useRouter();
  const { eventId } = useParams();
  const { files, setFiles } = useUploadStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles(newFiles);
  };

  // Handle folder selection
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles(newFiles);
  };

  // Upload and view files
  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select files first");
      return;
    }

    setIsLoading(true);
    
    // Store files in the store
    setFiles(selectedFiles);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/event/${eventId}/user/dashboard`);
    }, 1000);
  };

  // Load existing files
  const handleLoadExisting = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/event/${eventId}/user/dashboard`);
    }, 1000);
  };

  return (
    <div className="h-[100vh] mt-18 bg-zinc-950 text-zinc-300 font-sans overflow-hidden relative flex selection:bg-indigo-500/30">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      {/* LEFT PANEL: Main Dashboard */}
      <motion.div
        layout
        initial={{ width: "100%" }}
        animate={{ width: showUploadPanel ? "55%" : "100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="h-full z-10 flex flex-col relative"
      >
        <div className="w-full h-full flex flex-col p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-10 shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 shadow-sm">
                  <Terminal className="w-5 h-5 text-indigo-500" />
                </div>
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
                  Project Manager
                </h1>
              </div>
              <p className="text-zinc-500 text-sm ml-[3.25rem]">
                Upload and manage your project files locally.
              </p>
            </div>

            {/* Status Badge */}
            <div className="hidden md:flex items-center gap-2 text-[11px] font-medium bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Ready</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col pb-20">
            <div className="w-full max-w-2xl mx-auto">
              {files.length > 0 ? (
                /* Existing Project Card */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 rounded-xl overflow-hidden shadow-2xl shadow-black/20"
                >
                  <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-indigo-600 opacity-100" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-5 mb-8">
                      <div className="flex gap-5">
                        <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500 shadow-inner">
                          <FolderOpen className="w-7 h-7" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Project Files
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                            <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-800">
                              <FileCode className="w-3 h-3" />
                              <span className="font-mono text-zinc-300">
                                {files.length} files
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleLoadExisting}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                        View Files
                      </button>

                      <button
                        onClick={() => setShowUploadPanel(true)}
                        disabled={showUploadPanel}
                        className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm rounded-lg border border-zinc-700 transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Update
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900/40 border border-zinc-800 border-dashed rounded-xl p-8 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center mb-5 text-indigo-400 shadow-xl">
                    <Cpu className="w-8 h-8" />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">
                    No Project Loaded
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-8">
                    Upload your project files to begin. You can select individual files or entire folders.
                  </p>

                  <button
                    onClick={() => setShowUploadPanel(true)}
                    disabled={showUploadPanel}
                    className={`group flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/20 ${
                      showUploadPanel ? "opacity-50 cursor-default" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL: Upload Panel */}
      <AnimatePresence>
        {showUploadPanel && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.8,
            }}
            className="w-[45%] h-full z-20 border-l border-zinc-800 bg-zinc-950/80 backdrop-blur-xl absolute right-0 top-0 shadow-2xl shadow-black"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Upload Manager
                    </h2>
                    <p className="text-[10px] text-zinc-500">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "No files selected"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadPanel(false)}
                  className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Area */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-md mx-auto space-y-4">
                  {/* File Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Select Files
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Folder Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Or Select Folder
                    </label>
                    <input
                      type="file"
                      {...({ webkitdirectory: "", directory: "" })}
                      onChange={handleFolderSelect}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Selected Files List */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-zinc-300 mb-2">
                        Selected Files ({selectedFiles.length})
                      </h3>
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 max-h-48 overflow-auto">
                        {selectedFiles.slice(0, 10).map((file, index) => (
                          <div key={index} className="text-xs text-zinc-400 py-1 truncate">
                            {file.webkitRelativePath || file.name}
                          </div>
                        ))}
                        {selectedFiles.length > 10 && (
                          <div className="text-xs text-zinc-500 py-1">
                            ... and {selectedFiles.length - 10} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || isLoading}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg mt-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload & View
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="h-1 w-full bg-gradient-to-r from-zinc-900 via-indigo-900/20 to-zinc-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}