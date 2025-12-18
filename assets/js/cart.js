import { getCart, updateCartQuantity, removeOneFromCart, getRecommendFromCart  } from "/services/cartApi.js";
import {getUserLikes } from "/services/listlikeApi.js"; 

const user = JSON.parse(localStorage.getItem("userData"));
const fullname = user.fullName;
document.querySelector('.nav-item__first-name').innerText = fullname || 'Người dùng';
document.querySelector('._body').innerText = fullname || 'Người dùng';


loadFavoritesOnce();

document.addEventListener("DOMContentLoaded", async () => {
    const cartBody = document.querySelector(".cart-body");

    try {
        const res = await getCart();
        const items = res.data.items || [];
        updateCartNotice(items.length); 

        cartBody.innerHTML = ""; // xoá mẫu cũ

        let totalPrice = 0;

        items.forEach((item, index) => {
            const thanhTien = item.price * item.quantity;
            totalPrice += thanhTien;

            const rowHTML = `
            <div class="row cart-body-row"  data-id="${item.productId}" data-price="${item.price}" style="align-items: center;">
                <div class="col-md-1 col-2 text-right">
                    <input type="checkbox" class="cart-item-check" data-id="${item._id}" data-des="${item.des}">
                </div>

                <div class="col-md-11 col-10" style="text-align: center;">
                    <div class="row card-info" style="align-items: center;">

                        <div class="card-info-img">
                            <a href="./ProductDetail.html?id=${item.productId}">
                                <img class="cart-img" src="${item.url}" alt="">
                            </a>
                        </div>

                        <div class="col-md-3">
                            <a href="./ProductDetail.html?id=${item.productId}" class="cart-name">
                                <h5>${item.name}</h5>
                            </a>
                          
                        </div>

                        <div class="col-md-2 col-12" style="font-size: 16px;">
                            <span>${item.price.toLocaleString()}₫</span>
                        </div>

                        <div class="col-md-3 col-12">
                            <div class="cart-quantity">
                                <input type="button" value="-" class="control" onclick="tru('${item.productId}')">
                                <input type="text" value="${item.quantity}" class="text-input" id="text_so_luong-${item.productId}">
                                <input type="button" value="+" class="control" onclick="cong('${item.productId}')">
                            </div>
                        </div>

                        <div class="col-md-2 col-12 hidden-xs" style="font-size: 16px;">
                            <span class="item-total">${thanhTien.toLocaleString()}₫</span>
                        </div>

                        <div class="col-md-1 text-right">
                            <a onclick="xoa('${item.productId}')">
                                <i class="fas fa-trash"></i>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
            `;

            cartBody.insertAdjacentHTML("beforeend", rowHTML);
        });

        // totalPriceElement.innerText = `${totalPrice.toLocaleString()}₫`;

    } catch (err) {
        console.error("Lỗi load giỏ hàng:", err);
    }
    cartBody.addEventListener("change", (e) => {
        if (e.target.classList.contains("cart-item-check")) {
            const row = e.target.closest(".cart-body-row");
            const id = row.dataset.id;
            updateRowTotal(id);
            toggleCartRight();
        }
    });
});



window.cong = async function (id) {
    
    try {
        await updateCartQuantity(id, 1);

        var value = document.getElementById(`text_so_luong-${id}`).value
        document.getElementById(`text_so_luong-${id}`).value = parseInt(value) + 1;
        
        updateRowTotal(id);
    } catch (err) {
        alert(err.message);
    }
}
window.tru = async function (id) {
    try{
        var value = document.getElementById(`text_so_luong-${id}`).value
        if(parseInt(value) > 1)
        {
            document.getElementById(`text_so_luong-${id}`).value = parseInt(value) - 1;
            await updateCartQuantity(id, -1);
        }
        updateRowTotal(id);
       
    } catch(err){
        alert(err.message);
    }
    
}

window.updateRowTotal = function (id) {
    const row = document.querySelector(`.cart-body-row[data-id="${id}"]`);
    if (!row) return;

    const price = parseInt(row.dataset.price);
    const qty = parseInt(document.getElementById(`text_so_luong-${id}`).value);

    const itemTotal = price * qty;

    row.querySelector(".item-total").innerText =
        itemTotal.toLocaleString() + "₫";

    updateCartTotal();
}


window.updateCartTotal = function () {
    let total = 0;

    document.querySelectorAll(".cart-body-row").forEach(row => {
        const checkbox = row.querySelector(".cart-item-check");
        if (!checkbox.checked) return;

        const price = parseInt(row.dataset.price);
        const qty = parseInt(row.querySelector(".text-input").value);
        total += price * qty;
    });

    document.querySelector(".total__price").innerText =
        total.toLocaleString() + "₫";
}

