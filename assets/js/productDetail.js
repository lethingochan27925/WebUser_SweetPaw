import { getProductById } from "/services/productApi.js";
import { addToCart } from "/services/cartApi.js";

let currentProduct = null;


function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProductDetail() {
  const id = getIdFromUrl();

  if (!id) {
    console.error("Không tìm thấy ID trong URL!");
    return;
  }

  const res = await getProductById(id);

  if (!res || !res.data) {
    console.error("Không tìm thấy sản phẩm");
    return;
  }

  const p = res.data;
  currentProduct = p; 

  // Đổ dữ liệu vào HTML
  document.querySelector(".product__name h1").innerText = p.name;
  // document.querySelector(".status-product b").innerText = p.stock > 0 ? "Còn hàng" : "Hết hàng";
  document.querySelector(".infor-oder b").innerText = p.category || "Không có";
  document.querySelector(".product__price h2").innerText = `${p.price.toLocaleString()} đ`;

  const statusEl = document.querySelector(".status-product b");
  const btnAddToCart = document.getElementById("btnAddToCart");
  const btnBuyNow = document.getElementById("btnBuyNow");
  const qtyInput = document.getElementById("text_so_luong");

  if (p.stock > 0) {
    statusEl.innerText = "Còn hàng";
    statusEl.style.color = "green";

    btnAddToCart.disabled = false;
    btnBuyNow.disabled = false;
    qtyInput.disabled = false;
  } else {
    statusEl.innerText = "Hết hàng";
    statusEl.style.color = "red";

    btnAddToCart.disabled = true;
    btnBuyNow.disabled = true;
    qtyInput.disabled = true;
  }

  // Ảnh chính
  document.getElementById("img-main").src = p.url;

  // Mô tả
  document.querySelector(".product__describe").innerText = p.des;

  
}

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
  const productId = getIdFromUrl();
  const quantity = parseInt(document.getElementById("text_so_luong").value);
  
  try {
    const res = await addToCart(productId, quantity);

    showAddToCartModal(currentProduct, quantity);

  } catch (err) {
    console.error(err);
    alert(err.message || "Thêm giỏ hàng thất bại");
  }
}
 
function showAddToCartModal(product, quantity) {
  if (!product) return;

  document.querySelector(".alert__body-img").src = product.url;
  document.querySelector(".alert__body-name").innerText = product.name;
  document.querySelector(".alert__body-amount").innerText =
    `Số lượng: ${quantity}`;
  document.querySelector(".alert__body-price").innerText =
    (product.price * quantity).toLocaleString() + " ₫";

  $('.alert').fadeIn();
  $('.overlay1').fadeIn();
}

loadProductDetail();

document.getElementById("btnBuyNow").addEventListener("click", handleBuyNow);

function handleBuyNow() {
  if (!currentProduct) {
    alert("Sản phẩm chưa sẵn sàng");
    return;
  }

  const quantity = parseInt(document.getElementById("text_so_luong").value) || 1;

  const checkoutItem = {
    productId: currentProduct._id || currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    quantity: quantity,
    image: currentProduct.url,
    des: currentProduct.des,
    total: currentProduct.price * quantity
  };

  // Ghi đè, vì MUA NGAY chỉ mua 1 sản phẩm
  localStorage.setItem(
    "checkout_items",
    JSON.stringify([checkoutItem])
  );
  // Chuyển sang trang đặt hàng
  window.location.href = "/ordering.html";
}

