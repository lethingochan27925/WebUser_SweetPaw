import { getOrderDetail  } from "/services/orderApi.js";
import { getMyRatings, createRating, updateRating, deleteRating } from "/services/ratingsApi.js";

let orderItems = [];
let orderInfo = null;

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
  orderInfo = order;
  const reviewBtn = document.getElementById("openReview");

  if (order.display_status === "Đã giao thành công") {
    reviewBtn.style.display = "block"; 
  } else {
    reviewBtn.style.display = "none";
  }
  
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
  orderItems = order.items;

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

loadOrderDetail();

const openBtn = document.getElementById('openReview');
const modal = document.getElementById('reviewModal');
const overlay = document.getElementById('reviewOverlay');
const cancelBtn = document.querySelector('.btn-cancel');

openBtn.addEventListener('click', async () => {
  if (orderInfo) {
    document.getElementById("review-order").innerText = orderInfo.order_code;
    document.getElementById("time-order").innerText = new Date(orderInfo.created_at).toLocaleString("vi-VN");
  }
  // renderReviewItems(orderItems);
  const res = await getMyRatings();
  const myRatings = res.data || [];

  renderReviewItems(orderItems, myRatings);
  modal.style.display = 'block';
  overlay.style.display = 'block';
});

cancelBtn.addEventListener('click', closeReview);
overlay.addEventListener('click', closeReview);

function closeReview() {
  modal.style.display = 'none';
  overlay.style.display = 'none';
}



// function renderReviewItems(items, ratings) {
//   const container = document.getElementById("reviewItems");
//   container.innerHTML = "";

//   items.forEach(item => {
//     const existedRating = ratings.find(r =>
//       r.productId === item.productId &&
//       r.orderId === orderInfo.orderId
//     );

//     const ratingValue = existedRating?.stars || 0;
//     const commentValue = existedRating?.comment || "";

//     container.insertAdjacentHTML("beforeend", `
//       <div class="item-review"
//            data-product-id="${item.productId}"
//            data-rating-id="${existedRating?.ratingId || ""}">

//         <p><b>${item.name}</b></p>

//         <div class="stars" data-rating="${ratingValue}">
//           ${[1,2,3,4,5].map(v => `
//             <span data-value="${v}">
//               <i class="fas fa-star ${v <= ratingValue ? 'star-active' : ''}"></i>
//             </span>
//           `).join("")}
//         </div>

//         <textarea placeholder="Nhập nội dung đánh giá...">${commentValue}</textarea>
//         <div class="review-action">
//           <button class="btn-cancel">Hủy</button>
//           <button class="btn-submit">Gửi</button>
//         </div>
//       </div>
//     `);
//   });

//   initStarRating();
// }

function renderReviewItems(items, ratings) {
  const container = document.getElementById("reviewItems");
  container.innerHTML = "";

  items.forEach(item => {
    const existedRating = ratings.find(r =>
      r.productId === item.productId &&
      r.orderId === orderInfo.orderId
    );

    const hasRating = !!existedRating;
    const ratingValue = existedRating?.stars || 0;
    const commentValue = existedRating?.comment || "";

    container.insertAdjacentHTML("beforeend", `
      <div class="item-review"
           data-product-id="${item.productId}"
           data-rating-id="${existedRating?.ratingId || ""}">

        <p><b>${item.name}</b></p>

        <div class="stars ${hasRating ? "readonly" : ""}" data-rating="${ratingValue}">
          ${[1,2,3,4,5].map(v => `
            <span data-value="${v}">
              <i class="fas fa-star ${v <= ratingValue ? "star-active" : ""}"></i>
            </span>
          `).join("")}
        </div>

        <textarea
          ${hasRating ? "readonly" : ""}
          placeholder="Nhập nội dung đánh giá...">${commentValue}</textarea>

        <div class="review-action">
          ${
            hasRating
              ? `
                <button class="btn-update">Cập nhật</button>
                <button class="btn-delete">Xóa</button>
                <button class="btn-save" style="display:none">Lưu</button>
                <button class="btn-cancel-edit" style="display:none">Hủy</button>
              `
              : `
                <button class="btn-cancel-create">Hủy</button>
                <button class="btn-submit">Gửi</button>
                
              `
          }
        </div>
      </div>
    `);
  });

  initStarRating();
  bindReviewActions();
}


// function initStarRating() {
//   document.querySelectorAll(".item-review").forEach(reviewEl => {
//     const stars = reviewEl.querySelectorAll(".stars span");
//     let rating = 0;

//     stars.forEach(span => {
//       span.addEventListener("click", () => {
//         rating = Number(span.dataset.value);
//         reviewEl.querySelector(".stars").dataset.rating = rating;
//         updateStars(stars, rating);
//       });

//       span.addEventListener("mouseenter", () => {
//         updateStars(stars, span.dataset.value);
//       });

