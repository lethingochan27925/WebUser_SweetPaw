import { apiGetAuth } from "./api.js";

export async function getRecommendProducts() {
  return await apiGetAuth("/api/recommend/home");
}


export async function getNewProducts() {
  return await apiGetAuth("/api/recommend/home");
}
export async function getTopProducts() {
  return await apiGetAuth("/api/recommend/home");
}

export async function getPopularProducts() {
  return await apiGetAuth("/api/recommend/home");
}
export async function getProductById(id) {
  return apiGetAuth(`/api/products/${id}`);
}
