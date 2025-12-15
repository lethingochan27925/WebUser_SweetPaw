import { apiPost } from "./api.js";

// Hàm đăng nhập
export async function login(email, password) {
  try {
    const result = await apiPost("/api/auth/login", {
      email: email,
      password: password
    });

    console.log("Kết quả login:", result);

    // Kiểm tra đăng nhập thành công
    if (result.Boolean === true) {
      // Lưu token & user theo đúng api.js
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user.id);
      localStorage.setItem("userData", JSON.stringify(result.user));

      return {
        success: true,
        user: result.user,
        token: result.token
      };
    }

    // Sai tài khoản hoặc mật khẩu
    return {
      success: false,
      message: "Sai email hoặc mật khẩu!"
    };

  } catch (err) {
    console.error("Lỗi login:", err);

    return {
      success: false,
      message: err.message || "Lỗi kết nối server!"
    };
  }
}
window.login = login;



// Hàm ĐĂNG KÝ
export async function register(name, email, password) {
    try {
        const result = await apiPost("/api/auth/register", {
            name: name,
            email: email,
            password: password
        });

        console.log("Kết quả register:", result);

        if (result.Boolean === true) {
            localStorage.setItem("user_id", result.id);
            localStorage.setItem("userData", JSON.stringify(result.user));

            return {
                success: true,
                user: result.user,
                //token: result.token,

                message: "Đăng ký thành công và tự động đăng nhập!"
            };
        }

        return {
            success: false,
            message: result.message || "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin."
        };

    } catch (err) {
        // 4. CHỈNH SỬA: Bắt lỗi API (400, 500, lỗi kết nối) và thay đổi thông báo lỗi
        console.error("Lỗi đăng ký:", err);

        return {
            success: false,
            message: err.message || "Lỗi kết nối hoặc Email đã tồn tại!"
        };
    }
}
window.register = register;