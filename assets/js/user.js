import { getProfile, updateProfile, changePassword, updateAddress, deleteAddress, getAddress, setDefaultAddress, addAddress} from "/services/userApi.js";
import {getUserLikes } from "/services/listlikeApi.js"; 
import { getCart  } from "/services/cartApi.js";


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
        document.querySelector('._body').innerText = profile.fullName || 'Người dùng';

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

let currentEditingAddressIndex = null; 

//4. RENDER Lấy danh sách địa chỉ và hiển thị
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab === 'address') {
        document.querySelector('.detail__my-profile').classList.remove('display');
        document.querySelector('.detail__my-profile').classList.add('undisplay');
        
        document.querySelector('.detail__my-address').classList.remove('undisplay');
        document.querySelector('.detail__my-address').classList.add('display');

        document.getElementById('address-list-section').classList.remove('undisplay');
        document.getElementById('address-list-section').classList.add('display');
        document.getElementById('address-edit-section').classList.add('undisplay');
        document.getElementById('address-add-section').classList.add('undisplay');

        document.querySelector('.my-profile-title').classList.remove('active'); 
        document.querySelector('.my-address-title').classList.add('active');

        localStorage.removeItem('activeTab');
    }

    try {
        const response = await getAddress();
        const addressList = response.address || [];
        
        const addressContainer = document.querySelector('.address-list');
        
        if (!addressContainer) return;

        addressContainer.innerHTML = '';

        if (addressList.length === 0) {
            addressContainer.innerHTML = '<p style="padding: 20px;">Bạn chưa có địa chỉ nào.</p>';
            return;
        }

        addressList.forEach((addr,index) => {
            const addrDiv = document.createElement('div');
            addrDiv.className = 'address-item';
            addrDiv.onclick = () => showEditForm(addr, index); 
            
            addrDiv.innerHTML = `
                <div class="address-name">
                    <h3>${addr.TenDiaChi || 'Địa chỉ'}</h3>
                </div>
                <div class="address-detail">
                    <p>${addr.SoNha}, ${addr.TenDuong}, ${addr.PhuongXa}, ${addr.QuanHuyen}, ${addr.ThanhPho}</p>
                </div>
                </div> ${addr.MacDinh ? '<div class="address-default-yon">Mặc định</div>' : ''}
            `;
            addressContainer.appendChild(addrDiv);
        });
    } catch (error) {
        console.error("Lỗi khi tải địa chỉ:", error);
    }
});



// Hàm hiển thị form chỉnh sửa địa chỉ
document.addEventListener("DOMContentLoaded", () => {
    window.showEditForm = function(address = {}, index) {
        currentEditingAddressIndex = index;
        document.getElementById('address-list-section').classList.add('undisplay');
        document.getElementById('address-list-section').classList.remove('display');
        document.getElementById('address-edit-section').classList.remove('undisplay');
        document.getElementById('address-edit-section').classList.add('display');

        // Điền dữ liệu vào form chỉnh sửa
        document.getElementById('input-edit-name').value = address.TenDiaChi || '';
        document.getElementById('input-edit-home-number').value = address.SoNha || '';
        document.getElementById('input-edit-street').value = address.TenDuong || '';
        document.getElementById('input-edit-ward').value = address.PhuongXa || '';
        document.getElementById('input-edit-district').value = address.QuanHuyen || '';
        document.getElementById('input-edit-city').value = address.ThanhPho || '';

    };
});

// Hàm cập nhật đia chỉ khi nhấn nút Cập nhật trong form chỉnh sửa
document.querySelector('.form-submit-updatebtn')?.addEventListener('click', async () => {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) {
        alert("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
    }
    const addressData = {
        TenDiaChi: document.getElementById('input-edit-name').value,
        SoNha: document.getElementById('input-edit-home-number').value,
        TenDuong: document.getElementById('input-edit-street').value,
        PhuongXa: document.getElementById('input-edit-ward').value,
        QuanHuyen: document.getElementById('input-edit-district').value,
        ThanhPho: document.getElementById('input-edit-city').value,

    };
    try {
        await updateAddress(user_id, Number(currentEditingAddressIndex), addressData);  
    
        alert("Cập nhật địa chỉ thành công!");
        localStorage.setItem('activeTab', 'address');
        location.reload();


    } catch (error) {
        alert("Lỗi cập nhật địa chỉ: " + error.message);
    }
});