window.xoa = async function (id){
 
    try {
        await removeOneFromCart(id);

        document
        .querySelector(`.cart-body-row[data-id="${id}"]`)
        ?.remove();

        updateCartTotal();
         // CẬP NHẬT LẠI SỐ LƯỢNG GIỎ
        const remainingItems = document.querySelectorAll(".cart-body-row").length;
        updateCartNotice(remainingItems);
    } catch (err) {
        alert(err.message);
    }
}

//Hiển thị nút đặt hàng
function toggleCartRight() {
    const cartRight = document.querySelector(".cart-body-right");
    const anyChecked = document.querySelector(".cart-item-check:checked");

    cartRight.style.display = anyChecked ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const cartAllCheck = document.querySelector(".cart-all-check");
    const cartBody = document.querySelector(".cart-body");

    if (!cartAllCheck) return;

    // Khi click checkbox "chọn tất cả"
    cartAllCheck.addEventListener("change", () => {
        const isChecked = cartAllCheck.checked;

        document.querySelectorAll(".cart-item-check").forEach(cb => {
            cb.checked = isChecked;
        });

        updateCartTotal();
        toggleCartRight();
    });

    // Khi click từng checkbox sản phẩm → cập nhật trạng thái "chọn tất cả"
    cartBody.addEventListener("change", (e) => {
        if (!e.target.classList.contains("cart-item-check")) return;

        const allItems = document.querySelectorAll(".cart-item-check");
        const checkedItems = document.querySelectorAll(".cart-item-check:checked");

        cartAllCheck.checked =
            allItems.length > 0 && allItems.length === checkedItems.length;

        updateCartTotal();
        toggleCartRight();
    });
});


document.querySelector(".chekout").addEventListener("click", (e) => {
    e.preventDefault();

    const selectedItems = [];

    document.querySelectorAll(".cart-body-row").forEach(row => {
        const checkbox = row.querySelector(".cart-item-check");
        if (!checkbox.checked) return;

        const id = row.dataset.id;
        const price = parseInt(row.dataset.price);
        const qty = parseInt(row.querySelector(".text-input").value);
        const name = row.querySelector(".cart-name h5").innerText;
        const des = checkbox.dataset.des; 
        const img = row.querySelector(".cart-img").src;

        selectedItems.push({
            productId: id,
            name,
            des,
            price,
            quantity: qty,
            image: img,
            total: price * qty
        });
    });

    if (selectedItems.length === 0) {
        alert("Vui lòng chọn sản phẩm");
        return;
    }

    // GHI ĐÈ → không bị nhầm
    localStorage.setItem("checkout_items", JSON.stringify(selectedItems));

    window.location.href = "./ordering.html";
});

// Gợi ý
const btnOpen = document.getElementById('btnOpenRecommend');
const modal = document.getElementById('recommendModal');
const overlay = document.getElementById('recommendOverlay');
const closeBtn = document.querySelector('.close-recommend');

btnOpen.addEventListener('click', async  () => {
    modal.style.display = 'block';
    overlay.style.display = 'block';
    const cartProductIds = [];

    document.querySelectorAll(".cart-body-row").forEach(row => {
        const checkbox = row.querySelector(".cart-item-check");
        if (!checkbox.checked) return;

        cartProductIds.push(row.dataset.id);
    });


    if (cartProductIds.length === 0) {
        alert("Vui lòng chọn sản phẩm");
        closeRecommend();
        return;
    }

  
    try {
        const res = await getRecommendFromCart(cartProductIds);
        renderRecommendProducts(res.products);

    } catch (err) {
        console.error(err);
        alert("Không lấy được sản phẩm gợi ý");
    }

});

function closeRecommend() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

overlay.addEventListener('click', closeRecommend);
closeBtn.addEventListener('click', closeRecommend);


function renderRecommendProducts(products) {
    const container = document.querySelector(".recommend-body");
    container.innerHTML = "";

    if (!products || products.length === 0) {
        container.innerHTML = "<p>Không có sản phẩm gợi ý</p>";
        return;
    }

    products.forEach(p => {
        const html = `
            <div class="recommend-item">
                <img src="${p.url}" alt="${p.name}">
                <div class="info">
                    <a href="./ProductDetail.html?id=${p._id}" class="name">${p.name}</a>
                    <p class="des">${p.des}</p>
                    <p class="price">${p.price.toLocaleString()}</p>
                </div>
            </div> 
        `;
        container.insertAdjacentHTML("beforeend", html);
    });
}

// Hiển thị số lượng yêu thích
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


function updateCartNotice(count) {
    const noticeElements = document.querySelectorAll('#header__second__cart--notice');
    noticeElements.forEach(el => {
        el.textContent = count > 0 ? count : '';
        el.style.display = count > 0 ? 'inline-block' : 'none'; 
    });
}