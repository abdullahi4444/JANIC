"use client";

import React from "react";
import { Hourglass } from "lucide-react";

interface ComingSoonCohortProps {
  year?: string;
}

export function ComingSoonCohort({ year }: ComingSoonCohortProps) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
      {/* Simple Animated Waiting Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#08245C] text-white flex items-center justify-center shadow-md shadow-[#08245C]/15">
        <Hourglass className="w-8 h-8 text-amber-400 animate-pulse" />
      </div>

      {/* Coming Soon Text Only */}
      <h3 className="text-2xl sm:text-3xl font-black text-[#08245C] tracking-tight">
        Coming Soon
      </h3>
    </div>
  );
}
