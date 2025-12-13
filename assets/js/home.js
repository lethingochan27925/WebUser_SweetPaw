import { getRecommendProducts, getNewProducts, getTopProducts, getPopularProducts, getProductById } from "/services/productApi.js";
import { addToCart } from "/services/cartApi.js";

async function loadRecommendProducts() {
  const container = document.getElementById("recommend-products");

  try {
    const res = await getRecommendProducts();

    if (!res.success) {
      console.warn("API trả về success = false");
      return;
    }

    const products = res.products;

    container.innerHTML = ""; // Clear cũ

    products.forEach(p => {
      const html = `
      <div class="col-lg-3 col-md-6 col-sm-12 mb-20">
        <a href="./ProductDetail.html?id=${p._id}" class="product__new-item">
          <div class="card" style="width: 100%">
            <div>
              <img class="card-img-top" src="${p.url}" alt="${p.name}">
              <form class="hover-icon hidden-sm hidden-xs">
                <a href="./ProductDetail.html?id=${p._id}" class="btn-add-to-cart" title="Mua ngay">
                  <i class="fas fa-cart-plus"></i>
                </a>

                <a data-toggle="modal" data-target="#myModal" class="quickview" data-id="${p._id}" title="Xem nhanh">
                  <i class="fas fa-search"></i>
                </a>
              </form>
            </div>

            <div class="card-body">
              <h5 class="card-title description">${p.name}</h5>

              <div class="product__price">
                <p class="card-text price-color product__price-new">
                  ${p.price.toLocaleString()} đ
                </p>
              </div>

              <div class="home-product-item__action">
                <span class="home-product-item__like home-product-item__like--liked">
                  <i class="home-product-item__like-icon-empty far fa-heart"></i>
                  <i class="home-product-item__like-icon-fill fas fa-heart"></i>
                </span>

                <div class="home-product-item__rating">
                  ${renderStars(p.rating_avg)}
                </div>

                <span class="home-product-item__sold">
                  ${p.sold_count} đã bán
                </span>
              </div>

            </div>
          </div>
        </a>
      </div>
      `;

      container.innerHTML += html;
    });

  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
  }
}


async function loadNewProducts() {
  const container = document.getElementById("new-products");

  try {
    const res = await getNewProducts();

    if (!res.success) {
      console.warn("API trả về success = false");
      return;
    }

    const products = res.products;

    container.innerHTML = ""; // Clear cũ

    products.forEach(p => {
      const html = `
      <div class="col-lg-3 col-md-6 col-sm-12 mb-20">
        <a href="./ProductDetail.html?id=${p._id}" class="product__new-item">
          <div class="card" style="width: 100%">
            <div>
              <img class="card-img-top" src="${p.url}" alt="${p.name}">
              <form class="hover-icon hidden-sm hidden-xs">
                <a href="./ProductDetail.html?id=${p._id}" class="btn-add-to-cart" title="Mua ngay">
                  <i class="fas fa-cart-plus"></i>
                </a>

                <a data-toggle="modal" data-target="#myModal" class="quickview" data-id="${p._id}" title="Xem nhanh">
                  <i class="fas fa-search"></i>
                </a>
              </form>
            </div>

            <div class="card-body">
              <h5 class="card-title description">${p.name}</h5>

              <div class="product__price">
                <p class="card-text price-color product__price-new">
                  ${p.price.toLocaleString()} đ
                </p>
              </div>

              <div class="home-product-item__action">
                <span class="home-product-item__like home-product-item__like--liked">
                  <i class="home-product-item__like-icon-empty far fa-heart"></i>
                  <i class="home-product-item__like-icon-fill fas fa-heart"></i>
                </span>

                <div class="home-product-item__rating">
                  ${renderStars(p.rating_avg)}
                </div>

                <span class="home-product-item__sold">
                  ${p.sold_count} đã bán
                </span>
              </div>

            </div>
          </div>
        </a>
      </div>
      `;

      container.innerHTML += html;
    });

  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
  }
}

