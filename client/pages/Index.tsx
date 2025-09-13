import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ContactForm from "../components/ContactForm";
import LoadingSkeleton from "../components/LoadingSkeleton";
import FloatingParticles from "../components/FloatingParticles";
import TypingAnimation from "../components/TypingAnimation";
import TechShowcase from "../components/TechShowcase";
import InteractiveHero from "../components/InteractiveHero";
import { useProfile } from "../contexts/ProfileContext";
import { dataService } from "../services/dataService";
import { useAuth } from "../contexts/AuthContext";
import { useScrollAnimation, useParallax } from "../hooks/useScrollAnimation";

export default function Index() {
  const { profile } = useProfile();
  const { logout, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({ languages: [], frameworks: [], tools: [], soft: [] });
  const [activities, setActivities] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll animations
  const [skillsRef, skillsVisible] = useScrollAnimation(0.2);
  const [projectsRef, projectsVisible] = useScrollAnimation(0.2);
  const [activitiesRef, activitiesVisible] = useScrollAnimation(0.2);
  const [contactRef, contactVisible] = useScrollAnimation(0.2);
  const parallaxOffset = useParallax();

  // Default skills fallback
  const getDefaultSkills = () => ({
    languages: [
      { name: "TypeScript", level: 95 },
      { name: "Python", level: 90 },
      { name: "Go", level: 75 },
      { name: "Java", level: 70 },
    ],
    frameworks: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
    tools: [
      { name: "Docker", level: 80 },
      { name: "Git", level: 95 },
      { name: "Kubernetes", level: 70 },
      { name: "AWS", level: 75 },
      { name: "Figma", level: 85 },
    ],
    soft: [
      { name: "Problem Solving", level: 95 },
      { name: "Communication", level: 90 },
      { name: "Teamwork", level: 88 },
      { name: "Adaptability", level: 92 },
    ],
  });

  // Fetch skills from database
  const fetchSkills = async () => {
    try {
      const skillsData = await dataService.getSkills();

      if (!skillsData || skillsData.length === 0) {
        setSkills(getDefaultSkills());
        return;
      }

      // Group skills by category with safe checks
      const groupedSkills = {
        languages: skillsData.filter((skill: any) => skill.category && skill.category.toLowerCase() === 'languages'),
        frameworks: skillsData.filter((skill: any) => skill.category && skill.category.toLowerCase() === 'frameworks'),
        tools: skillsData.filter((skill: any) => skill.category && skill.category.toLowerCase() === 'tools'),
        soft: skillsData.filter((skill: any) => skill.category && (skill.category.toLowerCase() === 'soft skills' || skill.category.toLowerCase() === 'soft'))
      };

      // Ensure we have data in each category
      const defaultSkills = getDefaultSkills();
      const finalSkills = {
        languages: groupedSkills.languages.length > 0 ? groupedSkills.languages : defaultSkills.languages,
        frameworks: groupedSkills.frameworks.length > 0 ? groupedSkills.frameworks : defaultSkills.frameworks,
        tools: groupedSkills.tools.length > 0 ? groupedSkills.tools : defaultSkills.tools,
        soft: groupedSkills.soft.length > 0 ? groupedSkills.soft : defaultSkills.soft,
      };

      setSkills(finalSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills(getDefaultSkills());
    }
  };

  // Fetch projects from database
  const fetchProjects = async () => {
    try {
      const projectsData = await dataService.getProjects();
      if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
        setProjects(projectsData);
      } else {
        console.log('No projects found in database, using defaults');
        loadDefaultProjects();
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      loadDefaultProjects();
    }
  };

  // Fetch activities from database
  const fetchActivities = async () => {
    try {
      const activitiesData = await dataService.getActivities();
      if (activitiesData && Array.isArray(activitiesData)) {
        setActivities(activitiesData);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    }
  };

  // Fallback function for default projects
  const loadDefaultProjects = () => {
    const defaultProjects = [
      {
        id: 1,
        title: "AI-Powered Course Platform",
        description:
          "Developed a robust platform for creating and managing AI-generated courses, featuring intuitive course creation tools.",
        tags: ["React.js", "TypeScript", "Next.js", "CSS"],
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop&crop=top",
        links: {
          github: "https://github.com/kanuprajapati/ai-course-platform",
          demo: "https://react-portfolio-template.vercel.app",
        },
      },
      {
        id: 2,
        title: "E-commerce Analytics Dashboard",
        description:
          "Built a real-time analytics dashboard to track sales, customer behavior, and inventory, providing key insights.",
        tags: ["React", "D3.js", "Node.js", "Express"],
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=top",
        links: {
          github: "https://github.com/kanuprajapati/ecommerce-analytics",
          demo: "https://dashboard-template-react.vercel.app",
        },
      },
      {
        id: 3,
        title: "Decentralized Voting System",
        description:
          "Implemented a secure and transparent voting system using blockchain technology, ensuring vote integrity.",
        tags: ["Solidity", "Hardhat", "React", "Web3.js"],
        image:
          "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=500&h=300&fit=crop&crop=center",
        links: {
          github: "https://github.com/kanuprajapati/blockchain-voting",
          demo: "https://web3-voting-app.vercel.app",
        },
      },
      {
        id: 4,
        title: "Personal Finance Tracker",
        description:
          "Created a user-friendly web application to help individuals track expenses, set budgets, and visualizing spending patterns.",
        tags: ["Vue.js", "Firebase", "TypeScript", "Chart.js"],
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&crop=center",
        links: {
          github: "https://github.com/kanuprajapati/finance-tracker",
          demo: "https://finance-tracker-vue.vercel.app",
        },
      },
    ];
    setProjects(defaultProjects);
  };

  // Auto-logout when visiting home page
  useEffect(() => {
    if (isAuthenticated) {
      // Show a brief message before logout
      const timer = setTimeout(() => {
        logout();
        console.log("🚪 Auto-logout: Logged out when visiting home page");
      }, 100); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, logout]);

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSkills(),
        fetchProjects(),
        fetchActivities()
      ]);
    };

    loadData();
  }, []);

  // Show loading skeleton while loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {profile.logoText}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                Home
              </a>
              <a
                href="#skills"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                Projects
              </a>
              <a
                href="#activities"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                Activities
              </a>
              <a
                href="#contact"
                className="text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium"
              >
                Contact
              </a>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/admin-login"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Admin Panel
              </Link>
              <a
                href="#contact"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Me
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-cyan-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Home
              </a>
              <a
                href="#skills"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Skills
              </a>
              <a
                href="#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Projects
              </a>
              <a
                href="#activities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Activities
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/80 hover:text-cyan-400 transition-colors duration-300 font-medium py-2"
              >
                Contact
              </a>
              <div className="pt-4 space-y-3">
                <Link
                  to="/admin-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Admin Panel
                </Link>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-full text-center hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <InteractiveHero />

      {/* Skills Section */}
      <section
        id="skills"
        className="py-24 mt-8 mb-8 relative overflow-hidden"
        ref={skillsRef}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900"></div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-6 transition-all duration-1000 ${skillsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              My Expertise
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Crafting digital experiences with cutting-edge technologies and
              creative problem-solving
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Programming Languages */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">
                    Programming Languages
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.languages.map((skill, index) => (
                    <div
                      key={`lang-${skill.name}-${index}`}
                      className="group/skill bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 rounded-full px-4 py-2 hover:from-cyan-400/30 hover:to-blue-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-cyan-300 font-medium text-sm">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Frameworks & Libraries */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">
                    Frameworks & Libraries
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.frameworks.map((skill, index) => (
                    <div
                      key={`framework-${skill.name}-${index}`}
                      className="group/skill bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full px-4 py-2 hover:from-purple-400/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-purple-300 font-medium text-sm">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools & Platforms */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">
                    Tools & Platforms
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.tools.map((skill, index) => (
                    <div
                      key={`tool-${skill.name}-${index}`}
                      className="group/skill bg-gradient-to-r from-emerald-400/20 to-teal-500/20 border border-emerald-400/30 rounded-full px-4 py-2 hover:from-emerald-400/30 hover:to-teal-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-emerald-300 font-medium text-sm">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="group">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-3"></div>
                  <h3 className="text-xl font-bold text-white">Soft Skills</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.soft.map((skill, index) => (
                    <div
                      key={`soft-${skill.name}-${index}`}
                      className="group/skill bg-gradient-to-r from-orange-400/20 to-red-500/20 border border-orange-400/30 rounded-full px-4 py-2 hover:from-orange-400/30 hover:to-red-500/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-orange-300 font-medium text-sm">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Showcase Section */}
      <div className="my-12">
        <TechShowcase />
      </div>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-24 mt-8 mb-8 relative overflow-hidden"
        ref={projectsRef}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900/30 to-slate-900"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div
          className={`relative z-10 max-w-7xl mx-auto px-6 transition-all duration-1000 ${projectsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Innovative solutions that push the boundaries of web development
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div key={`project-${project._id || project.id}-${index}`} className="group relative">
                {/* Project card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20">
                  {/* Image container */}
                  <div className="relative overflow-hidden">
                    <Link to={`/project/${project._id || project.id}`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Floating action buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <Link to={`/project/${project._id || project.id}`}>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-white/70 text-base leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300 hover:scale-105 ${tagIndex % 4 === 0
                              ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/20 hover:bg-cyan-400/20"
                              : tagIndex % 4 === 1
                                ? "bg-purple-400/10 text-purple-400 border-purple-400/20 hover:bg-purple-400/20"
                                : tagIndex % 4 === 2
                                  ? "bg-pink-400/10 text-pink-400 border-pink-400/20 hover:bg-pink-400/20"
                                  : "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/20"
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4">
                      <Link
                        to={`/project/${project._id || project.id}`}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-full text-center font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                      >
                        View Details
                      </Link>
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-24 mt-8 mb-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Recent Activities & Achievements
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Continuous growth and learning in the ever-evolving tech landscape
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Timeline Activities */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-4"></div>
                <h3 className="text-2xl font-bold text-white">
                  Latest Updates
                </h3>
              </div>

              <div className="space-y-6 relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 opacity-30"></div>

                {activities.length > 0 ? (
                  activities.slice(0, 3).map((activity, index) => {
                    const colors = [
                      { bg: 'from-emerald-400 to-teal-500', text: 'emerald-400', ring: 'ring-emerald-400/20' },
                      { bg: 'from-blue-400 to-indigo-500', text: 'blue-400', ring: 'ring-blue-400/20' },
                      { bg: 'from-purple-400 to-pink-500', text: 'purple-400', ring: 'ring-purple-400/20' }
                    ];
                    const color = colors[index % colors.length];

                    return (
                      <div key={activity._id} className="relative flex items-start gap-6 group">
                        <div className={`w-3 h-3 bg-gradient-to-r ${color.bg} rounded-full ring-4 ${color.ring} group-hover:ring-8 transition-all duration-300`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-white font-semibold">
                              {new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </span>
                            <span className={`px-3 py-1 bg-${color.text}/20 text-${color.text} text-xs rounded-full border border-${color.text}/30`}>
                              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </span>
                          </div>
                          <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                          <p className="text-white/80 leading-relaxed">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback data if no activities are found
                  <>
                    <div className="relative flex items-start gap-6 group">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full ring-4 ring-emerald-400/20 group-hover:ring-8 transition-all duration-300"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold">
                            July 2024
                          </span>
                          <span className="px-3 py-1 bg-emerald-400/20 text-emerald-400 text-xs rounded-full border border-emerald-400/30">
                            Achievement
                          </span>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          Successfully launched new portfolio website with modern
                          tech stack and stunning design
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-6 group">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full ring-4 ring-blue-400/20 group-hover:ring-8 transition-all duration-300"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold">
                            June 2024
                          </span>
                          <span className="px-3 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full border border-blue-400/30">
                            Learning
                          </span>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          Completed advanced React patterns and Next.js optimization
                          course with certification
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-6 group">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full ring-4 ring-purple-400/20 group-hover:ring-8 transition-all duration-300"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold">May 2024</span>
                          <span className="px-3 py-1 bg-purple-400/20 text-purple-400 text-xs rounded-full border border-purple-400/30">
                            Speaking
                          </span>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          Presented on "Modern Web Development" at local tech meetup
                          with 200+ attendees
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Skill Development Chart */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-4"></div>
                <h3 className="text-2xl font-bold text-white">
                  Skill Development
                </h3>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <div className="flex justify-between mb-3">
                    <span className="text-white font-medium">
                      React & Next.js
                    </span>
                    <span className="text-cyan-400 font-bold">95%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/30"
                        style={{ width: "95%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between mb-3">
                    <span className="text-white font-medium">TypeScript</span>
                    <span className="text-emerald-400 font-bold">90%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/30"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between mb-3">
                    <span className="text-white font-medium">
                      Node.js & Backend
                    </span>
                    <span className="text-purple-400 font-bold">85%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/30"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between mb-3">
                    <span className="text-white font-medium">
                      Cloud & DevOps
                    </span>
                    <span className="text-orange-400 font-bold">80%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-orange-500/30"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/70 leading-relaxed">
                  Continuously learning and improving technical skills through
                  hands-on projects, industry best practices, and staying
                  updated with the latest technologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 mt-8 mb-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-900/30 to-slate-900"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Ready to collaborate on your next project? Let's create something
              amazing together!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-4"></div>
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                    <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p className="text-cyan-400">
                        kanuprajapati717@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Location</p>
                      <p className="text-purple-400">Gujarat, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-4"></div>
                  Connect with me
                </h4>

                <div className="flex gap-4">
                  <a
                    href="https://github.com/kanuprajapati"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-2xl hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-gray-500/20"
                  >
                    <Github className="h-6 w-6 text-white group-hover:text-gray-300" />
                  </a>
                  <a
                    href="https://linkedin.com/in/kanuprajapati"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 bg-gradient-to-r from-blue-600/50 to-blue-700/50 border border-blue-500/30 rounded-2xl hover:from-blue-500/50 hover:to-blue-600/50 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    <ExternalLink className="h-6 w-6 text-blue-300 group-hover:text-blue-200" />
                  </a>
                  <a
                    href="mailto:kanuprajapati717@gmail.com"
                    className="group p-4 bg-gradient-to-r from-emerald-600/50 to-teal-600/50 border border-emerald-500/30 rounded-2xl hover:from-emerald-500/50 hover:to-teal-500/50 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/20"
                  >
                    <Mail className="h-6 w-6 text-emerald-300 group-hover:text-emerald-200" />
                  </a>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-4"></div>
                  Why Work With Me?
                </h4>

                <div className="space-y-4">
                  <div className="group p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300">
                    <p className="font-semibold text-cyan-400 text-sm mb-1">
                      💡 Project Consultation
                    </p>
                    <p className="text-white/70 text-xs">
                      Strategic planning and technical guidance for your vision
                    </p>
                  </div>
                  <div className="group p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
                    <p className="font-semibold text-purple-400 text-sm mb-1">
                      🚀 Technical Expertise
                    </p>
                    <p className="text-white/70 text-xs">
                      Modern tech stack with industry best practices
                    </p>
                  </div>
                  <div className="group p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-300">
                    <p className="font-semibold text-emerald-400 text-sm mb-1">
                      ⚡ Reliable Delivery
                    </p>
                    <p className="text-white/70 text-xs">
                      Quality results delivered on time, every time
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Brand & Info */}
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {profile.logoText}
                </div>
                <p className="text-white/70 leading-relaxed">
                  Full-stack Developer specializing in modern web technologies
                  and user-centered design. Creating digital experiences that
                  matter.
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href="https://github.com/KANUprajapati-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500/20"
                >
                  <Github className="h-5 w-5 text-white/70 group-hover:text-white" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kanu-prajapati-75b1b5251/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <ExternalLink className="h-5 w-5 text-white/70 group-hover:text-blue-400" />
                </a>
                <a
                  href="mailto:kanuprajapati717@gmail.com"
                  className="group p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Mail className="h-5 w-5 text-white/70 group-hover:text-cyan-400" />
                </a>
                <a
                  href="https://wa.me/919925056156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <svg
                    className="h-5 w-5 text-white/70 group-hover:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3"></div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "#home" },
                  { name: "Skills", href: "#skills" },
                  { name: "Projects", href: "#projects" },
                  { name: "Activities", href: "#activities" },
                  { name: "Contact", href: "#contact" },
                ].map((link, index) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center text-white/70 hover:text-cyan-400 transition-all duration-300"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
                      <span className="group-hover:translate-x-2 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <ContactForm variant="footer" />
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-sm">
                © 2024 Kanu Prajapati. Crafted with 💜 and modern web
                technologies
              </p>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <span>Made with</span>
                <span className="animate-pulse">⚡</span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Visily
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Analytics Button */}
      <Link
        to="/analytics"
        className="fixed bottom-6 right-6 z-50 group bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-110"
        title="View Portfolio Analytics"
      >
        <BarChart3 className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </Link>
    </div>
  );
}
