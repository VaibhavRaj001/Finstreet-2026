const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch wrapper with credentials
async function fetchAPI(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

// Event API
export const eventAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`/events${query ? `?${query}` : ""}`);
    },

    getById: (id) => fetchAPI(`/events/${id}`),

    create: (data) =>
        fetchAPI("/events", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id, data) =>
        fetchAPI(`/events/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id) =>
        fetchAPI(`/events/${id}`, {
            method: "DELETE",
        }),

    toggle: (id) =>
        fetchAPI(`/events/${id}/toggle`, {
            method: "PATCH",
        }),
};

// Team API
export const teamAPI = {
    create: (data) =>
        fetchAPI("/teams", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getByInviteCode: (code) => fetchAPI(`/teams/invite/${code}`),

    join: (code) =>
        fetchAPI(`/teams/join/${code}`, {
            method: "POST",
        }),

    getMyTeams: () => fetchAPI("/teams/my-teams"),

    getById: (id) => fetchAPI(`/teams/${id}`),

    leave: (id) =>
        fetchAPI(`/teams/${id}/leave`, {
            method: "POST",
        }),

    removeMember: (teamId, memberId) =>
        fetchAPI(`/teams/${teamId}/members/${memberId}`, {
            method: "DELETE",
        }),

    getEventTeams: (eventId) => fetchAPI(`/teams/event/${eventId}`),
};
