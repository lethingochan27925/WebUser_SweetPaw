import { apiGetAuth, apiPostAuth, apiPutAuth  } from "./api.js";

export async function getMyOrders() {
  return apiGetAuth("/api/orders/my-orders");
}
export async function getOrderDetail(orderId) {
  return apiGetAuth(`/api/orders/detail/${orderId}`);
}

//Viết đỡ
export function getMe() {
  return apiGetAuth("/api/user/me");
}
//Để tạm
export function addAddress(body) {
  const userId = localStorage.getItem('user_id');
  return apiPutAuth(`/api/user/${userId}/add-address`, body);
}

//Đặt hàng
export function createOrder(body) {
  return apiPostAuth("/api/orders", body);
}
 
export function previewOrder(body) {
  return apiPostAuth("/api/orders/preview", body);
}