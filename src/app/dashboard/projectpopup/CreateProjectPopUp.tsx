"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateProjectPopupProps {
  onClose: () => void;
}

export default function CreateProjectPopup({ onClose }: CreateProjectPopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      startDate,
      deadline,
      budget,
      attachments,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />

        {/* Popup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-full max-w-xl bg-white shadow-lg rounded-xl z-50 p-5"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-base font-medium text-gray-700">New Project</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="mt-4 overflow-y-auto max-h-[70vh]">
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Title */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter project title"
                />
              </div>

              {/* Dates + Budget */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="Enter budget"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none text-sm"
                  placeholder="Enter project description"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Attachments
                </label>
                <div className="border border-dashed border-gray-300 rounded-md p-5 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex flex-col items-center text-gray-500"
                  >
                    <Upload size={22} className="mb-1" />
                    <span className="text-xs">Click to upload files</span>
                  </label>
                  {attachments.length > 0 && (
                    <ul className="mt-3 text-xs text-gray-600 text-left">
                      {attachments.map((file, index) => (
                        <li key={index}>📎 {file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Create Project
              </button>
            </form>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
