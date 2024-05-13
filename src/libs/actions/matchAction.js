import { createScore, updateScore, getScore } from "../api-routes/match-api";

async function createMatchScore(matchScore) {
  try {
    const response = await createScore(matchScore);
    return response.data;
  } catch (error) {
    console.error("Error creating match score:", error.message);
    return { success: false, error: "Error creating match score" };
  }
}

async function updateMatchScore(matchId, updatedFields) {
  try {
    const response = await updateScore({ _id: matchId, updatedFields });
    return response.data;
  } catch (error) {
    console.error("Error updating match score:", error.message);
    return { success: false, error: "Error updating match score" };
  }
}

async function getMatchScore(matchId) {
  try {
    const response = await getScore(matchId);
    return response.data;
  } catch (error) {
    console.error("Error getting match score:", error.message);
    return { success: false, error: "Error getting match score" };
  }
}

export { createMatchScore, updateMatchScore, getMatchScore };
