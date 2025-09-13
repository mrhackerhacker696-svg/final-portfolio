import Layout from "../components/Layout";
import { Edit, Trash2, Plus, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { dataService } from "../services/dataService";

type DbSkill = { _id: string; name: string; category: string; level: number; years?: number };

export default function Skills() {
  const [skills, setSkills] = useState<DbSkill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "languages", level: 70, years: 1 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editing, setEditing] = useState<DbSkill | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const loadSkills = async () => {
    try {
      const data = await dataService.getSkills();
      setSkills(data);
    } catch (e) {
      console.error("Failed to load skills", e);
      setSkills([]);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Skill
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          {/* Skills Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Skills</h2>
            <p className="text-gray-600">Manage your technical and soft skills displayed on your portfolio.</p>
          </div>

          {/* Skills Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
                <span>Skill Name</span>
                <span>Category</span>
                <span>Level</span>
                <span>Years</span>
                <span>Actions</span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {skills.map((skill) => (
                <div key={skill._id} className="px-6 py-4">
                  {editing?._id === skill._id ? (
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <input type="text" value={editing.name} onChange={(e) => setEditing((p) => ({ ...(p as any), name: e.target.value }))} className="px-3 py-2 border rounded" />
                      <select value={editing.category} onChange={(e) => setEditing((p) => ({ ...(p as any), category: e.target.value }))} className="px-3 py-2 border rounded">
                        <option value="languages">Languages</option>
                        <option value="frameworks">Frameworks</option>
                        <option value="tools">Tools</option>
                        <option value="soft">Soft</option>
                      </select>
                      <input type="number" min={1} max={100} value={editing.level} onChange={(e) => setEditing((p) => ({ ...(p as any), level: Number(e.target.value) }))} className="px-3 py-2 border rounded" />
                      <input type="number" min={0} max={50} value={editing.years ?? 1} onChange={(e) => setEditing((p) => ({ ...(p as any), years: Number(e.target.value) }))} className="px-3 py-2 border rounded" />
                      <div className="flex items-center gap-2">
                        <button onClick={async () => { if (!editing) return; const { _id, ...payload } = editing as any; await dataService.updateSkill(_id, payload); setEditing(null); await loadSkills(); showSuccess("Skill updated!"); }} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Save</button>
                        <button onClick={() => setEditing(null)} className="px-3 py-1 rounded border text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-700">{skill.category}</span>
                      <span className="text-sm text-gray-700">{skill.level}%</span>
                      <span className="text-sm text-gray-700">{skill.years ?? 1}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(skill)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={async () => { await dataService.deleteSkill(skill._id); await loadSkills(); showSuccess("Skill deleted!"); }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {skills.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-500">No skills found. Add your first skill!</div>
              )}
            </div>
          </div>

          {/* Add New Skill Form */}
          {showAddForm && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Skill
              </h3>
              <p className="text-gray-600 mb-6">
                Add a new skill with its proficiency level.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, UI/UX Design"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="languages">Languages</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="tools">Tools</option>
                    <option value="soft">Soft Skills</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level: {newSkill.level}%</label>
                    <input type="range" min="1" max="100" value={newSkill.level} onChange={(e) => setNewSkill((p) => ({ ...p, level: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years</label>
                    <input type="number" min="0" max="50" value={newSkill.years} onChange={(e) => setNewSkill((p) => ({ ...p, years: parseInt(e.target.value || '0') }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={async () => { if (!newSkill.name.trim()) return; await dataService.createSkill(newSkill); await loadSkills(); setShowAddForm(false); setNewSkill({ name: "", category: "languages", level: 70, years: 1 }); showSuccess("Skill added!"); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Add Skill</button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewSkill({ name: "", category: "languages", level: 70, years: 1 });
                    }}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
