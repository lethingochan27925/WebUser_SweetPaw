import { getMyOrders  } from "/services/orderApi.js";
import {getUserLikes } from "/services/listlikeApi.js"; 
import { getCart  } from "/services/cartApi.js";

const user = JSON.parse(localStorage.getItem("userData"));
const fullname = user.fullName;
document.querySelector('.nav-item__first-name').innerText = fullname;
document.querySelector('._body').innerText = fullname || 'Người dùng';

let allOrders = [];
let currentIndex = 0;
const LIMIT = 8;

const orderContainer = document.querySelector("#news");
const btnLoadMore = document.querySelector(".loadmore-btn");

function createOrderHTML(o) {
  const img = o.thumbnail_url || "./assets/img/noimage.png";

  return `
    <div class="col-lg-3 col-md-6 col-sm-12 mb-20 order-card">
      <a href="./order-detail.html?id=${o._id}" class="product__new-item">
        <div class="card" style="width: 100%">
          <img class="card-img-top" src="${img}" alt="">
          <div class="card-body">
            <h5 class="card-title custom__name-product">
              Mã đơn hàng: <span class = "order_code">${o.ghn_order_code}</span>
            </h5>
            <p class="card-text">
              Ngày đặt: <span class = "createdAt">${new Date(o.createdAt).toLocaleString("vi-VN")}</span>
            </p>
            <p class="card-text">
              Trạng thái: 
              <span style="color: #35C118">${o.status}</span>
            </p>
            <p class="card-text">
              Tổng tiền: <span class = "total_price">${o.total_price.toLocaleString()} ₫</span> 
            </p>
          </div>
        </div>
      </a>
    </div>
  `;
}

function renderOrders() {
  const items = allOrders.slice(currentIndex, currentIndex + LIMIT);

  if (items.length === 0) {
    btnLoadMore.style.display = "none";
    return;
  }

  orderContainer.innerHTML += items.map(createOrderHTML).join("");
  currentIndex += LIMIT;

  if (currentIndex >= allOrders.length) {
    btnLoadMore.style.display = "none";
  }
}

async function initOrdersPage() {
  try {
    const res = await getMyOrders();
    allOrders = res.data || [];

    currentIndex = 0;
    orderContainer.innerHTML = "";

    renderOrders();
  } catch (err) {
    console.error("Lỗi load đơn hàng:", err);
  }
}

btnLoadMore.addEventListener("click", renderOrders);

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
initOrdersPage();
