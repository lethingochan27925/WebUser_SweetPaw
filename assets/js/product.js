import { getAllProducts, getProductById, getProductsByCategory, filterProducts, searchProducts   } from "/services/productApi.js";
import { addToCart } from "/services/cartApi.js";


$(document).ready(function() {
    $('#filter').click(function(e){
        $('.filter-mobile').toggleClass('xyz');
        $('.overlay2').toggleClass('hidden');
    })
    $('.overlay2').click(function(e){
        $('.filter-mobile').toggleClass('xyz');
        $('.overlay2').toggleClass('hidden');
    })
})

function khonghienthidanhsach(id,cc){ 
    $(`#${cc}`).toggle("slow");
    $(`#plus-${id}`).toggleClass("hidden") 
    $(`#minus-${id}`).toggleClass("hidden");    
}
//------------------
let allProducts = [];
let currentIndex = 0;
const LIMIT = 9;

const productContainer = document.querySelector("#products");
const btnLoadMore = document.querySelector(".loadmore-btn");
// RENDER 1 SẢN PHẨM
function createProductHTML(p) {
  return `
    <div class="col-lg-4 col-md-6 col-12 mb-20" style="margin-bottom: 20px">
        <a href="./ProductDetail.html?id=${p._id}" class="product__new-item">
        <div class="card" style="width: 100%">
            <div>
            <img class="card-img-top" src="${p.url}" alt="${p.name}">
            <form action="" class="hover-icon hidden-sm hidden-xs hidden-sm hidden-xs">
                <input type="hidden">
                <a href="./ProductDetail.html?id=${p._id}" class="btn-add-to-cart" title="Mua ngay">
                <i class="fas fa-cart-plus"></i>
                </a>
                <a data-toggle="modal" data-target="#myModal" class="quickview" data-id="${p._id}" title="Xem nhanh">
                <i class="fas fa-search"></i>
                </a>
            </form>
            </div>
            <div class="card-body">
            <h5 class="card-title custom__name-product">
                ${p.name}
            </h5>
            <div class="product__price">
                <p class="card-text price-color product__price-new"> ${p.price.toLocaleString()} đ</p>
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


// LOAD THÊM + RENDER
function renderProducts() {
  const items = allProducts.slice(currentIndex, currentIndex + LIMIT);

  if (items.length === 0) {
    btnLoadMore.style.display = "none";
    return;
  }

  productContainer.innerHTML += items.map(createProductHTML).join("");
  currentIndex += LIMIT;

  if (currentIndex >= allProducts.length) {
    btnLoadMore.style.display = "none";
  }
}

// FETCH API + LOAD LẦN ĐẦU

async function initProductPage() {
  try {
    // Lấy category từ URL
    const url = new URL(window.location.href);
    const category = url.searchParams.get("category");

    let res;

    if (category) {
      // Đổi tiêu đề
      document.querySelector(".coll-name").innerText = category;

      // Gọi đúng API
      res = await getProductsByCategory(category);
    } else {
      // Không có category → lấy tất cả
      document.querySelector(".coll-name").innerText = "Tất cả sản phẩm";
      res = await getAllProducts();
    }

    allProducts = res.data || [];
    currentIndex = 0;
    console.log("Danh sách sản phẩm:", allProducts);
    productContainer.innerHTML = "";

    renderProducts();
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
  }
}

// EVENT LOAD MORE

btnLoadMore.addEventListener("click", () => {
  renderProducts();
});


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

//  CHẠY KHI LOAD TRANG
initProductPage();

//-----------

function getSelectedPriceRange() {
  const checked = document.querySelector(".checkGia:checked");
  if (!checked) return [];
  return [checked.value]; // API cần mảng
}

function getSelectedRating() {
  const ratings = [...document.querySelectorAll(".checksize:checked")]
    .map(el => Number(el.value));

  if (ratings.length === 0) return null;

  return Math.max(...ratings); // ví dụ tick 3 & 4 → lấy 4
}


function getKeyword() {
  const input = document.querySelector(".input-search"); 
  return input ? input.value.trim() : "";
}

async function applyFilter() {
  const body = {
    keyword: getKeyword(),
    priceRange: getSelectedPriceRange(),
    rating: getSelectedRating()
  };

  // Xóa field rỗng
  if (!body.keyword) delete body.keyword;
  if (!body.priceRange.length) delete body.priceRange;
  if (!body.rating) delete body.rating;

  try {
    const res = await filterProducts(body);

    allProducts = res.data || [];
    currentIndex = 0;
    productContainer.innerHTML = "";

    renderProducts();
  } catch (err) {
    console.error(err);
    alert("Lọc sản phẩm thất bại");
  }
}

document.querySelectorAll(".checkGia, .checksize")
  .forEach(el => el.addEventListener("change", applyFilter));
    

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


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".example");
  const inputSearch = document.querySelector(".input-search");

  if (!form || !inputSearch) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const keyword = inputSearch.value.trim();
    if (!keyword) return;

    try {
      const res = await searchProducts(keyword);

      allProducts = res.data || [];
      currentIndex = 0;
      productContainer.innerHTML = "";
      renderProducts();
    } catch (err) {
      console.error(err);
      alert("Không tìm thấy sản phẩm");
    }
  });
});

