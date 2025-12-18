import {getUserLikes } from "/services/listlikeApi.js"; 
import { getCart  } from "/services/cartApi.js";

const user = JSON.parse(localStorage.getItem("userData"));
const fullname = user.fullName;
document.querySelector('.nav-item__first-name').innerText = fullname;
document.querySelector('._body').innerText = fullname || 'Người dùng';


document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".mySwiper", {
    slidesPerView: 1,      // mỗi lần chỉ 1 slide
    loop: true,            // lặp lại quài luôn
    speed: 800,            // mượt khi lướt

    autoplay: {
      delay: 4000,         // 4 giây lướt 1 lần
      disableOnInteraction: false,
    },

  });
});

const targets = [
  { id: "ctdq", value: 50 },
  { id: "dncb", value: 30 },
  { id: "hvpp", value: 70 },
];

let started = false;

function animateCounters() {
  if (started) return;
  started = true;

  targets.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    let randomPhase = 0;
    const randomTimer = setInterval(() => {
      randomPhase++;
      el.textContent = Math.floor(Math.random() * value).toLocaleString(
        "de-DE"
      );
      if (randomPhase > 20) {
        clearInterval(randomTimer);
        countToFinal(el, value);
      }
    }, 50);
  });
}

function countToFinal(el, endValue) {
  let start = 0;
  const duration = 4000;
  const stepTime = 20;
  const increment = endValue / (duration / stepTime);

  const counter = setInterval(() => {
    start += increment;
    if (start >= endValue) {
      start = endValue;
      clearInterval(counter);
    }
    el.textContent = Math.floor(start).toLocaleString("de-DE");
  }, stepTime);
}

window.addEventListener("scroll", () => {
  const section = document.getElementById("statsSection");
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
    animateCounters();
  }
});

async function loadFavoritesOnce() {
  try {
    const res = await getUserLikes();
    if (res?.data) {
      const favoriteIds = res.data.map(item => item._id);
      updateLikeNotice(favoriteIds.length);

    }
  } catch (e) {
    console.error("Lỗi load favorite:", e);
  }
}

function updateLikeNotice(count) {
    const noticeElements = document.querySelectorAll('#header__second__like--notice');
    noticeElements.forEach(el => {
        el.textContent = count > 0 ? count : '';
        el.style.display = count > 0 ? 'inline-block' : 'none'; 
    });
}
//Load số lượng giỏ hàng
async function loadCartOnce() {
  try {
    const res = await getCart();
    const items = res?.data?.items || [];
    updateCartNotice(items.length);
  } catch (e) {
    console.error("Lỗi load cart:", e);
  }
}
function updateCartNotice(count) {
  const noticeElements = document.querySelectorAll('#header__second__cart--notice');
  noticeElements.forEach(el => {
    el.textContent = count > 0 ? count : '';
    el.style.display = count > 0 ? 'inline-block' : 'none'; 
  });
}
loadCartOnce();
loadFavoritesOnce();