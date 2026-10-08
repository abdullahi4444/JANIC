"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface FormErrors {
  organizationName?: string;
  organizationType?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  collaborationArea?: string;
  proposalDetails?: string;
}

export function PartnershipForm() {
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "Tech Company / Industry",
    contactName: "",
    email: "",
    phone: "",
    collaborationArea: "Student Incubation & Mentorship",
    proposalDetails: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Organization Name
    const trimmedOrg = formData.organizationName.trim();
    if (!trimmedOrg) {
      newErrors.organizationName = "Organization or Entity name is required";
    } else if (trimmedOrg.length < 2) {
      newErrors.organizationName = "Organization name must be at least 2 characters";
    }

    // Contact Person
    const trimmedContact = formData.contactName.trim();
    if (!trimmedContact) {
      newErrors.contactName = "Primary contact person name is required";
    } else if (trimmedContact.length < 2) {
      newErrors.contactName = "Contact person name must be at least 2 characters";
    }

    // Email
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Official email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address (e.g. partner@organization.com)";
    }

    // Phone (optional, but validate if entered)
    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone) {
      const phoneDigits = trimmedPhone.replace(/[\s\-()]/g, "");
      if (phoneDigits.length < 6 || !/^\+?[0-9]{6,15}$/.test(phoneDigits)) {
        newErrors.phone = "Please enter a valid contact phone number (at least 6 digits)";
      }
    }

    // Proposal Details
    const trimmedProposal = formData.proposalDetails.trim();
    if (!trimmedProposal) {
      newErrors.proposalDetails = "Proposal overview and objectives are required";
    } else if (trimmedProposal.length < 15) {
      newErrors.proposalDetails = "Please provide more details about your proposal (at least 15 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setError("Please resolve the highlighted validation errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit partnership inquiry.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">Partnership Proposal Received</h3>
        <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
          Thank you for reaching out. The JANIC External Relations & Faculty Advisory Board will review your proposal and respond within 2-3 business days.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              organizationName: "",
              organizationType: "Tech Company / Industry",
              contactName: "",
              email: "",
              phone: "",
              collaborationArea: "Student Incubation & Mentorship",
              proposalDetails: "",
            });
            setErrors({});
          }}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Organization / Entity Name *
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => handleInputChange("organizationName", e.target.value)}
            placeholder="e.g. Hormuud Telecom, UNDP, Tech Lab"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.organizationName
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.organizationName && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.organizationName}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Organization Type *
          </label>
          <select
            value={formData.organizationType}
            onChange={(e) => handleInputChange("organizationType", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Tech Company / Industry</option>
            <option>University / Academic Partner</option>
            <option>Government Ministry / Agency</option>
            <option>NGO / Development Partner</option>
            <option>Startup / Venture Capital</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Primary Contact Person *
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => handleInputChange("contactName", e.target.value)}
            placeholder="Full Name & Title"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.contactName
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.contactName && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.contactName}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Official Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="partner@organization.com"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.email
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Contact Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+252 61..."
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.phone
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Primary Area of Collaboration *
          </label>
          <select
            value={formData.collaborationArea}
            onChange={(e) => handleInputChange("collaborationArea", e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Student Incubation & Mentorship</option>
            <option>Joint Research & Academic Exchange</option>
            <option>Hardware Lab Sponsorship</option>
            <option>Graduate Hiring & Internships</option>
            <option>Event Sponsorship / Hackathons</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Proposal Overview & Objectives *
        </label>
        <textarea
          rows={4}
          value={formData.proposalDetails}
          onChange={(e) => handleInputChange("proposalDetails", e.target.value)}
          placeholder="Briefly describe the potential synergy, project scope, or goals of collaboration..."
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
            errors.proposalDetails
              ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
              : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {errors.proposalDetails && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.proposalDetails}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 bg-[#0875D1] hover:bg-[#065ea8] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Proposal...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Partnership Proposal
          </>
        )}
      </button>
    </form>
  );
}
