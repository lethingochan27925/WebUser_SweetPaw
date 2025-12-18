import { getProfile, updateProfile, changePassword } from "/services/userApi.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Gọi hàm từ userApi.js
        const profile = await getProfile(); 
        
        // Điền dữ liệu vào form Hồ sơ của tôi
        document.getElementById('fullname').value = profile.fullName || 'hehe';
        document.getElementById('email').value = profile.email || ''; 
        document.getElementById('sdt').value = profile.phone || '';
        //Cập nhật tên người dùng ở cột bên trái
        document.querySelector('.heading-name_acc').innerText = profile.fullName || 'Người dùng';
        document.querySelector('.nav-item__first-name').innerText = profile.fullName || 'Người dùng';
    } catch (error) {
        console.error("Lỗi khi tải profile:", error);
        alert("Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.");
    }
});


// 2. XỬ LÝ CẬP NHẬT HỒ SƠ (Khi nhấn nút Lưu)
document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
    const updateData = {
        fullName: document.getElementById('fullname').value,
        phone: document.getElementById('sdt').value,
    };

    try {
        const result = await updateProfile(updateData);
        alert("Cập nhật hồ sơ thành công!");
        // Có thể reload trang hoặc cập nhật lại giao diện
    } catch (error) {
        alert("Lỗi cập nhật hồ sơ: " + error.message);
    }
});


// 3. XỬ LÝ ĐỔI MẬT KHẨU (Khi nhấn nút Lưu trong form đổi mật khẩu)
document.getElementById('savePasswordBtn')?.addEventListener('click', async () => {
    const oldPass = document.getElementById('password').value;
    const newPass = document.getElementById('password-new').value;
    const confirmPass = document.getElementById('password-confirm').value;

    if (newPass !== confirmPass) {
        return alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }
    
    try {
        const result = await changePassword(oldPass, newPass);
        alert(result.message || "Đổi mật khẩu thành công!");
        // Xóa nội dung các ô input sau khi thành công
        document.getElementById('password').value = '';
        document.getElementById('password-new').value = '';
        document.getElementById('password-confirm').value = '';

    } catch (error) {
        alert("Lỗi đổi mật khẩu: " + error.message);
    }
});