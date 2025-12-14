import { getOrderDetail  } from "/services/orderApi.js";

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadOrderDetail() {
  const id = getIdFromUrl();

  if (!id) {
    console.error("Không tìm thấy ID trong URL!");
    return;
  }

  const res = await getOrderDetail(id);

  if (!res || !res.data) {
    console.error("Không tìm thấy sản phẩm");
    return;
  }

  const order = res.data;
  
  document.getElementById("status").innerText = order.display_status;
  document.getElementById("order_id").innerText = order.order_code;
  document.getElementById("createAt").innerText = new Date(order.created_at).toLocaleString("vi-VN");
  document.getElementById("name").innerText = order.to_name;
  document.getElementById("sdt").innerText = order.to_phone;
  document.getElementById("diachi").innerText = order.to_address; 
  document.getElementById("payment_method").innerText = order.payment_method;
  document.querySelector(".unpaid").innerText =
  order.payment_status === "SUCCESS"
    ? "Thanh toán thành công"
    : "Chưa thanh toán";

  document.getElementById("note").innerText = order.note;
  document.getElementById("price-product").innerText = `${order.subtotal.toLocaleString()}đ`;
  document.getElementById("shipping-fee").innerText = `${order.shipping_fee.toLocaleString()} đ`;
  document.getElementById("discount").innerText = `${order.discountAmount.toLocaleString()} đ`|| "0";
  document.getElementById("payment").innerText = `${order.total_price.toLocaleString()} đ`;
  
  const items = order.items;
  const itemsContainer = document.querySelector(".item");
  itemsContainer.innerHTML = ""; 

  items.forEach(item => {
    const itemHTML = `
        <div class="product">
          <img class="image" src="${item.image}" alt="${item.name}">
          <div>
            <a href="./ProductDetail.html?id=${item.productId}"><p><b>${item.name}</b></p></a>
            <p>Số lượng: ${item.quantity}</p>
            <p>Giá: ${item.price.toLocaleString()}đ</p>
          </div>
        </div>
     
    `;
    itemsContainer.insertAdjacentHTML("beforeend", itemHTML);
  });




  const stepShipping  = document.querySelector(".timeline .shipping");
  const stepSuccess  = document.querySelector(".timeline .success");
  switch (order.display_status) {
  case "Đang giao hàng":
    stepShipping.classList.add("active");
    break;

  case "Đã giao thành công":
    stepShipping.classList.add("active");
    stepSuccess.classList.add("active");
    break;
}


  
}
loadOrderDetail()