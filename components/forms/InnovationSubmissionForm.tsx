"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send, Sparkles, UploadCloud } from "lucide-react";

export function InnovationSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Platform",
    problemStatement: "",
    solutionDescription: "",
    technologyStack: "",
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
    facultyOrDepartment: "Faculty of Computer Science & IT",
    studentId: "",
    teamMembers: "",
    prototypeUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit innovation proposal.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting proposal.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-900">Innovation Proposal Received!</h3>
        <p className="text-sm text-emerald-700 max-w-lg mx-auto leading-relaxed">
          Your project proposal has been successfully submitted to the JANIC Review Committee. Our faculty mentors review submissions weekly and will notify you by email for the interview and prototype demonstration stage.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              title: "",
              category: "Web Platform",
              problemStatement: "",
              solutionDescription: "",
              technologyStack: "",
              submitterName: "",
              submitterEmail: "",
              submitterPhone: "",
              facultyOrDepartment: "Faculty of Computer Science & IT",
              studentId: "",
              teamMembers: "",
              prototypeUrl: "",
              videoUrl: "",
            });
          }}
          className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition"
        >
          Submit Another Proposal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Part 1: Project Information */}
      <div className="space-y-4 pb-4 border-b border-slate-100">
        <h4 className="text-sm font-bold text-[#08245C] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1]" />
          1. Project Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project / System Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Robot Car Cleaner, Autonomous Solar Irrigation"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Web Platform</option>
              <option>Robotics / Arduino</option>
              <option>IoT / Automation</option>
              <option>HealthTech / API</option>
              <option>AI / Machine Learning</option>
              <option>Information Systems</option>
              <option>Cybersecurity</option>
              <option>Branding & Design</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            The Problem Statement *
          </label>
          <textarea
            rows={3}
            required
            value={formData.problemStatement}
            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            placeholder="What specific challenge does your innovation solve? Who experiences this problem?"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            The Solution & Technical Approach *
          </label>
          <textarea
            rows={3}
            required
            value={formData.solutionDescription}
            onChange={(e) => setFormData({ ...formData, solutionDescription: e.target.value })}
            placeholder="How does your system work? Describe the architecture, hardware components, or algorithms..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Technologies & Tools Used
          </label>
          <input
            type="text"
            value={formData.technologyStack}
            onChange={(e) => setFormData({ ...formData, technologyStack: e.target.value })}
            placeholder="e.g. Arduino Mega, Next.js, ESP32, Python, Ultrasonic Sensors"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Part 2: Submitter & Team Information */}
      <div className="space-y-4 pb-4 border-b border-slate-100">
        <h4 className="text-sm font-bold text-[#08245C] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1]" />
          2. Team & Submitter Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lead Submitter Name *
            </label>
            <input
              type="text"
              required
              value={formData.submitterName}
              onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
              placeholder="Your Full Name"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.submitterEmail}
              onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
              placeholder="student@jazeera.edu.so"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.submitterPhone}
              onChange={(e) => setFormData({ ...formData, submitterPhone: e.target.value })}
              placeholder="+252 61..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Student ID / Registration No. (Optional)
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="e.g. JU/CS/2023/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Faculty / Department
            </label>
            <input
              type="text"
              value={formData.facultyOrDepartment}
              onChange={(e) => setFormData({ ...formData, facultyOrDepartment: e.target.value })}
              placeholder="Faculty of Computer Science & IT"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Team Members (Names & Roles)
          </label>
          <input
            type="text"
            value={formData.teamMembers}
            onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
            placeholder="e.g. Ahmed Ali (Hardware), Hafsa Omar (Firmware), Bilal Hassan (Software)"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Part 3: Links / Demos */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#08245C] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1]" />
          3. Demos & Repository Links (Optional)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Live Demo / GitHub Repository URL
            </label>
            <input
              type="url"
              value={formData.prototypeUrl}
              onChange={(e) => setFormData({ ...formData, prototypeUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Video Demonstration URL (YouTube / Google Drive)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Transmitting Proposal to Review Board...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Innovation to JANIC Hub
          </>
        )}
      </button>
    </form>
  );
}
