// const baseURL = "http://localhost:3000";

// async function createMatchScore(matchScore) {
//   const res = await fetch("/api/createScore", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(matchScore),
//   });
//   const data = await res.json();
//   return data;
// }

// async function updateMatchScore(matchId, updatedFields) {
//   try {
//     const res = await fetch(`/api/updateScore/${matchId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedFields),
//     });
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error updating match score:", error.message);
//     return { success: false, error: "Error updating match score" };
//   }
// }

// async function getMatchScore(matchId) {
//   try {
//     const res = await fetch(`${baseURL}/api/getScore/${matchId}`);
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error getting match score:", error.message);
//     return { success: false, error: "Error getting match score" };
//   }
// }

// module.exports = { createMatchScore, updateMatchScore, getMatchScore };