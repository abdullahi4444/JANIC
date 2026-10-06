import React from "react";
import {
  Lightbulb,
  Layers,
  Cpu,
  CheckCircle2,
  Award,
  Rocket,
} from "lucide-react";

interface PipelineStep {
  number: string;
  name: string;
  tagline: string;
  deliverable: string;
  icon: React.ElementType;
}

const pipelineSteps: PipelineStep[] = [
  {
    number: "01",
    name: "Idea",
    tagline: "Identify real-world problems and formulate hypotheses.",
    deliverable: "Problem Brief",
    icon: Lightbulb,
  },
  {
    number: "02",
    name: "Design",
    tagline: "Develop system architecture, blueprints, and UI specs.",
    deliverable: "System Spec",
    icon: Layers,
  },
  {
    number: "03",
    name: "Build",
    tagline: "Engineer functional hardware prototypes and codebases.",
    deliverable: "Working MVP",
    icon: Cpu,
  },
  {
    number: "04",
    name: "Test",
    tagline: "Rigorous laboratory validation, debugging, and trials.",
    deliverable: "Field Validated",
    icon: CheckCircle2,
  },
  {
    number: "05",
    name: "Showcase",
    tagline: "Demonstrate innovations live at Annual Demo Day.",
    deliverable: "Demo Pitch",
    icon: Award,
  },
  {
    number: "06",
    name: "Scale",
    tagline: "Incubate, partner, file IP, and deploy to market.",
    deliverable: "Market Launch",
    icon: Rocket,
  },
];

export function InnovationPipelineNodes() {
  return (
    <div className="space-y-8 select-none">
      {/* 6 Connected Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
        {pipelineSteps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === pipelineSteps.length - 1;

          return (
            <div
              key={step.name}
              className="group relative bg-[#06193b]/70 hover:bg-[#09224f] border border-blue-900/50 hover:border-blue-400/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-500/0 group-hover:via-blue-400/80 to-transparent transition-all" />

              <div>
                {/* Header row: Step number + directional arrow */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-blue-400/90 tracking-wider">
                    {step.number}
                  </span>
                  {!isLast && (
                    <span className="hidden lg:block text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs font-bold">
                      →
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-white tracking-tight mb-1.5">
                  {step.name}
                </h3>

                {/* Description */}
                <p className="text-[12px] text-slate-300/85 leading-relaxed font-normal">
                  {step.tagline}
                </p>
              </div>

              {/* Deliverable Badge */}
              <div className="pt-4 mt-4 border-t border-blue-900/40">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-300/90 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md">
                  {step.deliverable}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
