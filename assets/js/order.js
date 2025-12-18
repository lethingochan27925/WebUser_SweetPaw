import { getMyOrders  } from "/services/orderApi.js";

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
initOrdersPage();
