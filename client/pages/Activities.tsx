import Layout from "../components/Layout";
import { Edit, Trash2, Plus, Calendar, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "project",
  });

  const loadActivities = async () => {
    try {
      const data = await dataService.getActivities();
      setActivities(data);
    } catch (e) {
      console.error("Failed to load activities", e);
      setActivities([]);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const addActivity = async () => {
    if (!newActivity.title || !newActivity.description || !newActivity.date) return;
    try {
      await dataService.createActivity(newActivity);
      setNewActivity({ title: "", date: new Date().toISOString().split("T")[0], description: "", type: "project" });
      setShowAddForm(false);
      setSuccessMessage("Activity added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadActivities();
    } catch (e) {
      console.error("Create activity failed", e);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await dataService.deleteActivity(id);
      setSuccessMessage("Activity deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadActivities();
    } catch (e) {
      console.error("Delete activity failed", e);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Achievement":
        return "bg-green-100 text-green-800";
      case "Learning":
        return "bg-blue-100 text-blue-800";
      case "Speaking":
        return "bg-purple-100 text-purple-800";
      case "Writing":
        return "bg-yellow-100 text-yellow-800";
      case "Conference":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Activities Management
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Activity
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          {/* Recent Activities Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Activities
            </h2>

            {/* Activities Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <span className="col-span-2">Date</span>
                  <span className="col-span-6">Description</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2">Actions</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {activities.map((activity: any) => (
                  <div
                    key={activity._id || activity.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Date */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(activity.date)}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-span-6">
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      {/* Type */}
                      <div className="col-span-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}
                        >
                          {(activity.type || "").toString().charAt(0).toUpperCase() + (activity.type || "").toString().slice(1)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingActivity(activity)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteActivity(activity._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Activity Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Activity
              </h3>
              <p className="text-gray-600 mb-6">
                Record a new activity, achievement, or milestone.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Published new blog post"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) =>
                      setNewActivity((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity((prev) => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="project">Project</option>
                    <option value="skill">Skill</option>
                    <option value="achievement">Achievement</option>
                    <option value="education">Education</option>
                    <option value="work">Work</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the activity, achievement, or milestone..."
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={addActivity}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Activity
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewActivity({
                      date: new Date().toISOString().split("T")[0],
                      description: "",
                      type: "",
                    });
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Total Activities
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {activities.length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                This Month
              </h3>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Achievements
              </h3>
              <p className="text-2xl font-bold text-purple-600">1</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Learning
              </h3>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
