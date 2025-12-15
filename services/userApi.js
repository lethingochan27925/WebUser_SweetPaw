import { apiGetAuth, apiPostAuth, apiPutAuth, apiDeleteAuth, apiPatchAuth  } from "./api.js";

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