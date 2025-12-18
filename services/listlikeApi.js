import { apiGetAuth, apiPostAuth} from "./api.js";
//Lấy danh sách yêu thích của người dùng
export async function getUserLikes() {
    return await apiGetAuth("/api/favorite/");
}

//Thêm hoặc xóa một mục vào danh sách yêu thích
export async function toggleUserLike(productId) {
    return await apiPostAuth("/api/favorite/toggle", { productId: productId });
}