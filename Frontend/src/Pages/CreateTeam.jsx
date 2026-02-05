import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventAPI, teamAPI } from "../services/api";

export default function CreateTeam() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [createdTeam, setCreatedTeam] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login?redirect=/create-team");
            return;
        }

        if (isAuthenticated) {
            fetchEvents();
        }
    }, [isAuthenticated, authLoading]);

    const fetchEvents = async () => {
        try {
            const data = await eventAPI.getAll({ active: true });
            // Filter events with open registration
            const openEvents = data.events.filter(
                (e) => new Date(e.registrationDeadline) > new Date()
            );
            setEvents(openEvents);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!teamName.trim()) {
            setError("Please enter a team name");
            return;
        }

        if (!selectedEvent) {
            setError("Please select an event");
            return;
        }

        setCreating(true);

        try {
            const data = await teamAPI.create({
                name: teamName,
                eventId: selectedEvent,
            });
            setCreatedTeam(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCreating(false);
        }
    };

    const copyInviteLink = async () => {
        if (createdTeam?.inviteUrl) {
            await navigator.clipboard.writeText(createdTeam.inviteUrl);
            alert("Invite link copied to clipboard!");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white/60">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg">
                <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-lg">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img src="/FCLogo.png" alt="Logo" className="h-10 mx-auto mb-4" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">
                            {createdTeam ? "Team Created!" : "Create Your Team"}
                        </h1>
                        {!createdTeam && (
                            <p className="text-white/60 mt-2">
                                Start a team and invite members to join
                            </p>
                        )}
                    </div>

                    {createdTeam ? (
                        <div className="text-center">
                            <div className="text-6xl mb-4">🎉</div>
                            <p className="text-white mb-2">
                                <span className="font-semibold">{createdTeam.team.name}</span> has been created!
                            </p>
                            <p className="text-white/60 text-sm mb-6">
                                Share the invite link with your team members
                            </p>

                            <div className="bg-white/5 rounded-lg p-4 mb-6">
                                <p className="text-xs text-white/40 mb-2">Invite Link</p>
                                <p className="text-amber-400 break-all text-sm">
                                    {createdTeam.inviteUrl}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={copyInviteLink}
                                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                                >
                                    Copy Invite Link
                                </button>
                                <Link
                                    to="/my-teams"
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
                                >
                                    View My Teams
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {events.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📅</div>
                                    <p className="text-white/60">
                                        No events are currently open for registration
                                    </p>
                                    <Link
                                        to="/"
                                        className="inline-block mt-4 text-amber-400 hover:text-amber-300"
                                    >
                                        ← Back to Home
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">
                                            Team Name
                                        </label>
                                        <input
                                            type="text"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
                                            placeholder="Enter your team name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">
                                            Select Event
                                        </label>
                                        <select
                                            value={selectedEvent}
                                            onChange={(e) => setSelectedEvent(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="" className="bg-[#1a1a1f]">
                                                Choose an event...
                                            </option>
                                            {events.map((event) => (
                                                <option
                                                    key={event._id}
                                                    value={event._id}
                                                    className="bg-[#1a1a1f]"
                                                >
                                                    {event.name} (Team size: {event.minTeamSize}-{event.maxTeamSize})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedEvent && (
                                        <div className="bg-white/5 rounded-lg p-4">
                                            {(() => {
                                                const event = events.find((e) => e._id === selectedEvent);
                                                if (!event) return null;
                                                return (
                                                    <>
                                                        <h4 className="text-white font-medium mb-2">
                                                            {event.name}
                                                        </h4>
                                                        <p className="text-white/60 text-sm mb-3">
                                                            {event.description}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <span className="text-white/40">Team Size: </span>
                                                                <span className="text-white">
                                                                    {event.minTeamSize} - {event.maxTeamSize}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-white/40">Deadline: </span>
                                                                <span className="text-white">
                                                                    {new Date(event.registrationDeadline).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                                    >
                                        {creating ? "Creating Team..." : "Create Team"}
                                    </button>

                                    <Link
                                        to="/"
                                        className="block text-center text-white/50 hover:text-white/70 text-sm"
                                    >
                                        ← Back to Home
                                    </Link>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
