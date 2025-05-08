const API_URL = "http://localhost:5000/api"; // Adjust this base URL as needed

/**
 * Registers client with the server by sending clientId and socketId
 * @param clientId - The client's unique identifier
 * @param socketId - The socket connection ID
 * @returns Promise with the response data
 */
export const registerClient = async (clientId: string, socketId: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId,
        socketId,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to register client:", error);
    throw error;
  }
};

/**
 * Save username for a client
 * @param clientId The client's unique identifier
 * @param username The username to save
 * @returns Promise with response data
 */
export const saveUsername = async (clientId: string, username: string) => {
  try {
    const response = await fetch(`${API_URL}/username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId,
        username: username.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving username:", error);
    throw error;
  }
};

/**
 * Retrieve all active quiz sessions from the server
 * @returns Promise with array of Session objects
 */
export const getActiveSessions = async () => {
  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw error;
  }
};

/**
 * Retrieve all quizzes
 * @returns Promise with array of Quiz objects
 */
export const getQuizzes = async () => {
  try {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    throw error;
  }
};

/**
 * Retrieve all quizzes
 * @returns Promise with array of Quiz objects
 */
export const getQuiz = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/quiz/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching quiz with id ${id} :`, error);
    throw error;
  }
};

export const purgeServerState = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/purge`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error purging server state:", error);
    throw error;
  }
};
