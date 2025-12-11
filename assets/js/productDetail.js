import { getProductById } from "/services/productApi.js";
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

  // Đổ dữ liệu vào HTML
  document.querySelector(".product__name h1").innerText = p.name;
  document.querySelector(".status-product b").innerText = p.stock > 0 ? "Còn hàng" : "Hết hàng";
  document.querySelector(".infor-oder b").innerText = p.category || "Không có";
  document.querySelector(".product__price h2").innerText = `${p.price.toLocaleString()} đ`;

  // Ảnh chính
  document.getElementById("img-main").src = p.url;

  // Ảnh nhỏ – nếu bạn chỉ có 1 ảnh thì dùng ảnh chính
  document.querySelectorAll(".small-img").forEach(img => {
    img.src = p.url;
  });

  // Mô tả
  document.querySelector(".product__describe").innerText = p.des;
}

loadProductDetail();