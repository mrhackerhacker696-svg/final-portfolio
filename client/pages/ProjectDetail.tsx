import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dataService } from "../services/dataService";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  Tag,
  Eye,
  X,
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load all projects from server and default projects
  useEffect(() => {
    const defaultProjects = [
      {
        id: 1,
        title: "AI-Powered Course Platform",
        description:
          "Developed a robust platform for creating and managing AI-generated courses, featuring intuitive course creation tools.",
        fullDescription: `This comprehensive learning management system leverages artificial intelligence to create personalized course content and learning paths. Built with modern React and Node.js architecture, it features real-time collaboration, interactive assessments, and advanced analytics.

Key Features:
• AI-powered content generation and curriculum suggestions
• Real-time collaborative editing for course creation
• Interactive quiz and assessment builder
• Student progress tracking and analytics dashboard
• Mobile-responsive design for learning on-the-go
• Integration with popular LMS platforms
• Multi-language support with AI translation

Technical Implementation:
The platform uses a microservices architecture with React frontend, Node.js backend, and MongoDB for data storage. Machine learning models are integrated via Python APIs for content recommendations and student performance analysis.`,
        tags: [
          "React.js",
          "TypeScript",
          "Next.js",
          "Node.js",
          "MongoDB",
          "Python",
          "AI/ML",
        ],
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&crop=top",
        status: "Live",
        dateCompleted: "2024-07-15",
        links: {
          github: "https://github.com/kanuprajapati/ai-course-platform",
          demo: "https://react-portfolio-template.vercel.app",
          live: "https://react-portfolio-template.vercel.app",
        },
        screenshots: [
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=top",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=top",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=top",
        ],
        challenges:
          "Implementing real-time AI content generation while maintaining performance was challenging. Solved by implementing efficient caching strategies and background processing.",
        outcome:
          "Successfully launched with 500+ active users and 95% positive feedback. Reduced course creation time by 60%.",
      },
      {
        id: 2,
        title: "E-commerce Analytics Dashboard",
        description:
          "Built a real-time analytics dashboard to track sales, customer behavior, and inventory, providing key insights.",
        fullDescription: `A comprehensive analytics platform designed for e-commerce businesses to track performance, understand customer behavior, and optimize sales strategies. Features real-time data visualization, predictive analytics, and automated reporting.

Key Features:
• Real-time sales and revenue tracking
• Customer behavior analysis and segmentation
• Inventory management with low-stock alerts
• Conversion funnel optimization tools
• Automated report generation and email notifications
• Multi-store management capabilities
• Integration with major e-commerce platforms

Technical Implementation:
Built using React with D3.js for advanced data visualizations, Node.js backend with Express, and PostgreSQL for data warehousing. Real-time updates powered by WebSocket connections.`,
        tags: [
          "React",
          "D3.js",
          "Node.js",
          "Express",
          "PostgreSQL",
          "WebSocket",
        ],
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=top",
        status: "Live",
        dateCompleted: "2024-06-20",
        links: {
          github: "https://github.com/kanuprajapati/ecommerce-analytics",
          demo: "https://dashboard-template-react.vercel.app",
          live: "https://dashboard-template-react.vercel.app",
        },
        screenshots: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=top",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=top",
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center",
        ],
        challenges:
          "Processing large datasets in real-time while maintaining smooth UI performance. Implemented data virtualization and efficient query optimization.",
        outcome:
          "Helped clients increase conversion rates by 25% through actionable insights and improved user experience.",
      },
      {
        id: 3,
        title: "Decentralized Voting System",
        description:
          "Implemented a secure and transparent voting system using blockchain technology, ensuring vote integrity.",
        fullDescription: `A blockchain-based voting application that ensures transparency, security, and immutability of votes. Built using Solidity smart contracts, Hardhat for development, and React for the frontend interface.

Key Features:
• Secure wallet-based authentication
• Transparent vote tracking on blockchain
• Real-time election results
• Candidate registration and management
• Vote verification and audit trail
• Gas-optimized smart contracts
• Mobile-responsive interface

Technical Implementation:
Developed smart contracts using Solidity with comprehensive testing using Hardhat. The frontend is built with React and Web3.js for blockchain interaction. MetaMask integration for secure wallet connections.`,
        tags: [
          "Solidity",
          "Hardhat",
          "React",
          "Web3.js",
          "MetaMask",
          "Ethereum",
        ],
        image:
          "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&h=400&fit=crop&crop=center",
        status: "Live",
        dateCompleted: "2024-06-10",
        links: {
          github: "https://github.com/kanuprajapati/blockchain-voting",
          demo: "https://web3-voting-app.vercel.app",
          live: "https://web3-voting-app.vercel.app",
        },
        screenshots: [
          "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=400&h=300&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=400&h=300&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop&crop=center",
        ],
        challenges:
          "Ensuring vote security and preventing double voting while maintaining user anonymity. Solved using cryptographic hashing and smart contract validation.",
        outcome:
          "Successfully deployed on Ethereum testnet with 99.9% uptime and zero security vulnerabilities detected.",
      },
      {
        id: 4,
        title: "Personal Finance Tracker",
        description:
          "Created a user-friendly web application to help individuals track expenses, set budgets, and visualize spending patterns.",
        fullDescription: `A comprehensive personal finance management application that helps users track expenses, manage budgets, and gain insights into their spending habits through interactive visualizations.

Key Features:
• Expense and income tracking
• Budget creation and monitoring
• Interactive charts and visualizations
• Category-based expense analysis
• Monthly/yearly financial reports
• Goal setting and progress tracking
• Data export functionality
• Mobile-responsive design

Technical Implementation:
Built with Vue.js for reactive UI components, Firebase for real-time database and authentication, and Chart.js for data visualizations. Implements PWA features for offline usage.`,
        tags: ["Vue.js", "Firebase", "TypeScript", "Chart.js", "PWA", "Vuex"],
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center",
        status: "Live",
        dateCompleted: "2024-05-15",
        links: {
          github: "https://github.com/kanuprajapati/finance-tracker",
          demo: "https://finance-tracker-vue.vercel.app",
          live: "https://finance-tracker-vue.vercel.app",
        },
        screenshots: [
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
        ],
        challenges:
          "Implementing real-time data synchronization across multiple devices while maintaining data privacy. Used Firebase security rules and encryption.",
        outcome:
          "Achieved 4.8/5 user rating with over 1000+ active users managing their personal finances effectively.",
      },
    ];

    (async () => {
      try {
        const serverProjects = await dataService.getProjects();
        const enrichedAdminProjects = serverProjects.map((project: any) => ({
          ...project,
          fullDescription:
            project.fullDescription ||
            `This is a project developed with modern web technologies.

Key Features:
• Modern and responsive design
• Clean and efficient code structure
• User-friendly interface
• Cross-platform compatibility

Technical Implementation:
Built using industry-standard technologies and best practices to ensure optimal performance and maintainability.`,
          challenges:
            project.challenges ||
            "Developing a robust and scalable solution while maintaining clean code architecture and ensuring optimal user experience.",
          outcome:
            project.outcome ||
            "Successfully delivered a high-quality project that meets all requirements and provides excellent user experience.",
          screenshots: project.screenshots || [
            project.image,
            project.image,
            project.image,
          ],
          dateCompleted:
            project.dateCompleted || new Date().toISOString().split("T")[0],
        }));
        setAllProjects([...defaultProjects, ...enrichedAdminProjects]);
      } catch (error) {
        console.error("Error loading projects:", error);
        setAllProjects(defaultProjects);
      }
    })();
  }, []);

  const project = allProjects.find((p: any) => {
    if (!id) return false;
    if (p._id && String(p._id) === id) return true;
    if (typeof p.id !== 'undefined' && String(p.id) === id) return true;
    return false;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (
      lightboxIndex !== null &&
      project &&
      lightboxIndex < project.screenshots.length - 1
    ) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
            <div className="text-2xl font-bold text-blue-600">��� logo</div>
          </div>
        </div>
      </div>

      {/* Project Hero */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${project.status === "Live"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                    }`}
                >
                  {project.status}
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{project.dateCompleted}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Live Site
                  </a>
                )}
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      {project.links.demo && (
        <div className="bg-white py-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-4 w-4" />
                Open in New Tab
              </a>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <iframe
                src={project.links.demo}
                className="w-full h-96 rounded border-0"
                title={`${project.title} Preview`}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </div>
      )}

      {/* Project Details */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {project.fullDescription}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Key Challenges
                </h3>
                <p className="text-gray-600">{project.challenges}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Project Outcome
                </h3>
                <p className="text-gray-600">{project.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots Gallery */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Project Screenshots
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {project.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={screenshot}
                  alt={`${project.title} Screenshot ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onClick={() => openLightbox(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && project && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={project.screenshots[lightboxIndex]}
              alt={`${project.title} Screenshot ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button
                onClick={prevImage}
                disabled={lightboxIndex === 0}
                className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                disabled={lightboxIndex === project.screenshots.length - 1}
                className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 disabled:opacity-50"
              >
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in Similar Work?
          </h2>
          <p className="text-gray-600 mb-6">
            I'm always excited to work on challenging projects like this one.
            Let's discuss how I can help bring your ideas to life.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/#contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get In Touch
            </Link>
            <Link
              to="/"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-white"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
