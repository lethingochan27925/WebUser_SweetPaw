document.addEventListener("DOMContentLoaded", () => {
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
});

// window.addEventListener("beforeunload", () => {
//     localStorage.removeItem("checkout_items");
// });
document.querySelector(".btnDatHang").addEventListener("click", () => {
    // Gọi API tạo đơn hàng ở đây

    localStorage.removeItem("checkout_items");
});

