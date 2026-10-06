"use client";

import React, { useEffect, useRef, useState } from "react";

export type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "blur-in"
  | "tilt-up";

export type ScrollRevealTag =
  | "div"
  | "section"
  | "article"
  | "main"
  | "aside"
  | "span";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: ScrollRevealTag;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  className = "",
  as: Component = "div",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  // Initial hidden state before scroll reveal
  const getInitialClasses = () => {
    switch (animation) {
      case "fade-up":
        return "opacity-0 translate-y-12";
      case "fade-down":
        return "opacity-0 -translate-y-12";
      case "fade-left":
        return "opacity-0 translate-x-12";
      case "fade-right":
        return "opacity-0 -translate-x-12";
      case "zoom-in":
        return "opacity-0 scale-[0.92]";
      case "zoom-out":
        return "opacity-0 scale-[1.08]";
      case "blur-in":
        return "opacity-0 blur-md scale-[0.97]";
      case "tilt-up":
        return "opacity-0 translate-y-12 rotate-[1.5deg]";
      default:
        return "opacity-0 translate-y-10";
    }
  };

  // Revealed state once scrolled into view
  const getRevealedClasses = () => {
    switch (animation) {
      case "fade-up":
      case "fade-down":
        return "opacity-100 translate-y-0";
      case "fade-left":
      case "fade-right":
        return "opacity-100 translate-x-0";
      case "zoom-in":
      case "zoom-out":
        return "opacity-100 scale-100";
      case "blur-in":
        return "opacity-100 blur-none scale-100";
      case "tilt-up":
        return "opacity-100 translate-y-0 rotate-0";
      default:
        return "opacity-100 translate-y-0";
    }
  };

  const style: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Apple/Vercel smooth spring curve
    willChange: "transform, opacity, filter",
  };

  // Avoid JSX IntrinsicElements union type explosion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DynamicTag = Component as any;

  return (
    <DynamicTag
      ref={domRef}
      style={style}
      className={`transition-all duration-700 ease-out transform-gpu ${
        isVisible ? getRevealedClasses() : getInitialClasses()
      } ${className}`}
    >
      {children}
    </DynamicTag>
  );
}
