import { ApiError } from "@common/ApiError";

const API_URL = "http://localhost:5000/api"; // Adjust this base URL as needed

/**
 * Gets custom header values from URL path
 * @returns Object with headers to add to requests
 */
const getCustomHeadersFromUrl = (): Record<string, string> => {
  const headers: Record<string, string> = {};

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Get the path from the URL (removing the domain)
    const path = window.location.pathname;

    // Extract the session ID from the path if it exists
    // This assumes the path format is like "/1234567" or "/1234567/somepage"
    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const potentialSessionId = pathParts[0];
      // Only use it if it looks like a session ID (you may want to adjust this validation)
      if (/^[a-zA-Z0-9-]+$/.test(potentialSessionId)) {
        headers["X-Session"] = potentialSessionId;
      }
    }

    // You can add more custom headers based on other URL parts if needed
  }

  // Read client id from session storage
  const clientId = sessionStorage.getItem("clientId");
  if (clientId) {
    headers["X-Client"] = clientId;
  }

  return headers;
};

/**
 * Enhanced fetch wrapper that automatically adds custom headers from URL path
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise with fetch response
 */
const enhancedFetch = async (url: string, options: RequestInit = {}) => {
  const customHeaders = getCustomHeadersFromUrl();

  // Merge existing headers with custom headers
  const headers = {
    ...options.headers,
    ...customHeaders,
  };

  // Return fetch with enhanced options
  return fetch(url, {
    ...options,
    headers,
  });
};

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
    const response = await enhancedFetch(`${API_URL}/quiz/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();

      throw new Error(error.message || `API error: ${response.status}`);
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
