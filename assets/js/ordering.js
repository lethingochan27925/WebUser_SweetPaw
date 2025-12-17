import { getMe, createOrder, previewOrder, addAddress  } from "/services/orderApi.js";

let checkoutItems = JSON.parse(localStorage.getItem("checkout_items")) || [];
let currentUser = null;
let currentAddress = null;
let currentDiscountCode = "";

async function previewOrderPrice() {
    if (!currentAddress || checkoutItems.length === 0) return;

    const body = {
        items: checkoutItems.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            weight: 200 // tạm fix
        })),
        discount_code: currentDiscountCode,
        address: currentAddress
    };
    const msgEl = document.querySelector(".message-discount");

    try {
        const res = await previewOrder(body);
        const data = res.data;

        document.querySelector(".subtotal").innerText =  data.subtotal.toLocaleString() + " đ";
        document.querySelector(".shipping-fee").innerText = data.shipping_fee.toLocaleString() + " đ";
        document.querySelector(".discount").innerText = data.discount_amount.toLocaleString() + " đ";
        document.querySelector(".payment").innerText = data.total.toLocaleString() + " đ";

        //THÔNG BÁO MÃ GIẢM GIÁ
        if (currentDiscountCode) {
            if (data.discount_amount > 0) {
                msgEl.innerText = `Áp dụng mã thành công`;
                msgEl.style.color = "green";
            } else {
                msgEl.innerText = `Mã không có hiệu lực`;
                msgEl.style.color = "orange";
            }
        } else {
            msgEl.innerText = "";
        }
    } catch (err) {
        alert(err.message);
        
        msgEl.innerText = err.message || "Mã khuyến mãi không hợp lệ";
        msgEl.style.color = "red";

        // reset giảm giá
        document.querySelector(".discount").innerText = "0 đ";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const items = JSON.parse(localStorage.getItem("checkout_items")) || [];
    const container = document.querySelector(".right-order .item");

    container.innerHTML = "";

    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.total;

        container.insertAdjacentHTML("beforeend", `
            <div class="product">
                <img id="image" src="${item.image}">
                <div class="product-info">
                    <h3 id="name-product" >${item.name}</h3>
                    <p style="font-style: italic; font-size: 13px;">${item.des}</p>
                    <p class="price">${item.price.toLocaleString()} đ</p>
                    <p>Số lượng: <span id="soluong">${item.quantity}</span></p>
                </div>
            </div>
        `);
    });

    document.querySelector(".subtotal").innerText =
        subtotal.toLocaleString() + " đ";

    try {
        const res = await getMe();

        if (!res) return;

        const user = res;
        currentUser = user;

        // Thông tin cơ bản 
        document.getElementById("name").value = user.fullName || "";
        document.getElementById("sdt").value = user.phone || "";


        //load địa chỉ
        renderAddressSelect(user.address)
    } catch (err) {
        console.error("Lỗi load user:", err);
    }

    
});

//Áp dụng khuyến mãi
document.querySelector(".btnApDung").addEventListener("click", () => {
    const code = document.querySelector(".discount-input").value.trim();

    if (!code) {
        alert("Vui lòng nhập mã khuyến mãi");
        return;
    }

    currentDiscountCode = code;
    previewOrderPrice();
});


//Đặt hàng
document.querySelector(".btnDatHang").addEventListener("click", async () => {
    const body = {
        to_name: document.getElementById("name").value,
        to_phone: document.getElementById("sdt").value,
        to_address: `${currentAddress.SoNha} ${currentAddress.TenDuong}`,
        to_ward_name: currentAddress.PhuongXa,
        to_district_name: currentAddress.QuanHuyen,
        to_province_name: currentAddress.ThanhPho,
        note: document.getElementById("note").value,
        payment_type_id: Number(document.querySelector(".payment-method").value),
        discount_code: currentDiscountCode,
        items: checkoutItems.map(i => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            weight: 200
        }))
    };

    try {
        await createOrder(body);
        localStorage.removeItem("checkout_items");
        alert("Đặt hàng thành công");
        window.location.href = "/orders.html";
    } catch (err) {
        alert(err.message);
    }
});

//Thêm địa chỉ mới
document.querySelector(".btn-save").addEventListener("click", async () => {
  try {
    const inputs = document.querySelectorAll(".modal-body input");
    const body = {
      TenDiaChi: inputs[0].value.trim(),
      SoNha: inputs[1].value.trim(),
      TenDuong: inputs[2].value.trim(),
      PhuongXa: inputs[3].value.trim(),
      QuanHuyen: inputs[4].value.trim(),
      ThanhPho: inputs[5].value.trim(),
      MacDinh: false
    };

    const res = await addAddress(body);

    alert(res.message || "Thêm địa chỉ thành công");

    // Cập nhật lại dropdown địa chỉ
    renderAddressSelect(res.diaChi);

    // đóng modal
    document.getElementById("modalAddress").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    
  } catch (err) {
    alert(err.message);
  }
});

function renderAddressSelect(addresses) {
    
    const addressSelect = document.querySelector(".diachi");
    addressSelect.innerHTML = "";

    if (Array.isArray(addresses) && addresses.length > 0) {
        addresses.forEach((addr, index) => {
            const fullAddress = `
            ${addr.SoNha}, ${addr.TenDuong}, ${addr.PhuongXa},
            ${addr.QuanHuyen}, ${addr.ThanhPho}
            `.replace(/\s+/g, " ").trim();

            const option = document.createElement("option");
            option.value = index;
            option.textContent = fullAddress;

            if (addr.MacDinh) {
            option.selected = true;
            }

            addressSelect.appendChild(option);
        });
        // set địa chỉ mặc định
        currentAddress = addresses.find(a => a.MacDinh) || addresses[0];
        // gọi preview lần đầu
        previewOrderPrice();
        // Khi đổi địa chỉ → tính lại
        addressSelect.addEventListener("change", () => {
            currentAddress = addresses[addressSelect.value];
            previewOrderPrice();
        });

    } 
    else {
        addressSelect.innerHTML =  `<option value="">Chưa có địa chỉ</option>`;
    }
}

