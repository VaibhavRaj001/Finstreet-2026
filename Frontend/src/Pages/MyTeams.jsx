import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { teamAPI } from "../services/api";
import Alert from "../Components/Alert";

export default function MyTeams() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?redirect=/my-teams");
      return;
    }

    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchTeams = async () => {
    try {
      const data = await teamAPI.getMyTeams();
      setTeams(data.teams || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertConfig({ isOpen: true, type, message });
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setJoining(true);
    try {
      await teamAPI.join(joinCode.trim());
      showAlert("success", "Successfully joined the team!");
      setIsJoinModalOpen(false);
      setJoinCode("");
      fetchTeams();
    } catch (err) {
      showAlert("error", err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async (teamId) => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    try {
      await teamAPI.leave(teamId);
      showAlert("success", "Successfully left the team.");
      fetchTeams();
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const copyInviteLink = async (inviteCode) => {
    const link = `${window.location.origin}/join-team/${inviteCode}`;
    await navigator.clipboard.writeText(link);
    showAlert("success", "Invite link copied to clipboard!");
  };

  const copyToClipboard = async (text, msg) => {
    await navigator.clipboard.writeText(text);
    showAlert("success", msg);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading your teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-[#1a1a1f]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/FCLogo.png" alt="Logo" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/60">{user?.name}</span>
            <Link
              to="/"
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">My Teams</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all"
            >
              Join Team
            </button>
            <Link
              to="/create-team"
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              Create Team
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {teams.length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1f] border border-white/10 rounded-2xl">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Teams Yet
            </h2>
            <p className="text-white/60 mb-6">
              Create or join a team to participate in events
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-lg transition-all border border-white/10"
              >
                Join a Team
              </button>
              <Link
                to="/create-team"
                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create a Team
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => {
              const isLead = team.members.find(
                (m) =>
                  (m.user._id || m.user) === user?._id && m.role === "lead",
              );

              if (!team.event) return null;
              return (
                <div
                  key={team._id}
                  className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-white">
                          {team.name}
                        </h3>
                        {isLead && (
                          <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                            Team Lead
                          </span>
                        )}
                      </div>
                      <p className="text-amber-400/80 text-sm font-medium">
                        {team.event.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full border ${
                            team.event.isActive
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {team.event.status}
                        </span>
                        <span className="text-[10px] font-mono text-white/30 tracking-wider">
                          ID: {team.inviteCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {team.members.length} / {team.event.maxTeamSize}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(team.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 5).map((member) => (
                        <div
                          key={member.user._id || member.user}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-bold border-2 border-[#1a1a1f] shadow-lg"
                          title={member.user.name || "Member"}
                        >
                          {(member.user.name || "?").charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <div className="w-9 h-9 rounded-full bg-[#2a2a2f] flex items-center justify-center text-white text-xs border-2 border-[#1a1a1f] font-bold">
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap gap-3">
                    {isLead && (
                      <>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              team.inviteCode,
                              "Team code copied!",
                            )
                          }
                          className="text-sm bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-white/10"
                        >
                          <svg
                            className="w-4 h-4 text-amber-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          Copy Code: {team.inviteCode}
                        </button>
                        <button
                          onClick={() => copyInviteLink(team.inviteCode)}
                          className="text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-amber-500/10"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          Copy Invite Link
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleLeave(team._id)}
                      className="text-sm text-red-400/80 hover:text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/10 ml-auto"
                    >
                      Leave Team
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Team Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Join a Team</h2>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-white/60 mb-6">
              Enter the unique team code shared by the team lead to join their
              group.
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Team Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="E.G. AB12CD"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all uppercase"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining || !joinCode.trim()}
                  className="flex-2 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50"
                >
                  {joining ? "Joining..." : "Join Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <Alert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
}
