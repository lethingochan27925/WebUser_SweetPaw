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
  { id: "hvpp", value: 100 },
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