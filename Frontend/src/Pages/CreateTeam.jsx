import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventAPI, teamAPI } from "../services/api";
import Alert from "../components/Alert";

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

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?redirect=/create-team");
      return;
    }

    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getAll({ active: true });
      // Filter events with open registration
      const openEvents = data.events.filter(
        (e) => new Date(e.registrationDeadline) > new Date(),
      );
      setEvents(openEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertConfig({ isOpen: true, type, message });
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
      showAlert(
        "success",
        "Team created successfully! Share the code with your friends.",
      );
    } catch (err) {
      setError(err.message);
      showAlert("error", err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text, msg) => {
    await navigator.clipboard.writeText(text);
    showAlert("success", msg);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60 text-lg">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="bg-[#1a1a1f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Decorative Blur */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-amber-600/5 rounded-full blur-3xl" />

          <div className="text-center mb-10 relative z-10">
            <Link
              to="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <img src="/FCLogo.png" alt="Logo" className="h-12 mb-6" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {createdTeam ? "Team Ready!" : "Form Your Team"}
            </h1>
            {!createdTeam && (
              <p className="text-white/50 mt-3 text-lg font-light">
                Start a team and invite members to join the action
              </p>
            )}
          </div>

          {createdTeam ? (
            <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <div className="text-5xl">🏆</div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {createdTeam.team.name}
              </h2>
              <p className="text-amber-400 font-medium mb-8">
                Registered for{" "}
                {events.find((e) => e._id === selectedEvent)?.name}
              </p>

              <div className="grid gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group transition-all hover:bg-white/[0.07]">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">
                    Your Unique Team Code
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-mono font-bold text-white tracking-[0.2em]">
                      {createdTeam.team.inviteCode}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          createdTeam.team.inviteCode,
                          "Team code copied!",
                        )
                      }
                      className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                      title="Copy Code"
                    >
                      <svg
                        className="w-5 h-5"
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
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 mt-3">
                    Members can enter this code in the Join Team modal
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group transition-all hover:bg-white/[0.07]">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">
                    Direct Invite Link
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-amber-400 truncate font-medium">
                      {createdTeam.inviteUrl}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          createdTeam.inviteUrl,
                          "Invite link copied!",
                        )
                      }
                      className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all active:scale-95"
                      title="Copy Link"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/my-teams"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all text-center"
                >
                  My Teams
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 rounded-2xl transition-all text-center shadow-xl shadow-amber-600/20"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-6">📅</div>
                  <p className="text-white/60 text-lg">
                    No events are currently open for registration.
                  </p>
                  <Link
                    to="/"
                    className="inline-block mt-8 bg-white/5 border border-white/10 px-8 py-3 rounded-xl text-white hover:bg-white/10 transition-all"
                  >
                    ← Back to Home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl animate-pulse">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-white/50 text-sm font-semibold uppercase tracking-wider ml-1">
                      Team Identity
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-amber-500/50 transition-all text-lg shadow-inner"
                      placeholder="Creative Team Name..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white/50 text-sm font-semibold uppercase tracking-wider ml-1">
                      Target Event
                    </label>
                    <div className="relative">
                      <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-all appearance-none cursor-pointer text-lg shadow-inner"
                        required
                      >
                        <option value="" disabled className="bg-[#1a1a1f]">
                          Select an upcoming challenge...
                        </option>
                        {events.map((event) => (
                          <option
                            key={event._id}
                            value={event._id}
                            className="bg-[#1a1a1f]"
                          >
                            {event.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {selectedEvent && (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
                      {(() => {
                        const event = events.find(
                          (e) => e._id === selectedEvent,
                        );
                        if (!event) return null;
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-amber-400 font-bold text-lg">
                                {event.name}
                              </h4>
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 font-bold uppercase tracking-tighter">
                                Registration Open
                              </span>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">
                              {event.description}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="bg-[#2a2a2f]/50 p-3 rounded-xl border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase font-bold mb-1 tracking-tighter">
                                  Team Size
                                </p>
                                <p className="text-white text-sm font-semibold">
                                  {event.minTeamSize} - {event.maxTeamSize}{" "}
                                  Members
                                </p>
                              </div>
                              <div className="bg-[#2a2a2f]/50 p-3 rounded-xl border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase font-bold mb-1 tracking-tighter">
                                  Deadline
                                </p>
                                <p className="text-white text-sm font-semibold">
                                  {new Date(
                                    event.registrationDeadline,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={creating}
                      className="w-full bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold py-5 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-amber-600/30 text-lg active:scale-95"
                    >
                      {creating ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Create Team Now"
                      )}
                    </button>

                    <Link
                      to="/"
                      className="block text-center text-white/30 hover:text-white/60 text-sm mt-6 transition-colors"
                    >
                      ← Discard and Go Home
                    </Link>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

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
