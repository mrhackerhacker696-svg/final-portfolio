import Layout from "../components/Layout";
import {
  ExternalLink,
  Github,
  Edit,
  Trash2,
  Plus,
  Monitor,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import { uploadAPI } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    status: "In Development",
    github: "",
    demo: "",
    image: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await dataService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await uploadAPI.uploadBase64({
        type: 'project-image',
        filename: file.name,
        mimeType: file.type,
        data: base64,
      });
      if (res?.url) {
        setNewProject((prev) => ({ ...prev, image: res.url as string }));
      }
    } catch (e) {
      console.error('Project image upload failed', e);
    }
  };

  const handleEditImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await uploadAPI.uploadBase64({
        type: 'project-image',
        filename: file.name,
        mimeType: file.type,
        data: base64,
      });
      if (res?.url) {
        setEditingProject((prev: any) => ({ ...prev, image: res.url as string }));
      }
    } catch (e) {
      console.error('Project image upload failed', e);
    }
  };

  const addProject = async () => {
    if (newProject.title && newProject.description) {
      const tagsArray = newProject.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const projectToAdd = {
        title: newProject.title,
        description: newProject.description,
        tags: tagsArray,
        image:
          newProject.image ||
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=center",
        status: newProject.status,
        links: {
          github: newProject.github || "#",
          demo: newProject.demo || "#",
        },
      };

      try {
        await dataService.createProject(projectToAdd);
        await loadProjects(); // Reload projects from dataService
        setNewProject({
          title: "",
          description: "",
          tags: "",
          status: "In Development",
          github: "",
          demo: "",
          image: "",
        });
        setShowAddForm(false);
        setSuccessMessage("Project added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error adding project:", error);
        setSuccessMessage("Error adding project. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await dataService.deleteProject(id);
        await loadProjects(); // Reload projects from dataService
        setSuccessMessage("Project deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting project:", error);
        setSuccessMessage("Error deleting project. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  const startEditProject = (project: any) => {
    setEditingProject({
      ...project,
      tags: project.tags.join(", "),
      github: project.links.github || "",
      demo: project.links.demo || "",
      image: project.image || "",
    });
    setShowEditForm(true);
  };

  const updateProject = async () => {
    if (editingProject.title && editingProject.description) {
      const tagsArray = editingProject.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);

      const updatedData = {
        title: editingProject.title,
        description: editingProject.description,
        tags: tagsArray,
        status: editingProject.status,
        image: editingProject.image,
        links: {
          github: editingProject.github,
          demo: editingProject.demo,
        },
      };

      try {
        const updateId = (editingProject as any)._id || editingProject.id;
        await dataService.updateProject(updateId, updatedData);
        await loadProjects(); // Reload projects from dataService
        setShowEditForm(false);
        setEditingProject(null);
        setSuccessMessage("Project updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error updating project:", error);
        setSuccessMessage("Error updating project. Please try again.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-100 text-green-800";
      case "In Development":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Published":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Projects Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage projects that appear on your home page and portfolio
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          {/* Add Project Form */}
          {showAddForm && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Project
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                    <option value="Live">Live</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your project"
                ></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={newProject.github}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        github: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={newProject.demo}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, demo: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-project-demo.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-center text-gray-500">or</div>
                  <input
                    type="url"
                    value={newProject.image}
                    onChange={(e) =>
                      setNewProject((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {newProject.image && (
                    <div className="mt-2">
                      <img
                        src={newProject.image}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={addProject}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Project
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProject({
                      title: "",
                      description: "",
                      tags: "",
                      status: "In Development",
                      github: "",
                      demo: "",
                      image: "",
                    });
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Project Form */}
          {showEditForm && editingProject && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Project
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                    <option value="Live">Live</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.tags}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        github: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={editingProject.demo}
                  onChange={(e) =>
                    setEditingProject((prev) => ({
                      ...prev,
                      demo: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditImageUpload(e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-center text-gray-500">or</div>
                  <input
                    type="url"
                    value={editingProject.image || ""}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {editingProject.image && (
                    <div className="mt-2">
                      <img
                        src={editingProject.image}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={updateProject}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Project
                </button>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProject(null);
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={`project-${project._id || project.id}-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="p-1 bg-white rounded">
                      <Monitor className="h-3 w-3 text-gray-600" />
                    </div>
                    <div className="p-1 bg-white rounded">
                      <Smartphone className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={`${project._id || project.id}-tag-${tag}-${tagIndex}`}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live Demo
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                        >
                          <Github className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                      {project.links.appStore && (
                        <a
                          href={project.links.appStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          App Store
                        </a>
                      )}
                      {project.links.playStore && (
                        <a
                          href={project.links.playStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Play Store
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditProject(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project._id || project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Project Card */}
            <div
              onClick={() => setShowAddForm(true)}
              className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[400px] hover:border-gray-400 transition-colors cursor-pointer"
            >
              <div className="text-center">
                <div className="p-4 bg-white rounded-full mb-4 mx-auto w-fit">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Create New Project
                </h3>
                <p className="text-gray-500 text-sm">
                  Add a new project to your portfolio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