//       span.addEventListener("mouseleave", () => {
//         updateStars(stars, rating);
//       });
//     });
//   });
// }

function initStarRating() {
  document.querySelectorAll(".item-review").forEach(reviewEl => {
    const starsWrapper = reviewEl.querySelector(".stars");
    if (starsWrapper.classList.contains("readonly")) return;

    const stars = starsWrapper.querySelectorAll("span");
    let rating = Number(starsWrapper.dataset.rating) || 0;

    stars.forEach(span => {
      span.addEventListener("click", () => {
        rating = Number(span.dataset.value);
        starsWrapper.dataset.rating = rating;
        updateStars(stars, rating);
      });

      span.addEventListener("mouseenter", () => {
        updateStars(stars, span.dataset.value);
      });

      span.addEventListener("mouseleave", () => {
        updateStars(stars, rating);
      });
    });
  });
}



function updateStars(stars, value) {
  stars.forEach(span => {
    span.querySelector("i").classList.toggle(
      "star-active",
      span.dataset.value <= value
    );
  });
}

// document.querySelector(".btn-submit").addEventListener("click", () => {
//   const reviews = [];

//   document.querySelectorAll(".item-review").forEach(el => {
//     reviews.push({
//       productId: el.dataset.productId,
//       rating: Number(el.querySelector(".stars").dataset.rating),
//       comment: el.querySelector("textarea").value.trim()
//     });
//   });

//   console.log("Review data:", reviews);
//   //  gọi API submit review ở đây
// });


function bindReviewActions() {
  document.querySelectorAll(".item-review").forEach(el => {
    const textarea = el.querySelector("textarea");
    const stars = el.querySelector(".stars");

    const btnSubmit = el.querySelector(".btn-submit");
    const btnCancelCreate = el.querySelector(".btn-cancel-create");

    const btnUpdate = el.querySelector(".btn-update");
    const btnDelete = el.querySelector(".btn-delete");
    const btnSave = el.querySelector(".btn-save");
    const btnCancelEdit = el.querySelector(".btn-cancel-edit");

    // GỬI
    btnSubmit?.addEventListener("click", async () => {
      const payload = {
        productId: el.dataset.productId,
        orderId: orderInfo.orderId,
        stars: Number(stars.dataset.rating),
        comment: textarea.value.trim()
      };
      console.log("CREATE RATING:", payload);
      if (!payload.stars || !payload.comment) {
        alert("Vui lòng chọn sao và nhập nội dung đánh giá");
        return;
      }

      try {
        const res = await createRating(payload);
        alert(res.message || "Đánh giá thành công");

      
        const newRatings = await getMyRatings();
        renderReviewItems(orderItems, newRatings.data || []);

      } catch (err) {
        console.error(err);
        alert(err.message || "Lỗi khi gửi đánh giá");
      }
    });

    btnCancelCreate?.addEventListener("click", () => {
      textarea.value = "";
      stars.dataset.rating = 0;
      updateStars(stars.querySelectorAll("span"), 0);
    });

    // CẬP NHẬT 
    btnUpdate?.addEventListener("click", () => {
      textarea.removeAttribute("readonly");
      stars.classList.remove("readonly");

      btnUpdate.style.display = "none";
      btnDelete.style.display = "none";
      btnSave.style.display = "inline-block";
      btnCancelEdit.style.display = "inline-block";

      initStarRating();
    });

    btnCancelEdit?.addEventListener("click", () => {
      textarea.setAttribute("readonly", true);
      stars.classList.add("readonly");

      btnUpdate.style.display = "inline-block";
      btnDelete.style.display = "inline-block";
      btnSave.style.display = "none";
      btnCancelEdit.style.display = "none";
    });

    btnSave?.addEventListener("click", async () => {
      const payload = {
        ratingId: el.dataset.ratingId,
        stars: Number(stars.dataset.rating),
        comment: textarea.value.trim()
      };

      if (!payload.stars || !payload.comment) {
        alert("Vui lòng chọn sao và nhập nội dung đánh giá");
        return;
      }

      try {
        const res = await updateRating(payload);
        alert(res.message || "Cập nhật đánh giá thành công");

        // reload lại ratings
        const newRatings = await getMyRatings();
        renderReviewItems(orderItems, newRatings.data || []);

      } catch (err) {
        console.error(err);
        alert(err.message || "Lỗi khi cập nhật đánh giá");
      }
    });

    // XÓA 
    btnDelete?.addEventListener("click", async () => {
      if (!confirm("Bạn chắc chắn muốn xóa đánh giá?")) return;

      try {
        const res = await deleteRating({
          ratingId: el.dataset.ratingId
        });

        alert(res.message || "Xóa đánh giá thành công");

        const newRatings = await getMyRatings();
        renderReviewItems(orderItems, newRatings.data || []);
      } catch (err) {
        console.error(err);
        alert(err.message || "Lỗi khi xóa đánh giá");
      }
    });

  });
}
