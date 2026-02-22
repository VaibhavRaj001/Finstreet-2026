import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { teamAPI } from "../services/api";

export default function MyTeams() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            setTeams(data.teams);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async (teamId) => {
        if (!confirm("Are you sure you want to leave this team?")) return;

        try {
            await teamAPI.leave(teamId);
            fetchTeams();
        } catch (err) {
            alert(err.message);
        }
    };

    const copyInviteLink = async (inviteCode) => {
        const link = `${window.location.origin}/join-team/${inviteCode}`;
        await navigator.clipboard.writeText(link);
        alert("Invite link copied to clipboard!");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white/60">Loading...</div>
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
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Teams</h1>
                    <Link
                        to="/create-team"
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        Create Team
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {teams.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-xl font-semibold text-white mb-2">No Teams Yet</h2>
                        <p className="text-white/60 mb-6">
                            Create or join a team to participate in events
                        </p>
                        <Link
                            to="/create-team"
                            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Create Your First Team
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teams.map((team) => {
                            const isLead = team.members.find(
                                (m) => m.user._id === user._id && m.role === "lead"
                            );

                            return (
                                <div
                                    key={team._id}
                                    className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-1">
                                                {team.name}
                                                {isLead && (
                                                    <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                                                        Team Lead
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-amber-400 text-sm">{team.event.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${team.event.isActive
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {team.event.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 text-sm text-white/60">
                                        <span>
                                            {team.members.length} / {team.event.maxTeamSize || "?"} members
                                        </span>
                                        <span>•</span>
                                        <span>
                                            Created {new Date(team.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {team.members.slice(0, 4).map((member) => (
                                                <div
                                                    key={member.user._id}
                                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-semibold border-2 border-[#1a1a1f]"
                                                    title={member.user.name}
                                                >
                                                    {member.user.name?.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {team.members.length > 4 && (
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs border-2 border-[#1a1a1f]">
                                                    +{team.members.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                                        {isLead && (
                                            <button
                                                onClick={() => copyInviteLink(team.inviteCode)}
                                                className="text-sm bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                                    />
                                                </svg>
                                                Share Invite Link
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleLeave(team._id)}
                                            className="text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
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
        </div>
    );
}
