import { apiGetAuth, apiPostAuth, apiPutAuth, apiDeleteAuth  } from "./api.js";

export async function getCart() {
    const user_id = localStorage.getItem('user_id');
    return await apiGetAuth(`/api/cart/${user_id}`);
}

export async function addToCart(productId, quantity) {
  return apiPostAuth("/api/cart/add", {
    productId,
    quantity,
  });
}

export async function updateCartQuantity(productId, change) {
  return apiPutAuth("/api/cart/quantity", {
    productId,
    change,
  });
}

export async function removeOneFromCart(productId) {
  return apiDeleteAuth(`/api/cart/clear/${productId}`);
}
