"use strict";

/* =====================================================
   MOVIE DATA
===================================================== */

const movies = [
  {
    id: "doraemon-01",
    title: "Doraemon: Nobita Và Cuộc Phiêu Lưu",
    subtitle: "Doraemon Movie",
    year: "2026",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-02",
    title: "Doraemon: Nobita Và Vương Quốc Trên Mây",
    subtitle: "Doraemon Movie",
    year: "2025",
    quality: "1080p",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-03",
    title: "Doraemon: Thế Giới Tương Lai",
    subtitle: "Doraemon Movie",
    year: "2025",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-04",
    title: "Doraemon: Nobita Và Thành Phố Robot",
    subtitle: "Doraemon Movie",
    year: "2024",
    quality: "1080p",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-05",
    title: "Doraemon: Đảo Giấu Vàng",
    subtitle: "Doraemon Movie",
    year: "2024",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-06",
    title: "Doraemon: Chuyến Tàu Kỳ Bí",
    subtitle: "Doraemon Movie",
    year: "2024",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-07",
    title: "Doraemon: Nobita Và Những Người Bạn",
    subtitle: "Doraemon",
    year: "2023",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-08",
    title: "Doraemon: Bí Mật Của Bảo Bối",
    subtitle: "Doraemon",
    year: "2023",
    quality: "1080p",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-09",
    title: "Doraemon: Cuộc Chiến Không Gian",
    subtitle: "Doraemon",
    year: "2022",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-10",
    title: "Doraemon: Hành Trình Đến Tương Lai",
    subtitle: "Doraemon",
    year: "2022",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-11",
    title: "Doraemon: Kỳ Nghỉ Đặc Biệt",
    subtitle: "Doraemon",
    year: "2021",
    quality: "HD",
    poster: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: "doraemon-12",
    title: "Doraemon: Bí Mật Hành Tinh",
    subtitle: "Doraemon",
    year: "2021",
    quality: "1080p",
    poster: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80"
  }
];


/* =====================================================
   SELECTOR
===================================================== */

const $ = selector =>
  document.querySelector(selector);


/* =====================================================
   MOVIE CARD
===================================================== */

function createMovieCard(movie) {

  return `
    <article
      class="movie-card"
      data-title="${movie.title.toLowerCase()}"
      onclick="watchMovie('${movie.id}')"
    >

      <div class="poster">

        <img
          src="${movie.poster}"
          alt="${movie.title}"
          loading="lazy"
        >

        <span class="movie-badge">
          ${movie.quality}
        </span>

        <div class="poster-overlay">

          <div class="play-circle">
            <i class="fa-solid fa-play"></i>
          </div>

        </div>

      </div>

      <h3 class="movie-name">
        ${movie.title}
      </h3>

      <div class="movie-subtitle">
        ${movie.subtitle} • ${movie.year}
      </div>

    </article>
  `;
}


/* =====================================================
   LOAD MOVIES
===================================================== */

function loadMovies() {

  const grid = $("#latestGrid");

  if (!grid) return;

  grid.innerHTML =
    movies
      .map(createMovieCard)
      .join("");
}


/* =====================================================
   WATCH MOVIE
===================================================== */

function watchMovie(id) {

  localStorage.setItem(
    "lastMovie",
    id
  );

  window.location.href =
    `watch.html?id=${encodeURIComponent(id)}&ep=1`;
}


/* =====================================================
   INFO
===================================================== */

function showInfo() {

  alert(
    "Doraemon Movie\n\n" +
    "Vietsub • HD • Anime\n\n" +
    "Trang chi tiết phim có thể " +
    "được kết nối với API."
  );
}


/* =====================================================
   SEARCH
===================================================== */

function initSearch() {

  const input = $("#searchInput");
  const results = $("#searchResults");
  const grid = $("#searchGrid");
  const empty = $("#searchEmpty");

  if (!input || !results || !grid || !empty) {
    return;
  }

  input.addEventListener(
    "input",
    function () {

      const keyword =
        this.value
          .trim()
          .toLowerCase();

      if (!keyword) {

        results.classList.remove("show");

        return;
      }

      const result =
        movies.filter(movie =>
          movie.title
            .toLowerCase()
            .includes(keyword)
        );

      results.classList.add("show");

      if (!result.length) {

        grid.innerHTML = "";

        empty.style.display = "block";

        return;
      }

      empty.style.display = "none";

      grid.innerHTML =
        result
          .map(createMovieCard)
          .join("");
    }
  );
}


/* =====================================================
   HEADER SCROLL
===================================================== */

function initHeader() {

  const header = $("#header");

  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {

      header.classList.toggle(
        "scrolled",
        window.scrollY > 40
      );

    }
  );
}


/* =====================================================
   BACK TOP
===================================================== */

function initBackTop() {

  const button = $("#backTop");

  if (!button) return;

  window.addEventListener(
    "scroll",
    () => {

      button.classList.toggle(
        "show",
        window.scrollY > 500
      );

    }
  );

  button.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );
}


/* =====================================================
   MOBILE MENU
===================================================== */

function initMobileMenu() {

  const button = $("#mobileMenu");
  const nav = $("#mainNav");

  if (!button || !nav) return;

  button.addEventListener(
    "click",
    () => {

      nav.classList.toggle(
        "mobile-open"
      );

    }
  );

  nav.querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove(
            "mobile-open"
          );

        }
      );

    });
}


/* =====================================================
   PRELOADER
===================================================== */

function initPreloader() {

  window.addEventListener(
    "load",
    () => {

      setTimeout(
        () => {

          const preloader =
            $("#preloader");

          if (preloader) {

            preloader.classList.add(
              "hide"
            );

          }

        },
        450
      );

    }
  );
}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadMovies();
    initSearch();
    initHeader();
    initBackTop();
    initMobileMenu();
    initPreloader();

  }
);