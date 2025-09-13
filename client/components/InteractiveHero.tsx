import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Code,
  Zap,
  Rocket,
  Download,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  User,
} from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";

const InteractiveHero = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(0);
  // Auto-rotate titles without manual controls

  const titles = [
    "Full-Stack Developer",
    "UI/UX Enthusiast",
    "Problem Solver",
    "Tech Innovator",
    "Code Architect",
  ];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseenter", () => setIsHovered(true));
      hero.addEventListener("mouseleave", () => setIsHovered(false));

      return () => {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseenter", () => setIsHovered(true));
        hero.removeEventListener("mouseleave", () => setIsHovered(false));
      };
    }
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [titles.length]);

  const parallaxStyle = {
    transform: `translate3d(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px, 0)`,
    transition: isHovered ? "none" : "transform 0.3s ease-out",
  };

  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    speed: Math.random() * 2 + 1,
    color: ["cyan", "blue", "purple", "pink", "green"][
      Math.floor(Math.random() * 5)
    ],
  }));

  const handleGetInTouch = () => {
    // If we're on the homepage, scroll to contact section
    if (location.pathname === '/') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If we're on another page, navigate to homepage contact section
      navigate('/#contact');
    }
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className={`absolute opacity-10 rounded-full blur-xl animate-float-${element.speed}`}
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.initialX}%`,
              top: `${element.initialY}%`,
              background: `radial-gradient(circle, var(--tw-colors-${element.color}-500), transparent)`,
              animationDelay: `${element.id * 0.5}s`,
              animationDuration: `${element.speed * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
        }}
      />

      {/* Main Content - Landscape Layout */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Name and Title */}
            <div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                {profile.name}
              </h1>

              <div className="relative h-20 mb-4">
                <div className="absolute inset-0 flex items-center justify-center lg:justify-start">
                  <h2
                    key={currentTitle}
                    className="text-2xl md:text-4xl font-semibold text-cyan-400 animate-title-change"
                  >
                    {titles[currentTitle]}
                  </h2>
                </div>

                {/* Removed pause/play control */}
              </div>

              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {profile.tagline ? (
                  profile.tagline
                ) : (
                  <>
                    Crafting exceptional digital experiences with
                    <span className="text-cyan-400 font-semibold">
                      {" "}
                      modern technologies
                    </span>{" "}
                    and
                    <span className="text-purple-400 font-semibold">
                      {" "}
                      innovative solutions
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Interactive Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: Code, value: "3+", label: "Years" },
                { icon: Zap, value: "50+", label: "Projects" },
                { icon: Rocket, value: "99%", label: "Success" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  style={{
                    transform: `translateY(${Math.sin((mousePosition.x + index) * 5) * 10}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                    <stat.icon className="h-6 w-6 text-cyan-400 mx-auto mb-2 group-hover:text-cyan-300 transition-colors" />
                    <div className="text-xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetInTouch}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Get In Touch
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => {
                  if (profile.resumeUrl) {
                    try {
                      const link = document.createElement('a');
                      link.href = profile.resumeUrl;

                      // Determine file extension from URL or default to pdf
                      const fileExtension = profile.resumeUrl.includes('.')
                        ? profile.resumeUrl.split('.').pop()
                        : 'pdf';

                      link.download = `${profile.name.replace(/\s+/g, '_')}_CV.${fileExtension}`;
                      link.target = '_blank';

                      // For blob URLs or external URLs, try download first, fallback to open
                      if (profile.resumeUrl.startsWith('blob:')) {
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        // For external URLs, open in new tab
                        window.open(profile.resumeUrl, '_blank');
                      }
                    } catch (error) {
                      console.error('Error downloading resume:', error);
                      alert('Unable to download resume. Please try again or contact me directly.');
                    }
                  } else {
                    // If no resume URL, provide sample CV or contact info
                    alert('Resume not yet uploaded. Please contact me at ' + profile.contactInfo.email + ' for my latest CV.');
                  }
                }}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                title={profile.resumeUrl ? "Download/View CV" : "Resume not available - Contact for CV"}
              >
                <span className="flex items-center gap-2">
                  <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Download CV
                </span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start gap-6">
              {[
                { icon: Github, href: profile.contactInfo.github || "#", label: "GitHub" },
                { icon: Linkedin, href: profile.contactInfo.linkedin || "#", label: "LinkedIn" },
                { icon: ExternalLink, href: profile.contactInfo.website || "#", label: "Portfolio" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  title={social.label}
                  style={{
                    transform: `translateY(${Math.cos((mousePosition.y + index) * 3) * 5}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative w-80 h-80 lg:w-96 lg:h-96 group"
              style={parallaxStyle}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-spin-slow opacity-75" />
              <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin-reverse opacity-75" />
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-2xl">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover object-center"
                  />
                ) : (
                  <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-6xl lg:text-8xl">
                    KP
                  </div>
                )}
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll" />
        </div>
      </div>

      {/* Cursor Follower */}
      <div
        className="absolute pointer-events-none z-50 w-8 h-8 bg-cyan-400/30 rounded-full blur-sm transition-all duration-100 ease-out"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
};

export default InteractiveHero;
