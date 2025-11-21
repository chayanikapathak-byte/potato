import axios from "axios";

const API_URL = "/api";

export const searchSteamGames = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/steam/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Steam search error:", error);
    throw error;
  }
};

export const getSteamGameDetails = async (appId) => {
  try {
    const response = await axios.get(`${API_URL}/steam/game/${appId}`);
    return response.data;
  } catch (error) {
    console.error("Steam game details error:", error);
    throw error;
  }
};
