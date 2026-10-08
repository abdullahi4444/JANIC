"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export function ContactForm({ initialSubject }: { initialSubject?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject || "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Full name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com)";
    }

    // Phone validation (optional, but validated if provided)
    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone) {
      const phoneDigits = trimmedPhone.replace(/[\s\-()]/g, "");
      if (phoneDigits.length < 6 || !/^\+?[0-9]{6,15}$/.test(phoneDigits)) {
        newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      }
    }

    // Subject validation
    const trimmedSubject = formData.subject.trim();
    if (!trimmedSubject) {
      newErrors.subject = "Subject is required";
    } else if (trimmedSubject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Message validation
    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      newErrors.message = "Message is required";
    } else if (trimmedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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
      setError("Please fill out all required fields correctly before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to deliver message.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending message.");
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
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">Message Delivered</h3>
        <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
          Thank you for reaching out to the JANIC office. An advisor from our department will respond to your email shortly.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            setErrors({});
          }}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
        >
          Send Another Message
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
            Your Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Eng. Ahmed Mohamed"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.name
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="ahmed@example.com"
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
            Phone Number (Optional)
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
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder="e.g. Training Inquiry, General Question"
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.subject
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.subject && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.subject}</span>
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Your Message *
        </label>
        <textarea
          rows={5}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          placeholder="How can JANIC assist you? Please write your query here..."
          className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
            errors.message
              ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
              : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          }`}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.message}</span>
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
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message to JANIC
          </>
        )}
      </button>
    </form>
  );
}
