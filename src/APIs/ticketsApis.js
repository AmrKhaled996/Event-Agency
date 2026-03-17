

export async function getTicketById(ticketId) {
    const token = getAccessToken();
    return axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
}