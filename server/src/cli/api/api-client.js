import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.BETTER_AUTH_URL || "http://localhost:3005";

export async function getUserFromApi(accessToken) {
  try {
    const response = await fetch(`${URL}/api/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.user || null;
  } catch (error) {
    console.error(chalk.red("Failed to fetch user session from server:"), error.message);
    return null;
  }
}

export async function getOrCreateConversation(accessToken, conversationId, mode = "chat") {
  try {
    const response = await fetch(`${URL}/api/chat/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ conversationId, mode }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to get or create conversation");
    }

    return await response.json();
  } catch (error) {
    console.error(chalk.red("API Error (getOrCreateConversation):"), error.message);
    throw error;
  }
}

export async function addMessage(accessToken, conversationId, role, content) {
  try {
    const response = await fetch(`${URL}/api/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ conversationId, role, content }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to add message");
    }

    return await response.json();
  } catch (error) {
    console.error(chalk.red("API Error (addMessage):"), error.message);
    throw error;
  }
}

export async function getMessages(accessToken, conversationId) {
  try {
    const response = await fetch(`${URL}/api/chat/conversations/${conversationId}/messages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to get messages");
    }

    return await response.json();
  } catch (error) {
    console.error(chalk.red("API Error (getMessages):"), error.message);
    throw error;
  }
}

export async function updateTitle(accessToken, conversationId, title) {
  try {
    const response = await fetch(`${URL}/api/chat/conversations/${conversationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to update title");
    }

    return await response.json();
  } catch (error) {
    console.error(chalk.red("API Error (updateTitle):"), error.message);
    throw error;
  }
}
