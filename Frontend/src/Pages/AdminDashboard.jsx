import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventAPI, teamAPI } from "../services/api";

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [viewingTeams, setViewingTeams] = useState(null);
    const [eventTeams, setEventTeams] = useState([]);

    useEffect(() => {
        if (!authLoading) {
            if (!isAdmin) {
                navigate("/login");
                return;
            }
            fetchEvents();
        }
    }, [isAdmin, authLoading, navigate]);

    const fetchEvents = async () => {
        try {
            const data = await eventAPI.getAll();
            setEvents(data.events);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await eventAPI.delete(id);
            fetchEvents();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggle = async (id) => {
        try {
            await eventAPI.toggle(id);
            fetchEvents();
        } catch (err) {
            alert(err.message);
        }
    };

    const viewTeams = async (event) => {
        setViewingTeams(event);
        try {
            const data = await teamAPI.getEventTeams(event._id);
            setEventTeams(data.teams);
        } catch (err) {
            alert(err.message);
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
        <div className="min-h-screen">
            {/* Header */}
            <nav className="bg-[#1a1a1f]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <img src="/FCLogo.png" alt="Logo" className="h-8" />
                        </Link>
                        <span className="text-white/40">|</span>
                        <span className="text-white font-semibold">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white/60">{user?.name}</span>
                        <button
                            onClick={logout}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
                        <p className="text-white/60 text-sm">Total Events</p>
                        <p className="text-3xl font-bold text-white mt-1">{events.length}</p>
                    </div>
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
                        <p className="text-white/60 text-sm">Active Events</p>
                        <p className="text-3xl font-bold text-green-400 mt-1">
                            {events.filter((e) => e.isActive).length}
                        </p>
                    </div>
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6">
                        <p className="text-white/60 text-sm">Upcoming Events</p>
                        <p className="text-3xl font-bold text-amber-400 mt-1">
                            {events.filter((e) => e.status === "upcoming").length}
                        </p>
                    </div>
                </div>

                {/* Events Section */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Events</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Event
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="text-center py-16 bg-[#1a1a1f] border border-white/10 rounded-xl">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
                        <p className="text-white/60 mb-6">Create your first event to get started</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Create Event
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#1a1a1f] border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Event</th>
                                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Dates</th>
                                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Team Size</th>
                                    <th className="text-left text-white/60 text-sm font-medium px-6 py-4">Status</th>
                                    <th className="text-right text-white/60 text-sm font-medium px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr key={event._id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-6 py-4">
                                            <p className="text-white font-medium">{event.name}</p>
                                            <p className="text-white/50 text-sm truncate max-w-xs">
                                                {event.description}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white text-sm">
                                                {new Date(event.startDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-white/50 text-xs">
                                                Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-white">
                                            {event.minTeamSize} - {event.maxTeamSize}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${event.isActive
                                                        ? "bg-green-500/20 text-green-400"
                                                        : "bg-red-500/20 text-red-400"
                                                    }`}
                                            >
                                                {event.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => viewTeams(event)}
                                                    className="text-white/60 hover:text-white p-2 rounded hover:bg-white/10 transition-colors"
                                                    title="View Teams"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setEditingEvent(event)}
                                                    className="text-white/60 hover:text-white p-2 rounded hover:bg-white/10 transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleToggle(event._id)}
                                                    className={`p-2 rounded transition-colors ${event.isActive
                                                            ? "text-yellow-400 hover:bg-yellow-500/10"
                                                            : "text-green-400 hover:bg-green-500/10"
                                                        }`}
                                                    title={event.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Event Modal */}
            {(showCreateModal || editingEvent) && (
                <EventModal
                    event={editingEvent}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingEvent(null);
                    }}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        setEditingEvent(null);
                        fetchEvents();
                    }}
                />
            )}

            {/* View Teams Modal */}
            {viewingTeams && (
                <TeamsModal
                    event={viewingTeams}
                    teams={eventTeams}
                    onClose={() => {
                        setViewingTeams(null);
                        setEventTeams([]);
                    }}
                />
            )}
        </div>
    );
}

// Event Create/Edit Modal Component
function EventModal({ event, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: event?.name || "",
        description: event?.description || "",
        startDate: event?.startDate?.split("T")[0] || "",
        endDate: event?.endDate?.split("T")[0] || "",
        registrationDeadline: event?.registrationDeadline?.split("T")[0] || "",
        minTeamSize: event?.minTeamSize || 1,
        maxTeamSize: event?.maxTeamSize || 4,
        venue: event?.venue || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (event) {
                await eventAPI.update(event._id, formData);
            } else {
                await eventAPI.create(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {event ? "Edit Event" : "Create Event"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white p-2 rounded hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Event Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                            placeholder="e.g., Dollar 2026"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 min-h-[100px]"
                            placeholder="Event description..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm mb-2">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Registration Deadline</label>
                        <input
                            type="date"
                            value={formData.registrationDeadline}
                            onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Min Team Size</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.minTeamSize}
                                onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white/70 text-sm mb-2">Max Team Size</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.maxTeamSize}
                                onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Venue</label>
                        <input
                            type="text"
                            value={formData.venue}
                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                            placeholder="e.g., Main Auditorium"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Teams Modal Component
function TeamsModal({ event, teams, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registered Teams</h2>
                        <p className="text-white/60 text-sm">{event.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white p-2 rounded hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {teams.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">👥</div>
                        <p className="text-white/60">No teams registered yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {teams.map((team) => (
                            <div
                                key={team._id}
                                className="bg-white/5 rounded-xl p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white font-medium">{team.name}</h3>
                                    <span className="text-xs text-white/40">
                                        {team.members.length} / {event.maxTeamSize} members
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {team.members.map((member) => (
                                        <div
                                            key={member.user._id}
                                            className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs font-semibold">
                                                {member.user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white text-sm">{member.user.name}</span>
                                            {member.role === "lead" && (
                                                <span className="text-xs text-amber-400">(Lead)</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-white/40 text-sm">
                        Total: {teams.length} teams, {teams.reduce((acc, t) => acc + t.members.length, 0)} participants
                    </p>
                </div>
            </div>
        </div>
    );
}
