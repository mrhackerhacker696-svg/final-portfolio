import React, { useEffect, useRef, useState } from "react";
import {
  Code2,
  Cpu,
  Rocket,
  Zap,
  Database,
  Cloud,
  Globe,
  Shield,
  Sparkles,
  TrendingUp,
  Bot,
  Layers,
} from "lucide-react";

const TechShowcase = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const currentRef = canvasRef.current?.parentElement;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        color: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"][
          Math.floor(Math.random() * 4)
        ],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth)
          particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight)
          particle.vy *= -1;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = ((100 - distance) / 100) * 0.3;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible]);

  const techStack = [
    {
      icon: Code2,
      name: "React/TypeScript",
      level: 95,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      name: "Node.js/MongoDB",
      level: 90,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Cloud,
      name: "AWS/GCP",
      level: 85,
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Bot,
      name: "AI/ML Integration",
      level: 88,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      name: "Security/DevOps",
      level: 82,
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Globe,
      name: "Web3/Blockchain",
      level: 78,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const achievements = [
    {
      icon: Rocket,
      value: "50+",
      label: "Projects Delivered",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      value: "99%",
      label: "Client Satisfaction",
      color: "text-green-500",
    },
    {
      icon: Zap,
      value: "3+",
      label: "Years Experience",
      color: "text-purple-500",
    },
    {
      icon: Sparkles,
      value: "24/7",
      label: "Problem Solving",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: "transparent" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <Cpu className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-blue-300 font-medium">Tech Excellence</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Cutting-Edge
            <br />
            <span className="relative">
              Technology Stack
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-lg" />
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Leveraging the latest technologies and frameworks to build
            <span className="text-cyan-400 font-semibold"> scalable</span>,
            <span className="text-green-400 font-semibold"> secure</span>, and
            <span className="text-purple-400 font-semibold">
              {" "}
              innovative
            </span>{" "}
            solutions
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isVisible
                  ? "slideInUp 0.8s ease-out forwards"
                  : "none",
              }}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500 blur-xl`}
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <tech.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {tech.name}
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${tech.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: isVisible ? `${tech.level}%` : "0%",
                        animationDelay: `${index * 200}ms`,
                      }}
                    />
                  </div>
                  <span className="text-gray-300 font-medium">
                    {tech.level}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="text-center group"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: isVisible
                  ? "fadeInUp 0.8s ease-out forwards"
                  : "none",
              }}
            >
              <div className="relative mb-4">
                <div
                  className={`w-16 h-16 mx-auto ${achievement.color} bg-current/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <achievement.icon
                    className={`h-8 w-8 ${achievement.color}`}
                  />
                </div>
                <div className="absolute inset-0 bg-current/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
                {achievement.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group">
            <span>Let's Build Something Amazing</span>
            <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
    </div>
  );
};

export default TechShowcase;