// Hàm set địa chỉ mặc định
document.querySelector('.form-submit-defaultbtn')?.addEventListener('click', async () => {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) {
        alert("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
    }
    try {
        await setDefaultAddress(user_id, Number(currentEditingAddressIndex));      
        alert("Đặt địa chỉ mặc định thành công!");  
        // thêm dòng này để nó khỏi load sai tab
        localStorage.setItem('activeTab', 'address');

        location.reload();

    } catch (error) {
        alert("Lỗi đặt địa chỉ mặc định: " + error.message);
    }
});


//Hàm xóa địa chỉ khi nhấn nút Xóa trong form chỉnh sửa
document.querySelector('.form-submit-deletebtn')?.addEventListener('click', async () => {
    const user_id = localStorage.getItem('user_id');
    
    console.log("Giá trị index hiện tại:", currentEditingAddressIndex);

    if (currentEditingAddressIndex === null || currentEditingAddressIndex === undefined) {
        alert("Lỗi: Không tìm thấy vị trí địa chỉ để xóa.");
        return;
    }

    try {
        await deleteAddress(user_id, currentEditingAddressIndex);
        alert("Xóa địa chỉ thành công!");
        localStorage.setItem('activeTab', 'address');

        location.reload();
    } catch (error) {
        alert("Lỗi xóa địa chỉ: " + error.message);
    }
});

// Hàm THÊM ĐỊA CHỈ MỚI
document.querySelector('.form-submit-savebtn')?.addEventListener('click', async () => {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) {
        alert("Lỗi: Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
    }
    const ten = document.getElementById('input-add-name').value.trim();
    const soNha =  document.getElementById('input-add-home-number').value.trim();
    const tenDuong = document.getElementById('input-add-street').value.trim();
    const phuongXa = document.getElementById('input-add-ward').value.trim();
    const quanHuyen = document.getElementById('input-add-district').value.trim();
    const thanhPho = document.getElementById('input-add-city').value.trim();  
    console.log({ten, soNha, tenDuong, phuongXa, quanHuyen, thanhPho});    
    if (!ten || !soNha || !tenDuong || !phuongXa || !quanHuyen || !thanhPho) {
        alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
        return;
    }  
    const addressData = {
        TenDiaChi: ten,     
        SoNha: soNha,
        TenDuong: tenDuong,                 
        PhuongXa: phuongXa,
        QuanHuyen: quanHuyen,
        ThanhPho: thanhPho,
        MacDinh: false
    };
    try {
        await addAddress(user_id, addressData);
        alert("Thêm địa chỉ thành công!");
        localStorage.setItem('activeTab', 'address');

        location.reload();
    } catch (error) {
        alert("Lỗi thêm địa chỉ: " + error.message);
    }
});


async function loadFavoritesOnce() {
  try {
    const res = await getUserLikes();
    if (res?.data) {
      const favoriteIds = res.data.map(item => item._id);
      updateLikeNotice(favoriteIds.length);

    }
  } catch (e) {
    console.error("Lỗi load favorite:", e);
  }
}

function updateLikeNotice(count) {
    const noticeElements = document.querySelectorAll('#header__second__like--notice');
    noticeElements.forEach(el => {
        el.textContent = count > 0 ? count : '';
        el.style.display = count > 0 ? 'inline-block' : 'none'; 
    });
}

//Load số lượng giỏ hàng
async function loadCartOnce() {
  try {
    const res = await getCart();
    const items = res?.data?.items || [];
    updateCartNotice(items.length);
  } catch (e) {
    console.error("Lỗi load cart:", e);
  }
}
function updateCartNotice(count) {
  const noticeElements = document.querySelectorAll('#header__second__cart--notice');
  noticeElements.forEach(el => {
    el.textContent = count > 0 ? count : '';
    el.style.display = count > 0 ? 'inline-block' : 'none'; 
  });
}
loadCartOnce();

loadFavoritesOnce();