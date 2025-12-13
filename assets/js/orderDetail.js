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
  document.querySelector(".unpaid").innerText = order.payment_status;
  document.getElementById("note").innerText = order.note;
  document.getElementById("price-product").innerText = `${order.subtotal.toLocaleString()}đ`;
  document.getElementById("shipping-fee").innerText = `${order.shipping_fee.toLocaleString()} đ`;
//   document.getElementById("discount").innerText = `${order.discount.toLocaleString()} đ`|| "0";
  document.getElementById("payment").innerText = `${order.total_price.toLocaleString()} đ`;


  
}
loadOrderDetail()