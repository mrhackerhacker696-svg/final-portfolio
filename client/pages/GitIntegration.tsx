import Layout from "../components/Layout";
import {
  Github,
  GitBranch,
  Star,
  Eye,
  GitCommit,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { dataService } from "../services/dataService";

export default function GitIntegration() {
  const [gitUsername, setGitUsername] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addedToPortfolio, setAddedToPortfolio] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState([]);

  const fetchGitHubRepos = async () => {
    if (!accessToken || !gitUsername) {
      setError("GitHub username and access token are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api.github.com/users/${gitUsername}/repos?sort=updated&per_page=20`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid access token. Please check your GitHub personal access token.");
        } else if (response.status === 404) {
          throw new Error("Username not found. Please check your GitHub username.");
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      const repoData = await response.json();

      const formattedRepos = repoData.map((repo: any, index: number) => ({
        id: index + 1,
        name: repo.name,
        description: repo.description || "No description available",
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        language: repo.language || "Unknown",
        updated: new Date(repo.updated_at).toLocaleDateString(),
        url: repo.html_url,
        clone_url: repo.clone_url,
        private: repo.private,
        fork: repo.fork
      }));

      setRepos(formattedRepos);
      setSuccessMessage(`Successfully loaded ${formattedRepos.length} repositories!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectGitHub = () => {
    setIsConnected(true);
    if (accessToken && gitUsername) {
      fetchGitHubRepos();
    }
  };

  const disconnectGitHub = () => {
    setIsConnected(false);
    setAccessToken("");
    setRepos([]);
  };

  const syncRepos = () => {
    fetchGitHubRepos();
  };

  const addToPortfolio = async (repoId: number) => {
    if (!addedToPortfolio.includes(repoId)) {
      setAddedToPortfolio([...addedToPortfolio, repoId]);
      const repo = repos.find((r) => r.id === repoId);

      if (repo) {
        // Create a project object from the repository
        const newProject = {
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: repo.description || 'Repository project integrated from GitHub',
          tags: [repo.language].filter(Boolean),
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop&crop=top',
          status: 'Live' as const,
          links: {
            github: repo.url,
            demo: repo.url.replace('github.com', 'github.io').replace('.git', '') || '#'
          }
        };

        try {
          await dataService.createProject(newProject);
          alert(`${repo.name} has been added to your portfolio projects!`);
        } catch (e) {
          console.error("Failed to create project via API", e);
          alert("Failed to add project. Ensure server and MongoDB are running.");
        }
      }
    }
  };

  const saveGitSettings = async () => {
    try {
      await dataService.updateGitSettings({ username: gitUsername, accessToken, isConnected });
      setSuccessMessage("Git settings saved successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
      if (accessToken && gitUsername && isConnected) {
        fetchGitHubRepos();
      }
    } catch (e) {
      console.error("Failed to save git settings", e);
    }
  };

  // Load and fetch repositories
  useEffect(() => {
    (async () => {
      try {
        const settings = await dataService.getGitSettings();
        if (settings) {
          setGitUsername(settings.username || "");
          setAccessToken(settings.accessToken || "");
          setIsConnected(settings.isConnected ?? true);
        }
      } catch (e) {
        // ignore load failure; user can still input
      }
      setAddedToPortfolio([]);
      if (accessToken && gitUsername && isConnected) {
        fetchGitHubRepos();
      }
    })();
  }, []);

  // Fetch repositories when credentials change
  useEffect(() => {
    if (accessToken && gitUsername && isConnected) {
      fetchGitHubRepos();
    }
  }, [accessToken, gitUsername, isConnected]);

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Git Integration
            </h1>
            <p className="text-gray-600">
              Connect your GitHub account to automatically sync your
              repositories and showcase your work.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          )}

          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${isConnected ? "bg-green-50" : "bg-red-50"}`}
                >
                  <Github
                    className={`h-6 w-6 ${isConnected ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    GitHub Connection
                  </h2>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          Connected as @{gitUsername}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Not connected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isConnected ? (
                  <>
                    <button
                      onClick={syncRepos}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        "Sync Repos"
                      )}
                    </button>
                    <button
                      onClick={disconnectGitHub}
                      className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={connectGitHub}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Connect GitHub
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* GitHub Settings */}
          {isConnected && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  GitHub Settings
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {isEditing ? "Cancel" : "Edit Settings"}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={gitUsername}
                    onChange={(e) => setGitUsername(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Links
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      value={`https://github.com/${gitUsername}`}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="GitHub Profile"
                    />
                    <input
                      type="url"
                      value={`https://linkedin.com/in/${gitUsername}`}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="LinkedIn Profile"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      onClick={saveGitSettings}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Save Settings
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-900">Error</h3>
              </div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Repository List */}
          {isConnected && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connected Repositories
                  </h3>
                  <span className="text-sm text-gray-500">
                    {loading ? "Loading..." : `${repos.length} repositories`}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-gray-600">Loading repositories from GitHub...</p>
                  </div>
                ) : repos.length === 0 ? (
                  <div className="p-6 text-center">
                    <Github className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No repositories found</p>
                    <p className="text-sm text-gray-500">
                      Make sure your access token has the correct permissions
                    </p>
                  </div>
                ) : (
                  repos.map((repo) => (
                    <div key={repo.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <GitBranch className="h-4 w-4 text-gray-400" />
                            <h4 className="font-semibold text-gray-900">
                              {repo.name}
                            </h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {repo.language}
                            </span>
                            {repo.private && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Private
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{repo.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stars}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {repo.watchers}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitCommit className="h-3 w-3" />
                              Updated {repo.updated}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => addToPortfolio(repo.id)}
                            disabled={addedToPortfolio.includes(repo.id)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${addedToPortfolio.includes(repo.id)
                              ? "bg-green-600 text-white cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                          >
                            {addedToPortfolio.includes(repo.id)
                              ? "Added ✓"
                              : "Add to Portfolio"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Integration Benefits */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              Benefits of Git Integration
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Automatically sync your repositories to your portfolio</li>
              <li>
                • Display real-time repository statistics (stars, forks, etc.)
              </li>
              <li>• Keep your project information up to date</li>
              <li>• Showcase your coding activity and contributions</li>
              <li>• Generate project cards from repository data</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
