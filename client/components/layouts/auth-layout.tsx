"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const DSA_SESSIONS = [
  {
    id: 1,
    image: "/images/auth/auth1.jpg",
    title: "The Ultimate DSA Powerhouse",
    description: "Master everything from Linked Lists to Dynamic Programming in one unified environment. Designed for the modern developer.",
  },
  {
    id: 2,
    image: "/images/auth/auth2.jpg",
    title: "Advanced Visualizers",
    description: "Don't just code—see it. Watch your data structures come to life with real-time memory mapping and pointer tracking.",
  },
  {
    id: 3,
    image: "/images/auth/auth3.jpg",
    title: "Feature-Rich Ecosystem",
    description: "Automated judging, complexity analysis, and step-by-step debugging. Everything you need to crack the FAANG interview.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DSA_SESSIONS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full mx-auto relative flex items-center justify-center text-foreground bg-background">
      <div className="relative size-full flex flex-col lg:flex-row">

        <div className="w-full lg:w-[40%] xl:w-[30%] flex flex-col items-center justify-center z-10">
            <div className="absolute top-10 left-10 lg:left-12">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                   <span className="text-primary">Klaus</span> Judge
                </h1>
            </div>

            <div className="w-full  animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {children}
            </div>
        </div>

        {/* RIGHT SIDE: DSA CAROUSEL */}
        <div className="relative hidden lg:flex lg:w-[60%] xl:w-[70%] h-full overflow-hidden bg-black">
            {DSA_SESSIONS.map((slide, i) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        i === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
                    }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={i === 0}
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-primary/15 to-secondary/25" />

                    {/* LARGE TEXT CONTENT */}
                    <div className="absolute bottom-32 left-20 right-20 z-20">
                        <div className={`transition-all duration-1000 delay-300 transform ${
                            i === currentSlide ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                        }`}>
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                {slide.title}
                            </h2>
                            <p className="text-xl xl:text-2xl text-gray-300 max-w-2xl font-light leading-relaxed">
                                {slide.description}
                            </p>

                            <div className="mt-10 h-1.5 w-32 bg-gradient-to-r from-primary to-secondary rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
