import { apiGetAuth, apiPostAuth, apiPutAuth, apiDeleteAuthHasBody, apiPatchAuth  } from "./api.js";

// Xem hồ sơ người dùng 
export async function getProfile() {
    return await apiGetAuth("/api/user/me");
}

// Cập nhật hồ sơ người dùng
export async function updateProfile(updateData) {
    return await apiPatchAuth("/api/user/me", updateData);
}

// Đổi mật khẩu người dùng
export async function changePassword(oldPassword, newPassword) {
    return await apiPatchAuth("/api/user/change-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
    });
}

// Lấy địa chỉ người dùng
export async function getAddress() {
    return await apiGetAuth("/api/user/me");
}

// Cập nhật địa chỉ người dùng
export async function updateAddress(user_id, index, addressData) {
    return await apiPatchAuth(`/api/user/${user_id}/address/updateAddress`, { 
        index: index, 
        data: addressData
    });
}

// Set địa chỉ mặc định
export async function setDefaultAddress(user_id, index) {
    return await apiPatchAuth(`/api/user/${user_id}/address/default`, { 
        index: Number(index) 
    });
}   
// Xóa địa chỉ người dùng
export async function deleteAddress(user_id, index) {
    return await apiDeleteAuthHasBody(`/api/user/${user_id}/address/deleteAddress`,{
        index: Number(index) 
    });
}

// Hàm thêm địa chỉ mới khi nhấn nút Thêm địa chỉ mới
export async function addAddress(user_id, addressData) {
    return await apiPutAuth(`/api/user/${user_id}/add-address`,addressData);
}