async function loadTopProducts() {
  const container = document.getElementById("top-products");

  try {
    const res = await getTopProducts();

    if (!res.success) {
      console.warn("API trả về success = false");
      return;
    }

    const products = res.products;

    container.innerHTML = ""; // Clear cũ

    products.forEach(p => {
      const html = `
      <div class="col-lg-3 col-md-6 col-sm-12 mb-20">
        <a href="./ProductDetail.html?id=${p._id}" class="product__new-item">
          <div class="card" style="width: 100%">
            <div>
              <img class="card-img-top" src="${p.url}" alt="${p.name}">
              <form class="hover-icon hidden-sm hidden-xs">
                <a href="./ProductDetail.html?id=${p._id}" class="btn-add-to-cart" title="Mua ngay">
                  <i class="fas fa-cart-plus"></i>
                </a>

                <a data-toggle="modal" data-target="#myModal" class="quickview" data-id="${p._id}"  title="Xem nhanh">
                  <i class="fas fa-search"></i>
                </a>
              </form>
            </div>

            <div class="card-body">
              <h5 class="card-title description">${p.name}</h5>

              <div class="product__price">
                <p class="card-text price-color product__price-new">
                  ${p.price.toLocaleString()} đ
                </p>
              </div>

              <div class="home-product-item__action">
                <span class="home-product-item__like home-product-item__like--liked">
                  <i class="home-product-item__like-icon-empty far fa-heart"></i>
                  <i class="home-product-item__like-icon-fill fas fa-heart"></i>
                </span>

                <div class="home-product-item__rating">
                  ${renderStars(p.rating_avg)}
                </div>

                <span class="home-product-item__sold">
                  ${p.sold_count} đã bán
                </span>
              </div>

            </div>
          </div>
        </a>
      </div>
      `;

      container.innerHTML += html;
    });

  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
  }
}

async function loadPopularProducts() {
  const container = document.getElementById("popular-products");

  try {
    const res = await getPopularProducts();

    if (!res.success) {
      console.warn("API trả về success = false");
      return;
    }

    const products = res.products;

    container.innerHTML = ""; // Clear cũ

    products.forEach(p => {
      const html = `
        <div class="col-lg-4 col-sm-12">
            <div class="card" style="width: 100%;">
                <img class="card-img-top" src="${p.url}" alt="Card image" style="width:100%">
                <div class="card-body">
                  <h4 class="card-title" >${p.name}</h4>
                  <p class="card-text description" style="font-weight: 400;"> ${p.des}</p>
                  <a href="./ProductDetail.html?id=${p._id}" title="${p.name}" class="btn btn-buynow">Xem ngay <i class="fas fa-arrow-right"
                      style="font-size: 16px;margin-left: 5px;"></i></a>
                </div>
            </div>
        </div>
      `;

      container.innerHTML += html;
    });

  } catch (err) {
    console.error("Lỗi load sản phẩm:", err);
  }
}

function renderStars(rate) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= rate
      ? '<i class="home-product-item__star--gold fas fa-star"></i>'
      : '<i class="fas fa-star"></i>';
  }
  return html;
}


// Auto load khi mở trang
loadRecommendProducts();
loadNewProducts();
loadTopProducts();
loadPopularProducts();

document.addEventListener("click", async (e) => {
  if (e.target.closest(".quickview")) {
    const id = e.target.closest(".quickview").dataset.id;
    loadQuickView(id);
  }
});

async function loadQuickView(id) {
  try {
    const res = await getProductById(id);

    if (res.data == null) return;

    const p = res.data;

    // Gán dữ liệu vào modal
    document.querySelector("#myModal .modal-title").innerText = p.name;
    document.getElementById("img-main").src = p.url;
    document.getElementById("pro-name").src = p.name;
    
    document.querySelector(".price-product .special-price span").innerText = 
        `${p.price.toLocaleString()} đ`;
    document.querySelector(".product-description").innerText = p.des;
    document.querySelector(".status-product span").innerText = 
        p.stock > 0 ? "Còn hàng" : "Hết hàng";
    document.querySelector(".infor-oder span").innerText = p.category || "Không có";

    document.getElementById("btnAddToCart").dataset.productId = p._id;

  } catch (e) {
    console.error("Lỗi load QuickView:", e);
  }
}
//---

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnIncrease")
    .addEventListener("click", increaseQty);

  document.getElementById("btnDecrease")
    .addEventListener("click", decreaseQty);

  document.getElementById("btnAddToCart")
    .addEventListener("click", handleAddToCart);
});

function increaseQty() {
  const input = document.getElementById("text_so_luong");
  let value = parseInt(input.value) || 1;
  input.value = value + 1;
}

function decreaseQty() {
  const input = document.getElementById("text_so_luong");
  let value = parseInt(input.value) || 1;
  if (value > 1) {
    input.value = value - 1;
  }
}



async function handleAddToCart() {
  const productId = btnAddToCart.dataset.productId;
  console.log("productId", productId)
  const quantity = parseInt(document.getElementById("text_so_luong").value);
  
  try {
    const res = await addToCart(productId, quantity);
    alert("Đã thêm vào giỏ hàng");

  } catch (err) {
    console.error(err);
    alert(err.message || "Thêm giỏ hàng thất bại");
  }
}