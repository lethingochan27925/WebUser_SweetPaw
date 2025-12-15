import { apiGetAuth, apiPostAuth, apiPutAuth, apiDeleteAuthHasBody   } from "./api.js";

export function getMyRatings() {
  return apiGetAuth("/api/ratings");
}

export async function createRating(payload) {
  return apiPostAuth("/api/ratings/createrating", payload);
}

export function updateRating(payload) {
  return apiPutAuth("/api/ratings/updaterating", payload);
}

export function deleteRating(body) {
  return apiDeleteAuthHasBody("/api/ratings/deleterating", body);
}