import { getUserLikes, toggleUserLike } from "/services/listlikeApi.js";

const productListContainer = document.querySelector('.listlike .container .row');

// Hàm để định dạng số tiền VND
function formatCurrency(amount) {
    if (!amount) return '0 đ';
    // Sử dụng toLocaleString để định dạng tiền tệ tốt hơn
    return (amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Hàm giả lập rating
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="home-product-item__star--gold fas fa-star"></i>';
        } else {
            stars += '<i class="fas fa-star"></i>';
        }
    }
    return stars;
}

// Hàm render một sản phẩm yêu thích
function renderProduct(product) {
    const productId = product._id; 
    const isLiked = true; 

    // Tạo HTML cho mỗi sản phẩm
    const productHtml = `
        <div class="col-lg-3 col-md-6 col-sm-12 mb-20 product-item" data-product-id="${productId}">
            <a href="./ProductDetail.html?id=${productId}" class="product__new-item">
                <div class="card" style="width: 100%">
                    <div>
                        <img class="card-img-top" src="${product.url || './assets/img/product/default.jpg'}" alt="${product.name}">
                        <form action="" class="hover-icon hidden-sm hidden-xs">
                            <input type="hidden">
                            <a href="./pay.html" class="btn-add-to-cart" title="Mua ngay">
                                <i class="fas fa-cart-plus"></i>
                            </a>
                            <a data-toggle="modal" data-target="#myModal" class="quickview" title="Xem nhanh">
                                <i class="fas fa-search"></i>
                            </a>
                        </form>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title custom__name-product">
                            ${product.name}
                        </h5>
                        <div class="product__price">
                            <p class="card-text price-color product__price-new">${formatCurrency(product.price)}</p>
                        </div>
                        <div class="home-product-item__action">
                            <span class="home-product-item__like home-product-item__like--liked like-toggle-btn" 
                                  data-product-id="${productId}" style="cursor: pointer;">
                                <i class="home-product-item__like-icon-empty far fa-heart"></i>
                                <i class="home-product-item__like-icon-fill fas fa-heart"></i>
                            </span>
                            <div class="home-product-item__rating">
                                ${generateRatingStars(product.rating)}
                            </div>
                            <span class="home-product-item__sold">${product.sold || 0} đã bán</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
    productListContainer.insertAdjacentHTML('beforeend', productHtml);
}


// BỎ YÊU THÍCH 
async function handleLikeToggle(event) {
    // Ngăn hành vi mặc định và ngăn sự kiện lan truyền
    event.preventDefault(); 
    event.stopPropagation();
    
    // Tìm phần tử .like-toggle-btn bao quanh
    const likeToggleBtn = event.currentTarget.closest('.like-toggle-btn');
    if (!likeToggleBtn) return;

    const productId = likeToggleBtn.getAttribute('data-product-id');
    if (!productId) {
        console.error("Không tìm thấy Product ID!");
        return;
    }

    // 1. Cập nhật UI tạm thời: Chuyển trái tim đầy thành trái tim rỗng
    likeToggleBtn.classList.remove('home-product-item__like--liked');
    
    try {
        // 2. Gọi API toggle (thao tác này sẽ BỎ YÊU THÍCH vì sản phẩm đã có trong danh sách)
        const response = await toggleUserLike(productId);

        if (response && response.status === 200) {
            // 3. Server xác nhận: Xóa sản phẩm khỏi DOM
            
            // Tìm phần tử sản phẩm cha gần nhất có class .product-item để xóa
            const productElement = likeToggleBtn.closest('.product-item');
            if (productElement) {
                productElement.remove();
                alert("Đã xóa sản phẩm khỏi danh sách yêu thích!");
                
                // Cập nhật lại số lượng yêu thích trên header
                updateLikeNotice(response.currentLikeCount);

                // Kiểm tra nếu danh sách trống thì hiển thị thông báo
                if (productListContainer.children.length === 0) {
                     productListContainer.innerHTML = '<div class="col-12 text-center mt-5"><h3>Danh sách yêu thích của bạn đang trống.</h3></div>';
                }
            }
        } else if (response && response.message === "Unauthorized") {
            // Chưa đăng nhập: Hoàn tác UI tạm thời
            likeToggleBtn.classList.add('home-product-item__like--liked');
            alert("Bạn cần đăng nhập để thực hiện thao tác này!");
            window.location.href = './Login.html';
        } else {
             // Lỗi khác: Hoàn tác UI tạm thời
            likeToggleBtn.classList.add('home-product-item__like--liked');
             alert(response.message || "Đã xảy ra lỗi khi cập nhật trạng thái yêu thích.");
        }
    } catch (error) {
        // Lỗi kết nối: Hoàn tác UI tạm thời
        likeToggleBtn.classList.add('home-product-item__like--liked');
        console.error("Lỗi khi gọi API toggleUserLike:", error);
        alert("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    }
}

// Hàm tải danh sách yêu thích và render ra giao diện
async function loadUserLikes() {
    productListContainer.innerHTML = 'Đang tải danh sách yêu thích...'; 

    try {
        const response = await getUserLikes();

        if (response && response.data && response.status === 200) {
            productListContainer.innerHTML = ''; 
            const likes = response.data;
            
            if (!likes || likes.length === 0) {
                productListContainer.innerHTML = '<div class="col-12 text-center mt-5"><h3>Danh sách yêu thích của bạn đang trống.</h3></div>';
            } else {
                likes.forEach(like => renderProduct(like));
            }

            document.querySelectorAll('.like-toggle-btn').forEach(button => {
                button.addEventListener('click', handleLikeToggle);
            });

            // Cập nhật số lượng yêu thích lên header
            updateLikeNotice(likes.length);

        } else if (response && response.message === "Unauthorized") {
            // Chưa đăng nhập
            alert("Bạn cần đăng nhập để xem danh sách yêu thích!");
            productListContainer.innerHTML = '<div class="col-12 text-center mt-5"><h3>Vui lòng đăng nhập để xem danh sách yêu thích.</h3></div>';
            setTimeout(() => window.location.href = './Login.html', 100); 
            return;
        } else {
            productListContainer.innerHTML = '<div class="col-12 text-center mt-5"><h3>Không thể tải danh sách yêu thích. Vui lòng thử lại.</h3></div>';
            console.error("Lỗi tải danh sách yêu thích:", response);
        }
    } catch (error) {
        productListContainer.innerHTML = '<div class="col-12 text-center mt-5"><h3>Lỗi kết nối máy chủ.</h3></div>';
        console.error("Lỗi mạng khi tải danh sách yêu thích:", error);
    }
}

// Cập nhật số lượng yêu thích trên header
function updateLikeNotice(count) {
    const noticeElements = document.querySelectorAll('#header__second__like--notice');
    noticeElements.forEach(el => {
        el.textContent = count > 0 ? count : '';
        el.style.display = count > 0 ? 'inline-block' : 'none'; 
    });
}

// Khởi chạy khi trang được tải
document.addEventListener('DOMContentLoaded', loadUserLikes);