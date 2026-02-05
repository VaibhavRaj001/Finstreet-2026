import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { teamAPI } from "../services/api";

export default function JoinTeam() {
    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchTeam();
    }, [inviteCode]);

    const fetchTeam = async () => {
        try {
            const data = await teamAPI.getByInviteCode(inviteCode);
            setTeam(data.team);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/join-team/${inviteCode}`);
            return;
        }

        setJoining(true);
        setError("");

        try {
            await teamAPI.join(inviteCode);
            setSuccess("Successfully joined the team!");
            setTimeout(() => navigate("/my-teams"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white/60">Loading...</div>
            </div>
        );
    }

    if (error && !team) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Team Not Found</h1>
                    <p className="text-white/60 mb-6">{error}</p>
                    <Link
                        to="/"
                        className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const isFull = team.members.length >= team.event.maxTeamSize;
    const isExpired = new Date() > new Date(team.event.registrationDeadline);
    const isAlreadyMember = user && team.members.some((m) => m.user._id === user._id);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg">
                <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
                    <div className="text-center mb-6">
                        <Link to="/">
                            <img src="/FCLogo.png" alt="Logo" className="h-10 mx-auto mb-4" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Join Team</h1>
                    </div>

                    {success ? (
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <p className="text-green-400 text-lg">{success}</p>
                            <p className="text-white/60 mt-2">Redirecting to your teams...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white/5 rounded-xl p-6 mb-6">
                                <h2 className="text-xl font-semibold text-white mb-1">{team.name}</h2>
                                <p className="text-amber-400 text-sm mb-4">
                                    For: {team.event.name}
                                </p>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Team Members</span>
                                        <span className="text-white">
                                            {team.members.length} / {team.event.maxTeamSize}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Registration Deadline</span>
                                        <span className="text-white">
                                            {new Date(team.event.registrationDeadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-white/60 text-sm mb-2">Current Members:</p>
                                    <div className="space-y-2">
                                        {team.members.map((member) => (
                                            <div
                                                key={member.user._id}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-semibold">
                                                    {member.user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-white">{member.user.name}</span>
                                                    {member.role === "lead" && (
                                                        <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                                                            Lead
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {isAlreadyMember ? (
                                <div className="text-center text-amber-400 py-4">
                                    You are already a member of this team
                                </div>
                            ) : isFull ? (
                                <div className="text-center text-red-400 py-4">
                                    This team is already full
                                </div>
                            ) : isExpired ? (
                                <div className="text-center text-red-400 py-4">
                                    Registration deadline has passed
                                </div>
                            ) : !team.event.isActive ? (
                                <div className="text-center text-red-400 py-4">
                                    This event is no longer active
                                </div>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    disabled={joining}
                                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                                >
                                    {joining ? "Joining..." : isAuthenticated ? "Join Team" : "Login to Join"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
