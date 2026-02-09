import React from 'react';
import { Cpu, Globe, Trophy, Zap } from 'lucide-react';

const features = [
  {
    title: "Real-time Compiler",
    desc: "Support for 20+ languages with instant feedback and test case visualization.",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    title: "Curated Study Plans",
    desc: "From 'Top 100 Liked' to '75 Blind', we have the tracks that actually matter.",
    icon: <Cpu className="w-6 h-6 text-secondary" />,
  },
  {
    title: "Global Contests",
    desc: "Compete with engineers worldwide every Sunday and climb the global ranks.",
    icon: <Trophy className="w-6 h-6 text-primary" />,
  },
  {
    title: "Mock Interviews",
    desc: "Connect with peers and practice technical interviews in our live collaborative editor.",
    icon: <Globe className="w-6 h-6 text-secondary" />,
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/5 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-b from-primary/5 to-secondary/10 blur-[120px]" />
        </div>

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-normal text-foreground tracking-[2px]">Everything you need to succeed</h2>
          <p className="text-foreground-secondary mt-4 text-lg tracking-[1px]">Built by engineers, for engineers.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-card/30 border border-primary/20 rounded-xs hover:border-primary/50 transition-colors">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-foreground-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
