import { apiGetAuth, apiPostAuth } from "./api.js";

export async function getAllProducts() {
  return await apiGetAuth("/api/products");
}

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

export async function getProductsByCategory(categoryName) {
  return apiGetAuth(`/api/products/category/${encodeURIComponent(categoryName)}`);
}

export async function filterProducts(body) {
  return await apiPostAuth("/api/products/filter", body);
}

export async function searchProducts(keyword) {
  return await apiGetAuth(`/api/products/search?q=${encodeURIComponent(keyword)}`);
}