/* =====================================================
   MONFANSUB
   HISTORY + FAVORITE
===================================================== */

const HISTORY_KEY = "monfansub_history";
const FAVORITE_KEY = "monfansub_favorites";


/* =====================================================
   STORAGE
===================================================== */

function getLibraryData(key) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(key)
            );

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Không đọc được dữ liệu:",
            error
        );

        return [];

    }

}


function saveLibraryData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


/* =====================================================
   XÓA 1 PHIM
===================================================== */

function removeLibraryItem(key, movieId) {

    const data =
        getLibraryData(key);

    const newData =
        data.filter(
            movie =>
                movie.id !== movieId
        );

    saveLibraryData(
        key,
        newData
    );

    renderLibrary();

}


/* =====================================================
   XÓA TẤT CẢ
===================================================== */

function clearLibrary(key) {

    const data =
        getLibraryData(key);

    if (!data.length) {
        return;
    }


    const confirmed =
        confirm(
            "Bạn có chắc muốn xóa toàn bộ danh sách này không?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(key);

    renderLibrary();

}


/* =====================================================
   THỜI GIAN
===================================================== */

function formatTime(timestamp) {

    if (!timestamp) {
        return "";
    }


    const date =
        new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }


    const now =
        new Date();

    const diff =
        now - date;


    const minute =
        60 * 1000;

    const hour =
        60 * minute;

    const day =
        24 * hour;


    if (diff < minute) {

        return "Vừa xem";

    }


    if (diff < hour) {

        return (
            Math.floor(diff / minute) +
            " phút trước"
        );

    }


    if (diff < day) {

        return (
            Math.floor(diff / hour) +
            " giờ trước"
        );

    }


    if (diff < 7 * day) {

        return (
            Math.floor(diff / day) +
            " ngày trước"
        );

    }


    return date.toLocaleDateString(
        "vi-VN"
    );

}


/* =====================================================
   CARD
===================================================== */

function createLibraryCard(
    movie,
    type
) {

    const card =
        document.createElement("article");

    card.className =
        "library-card";


    const movieId =
        movie.id || "";


    const title =
        movie.title ||
        "Phim không tên";


    const poster =
        movie.poster ||
        movie.image ||
        "https://i.imgur.com/nFJ3B1e.png";


    const year =
        movie.year ||
        "";


    const time =
        movie.timestamp ||
        movie.time ||
        "";


    card.innerHTML = `

        <div class="library-poster">

            <img
                src="${poster}"
                alt="${title}"
                loading="lazy"
            >

            <div class="library-overlay">

                <div class="library-play">

                    <i class="fa-solid fa-play"></i>

                </div>

            </div>


            <button
                type="button"
                class="library-remove"
                title="${
                    type === "history"
                        ? "Xóa khỏi lịch sử"
                        : "Bỏ yêu thích"
                }"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>


        <div class="library-info">

            <h3 class="library-name">
                ${title}
            </h3>


            <div class="library-meta">

                ${
                    year
                        ? `<span>${year}</span>`
                        : ""
                }

                ${
                    year && time
                        ? `<span>•</span>`
                        : ""
                }

                ${
                    time
                        ? `<span class="library-time">
                            ${
                                type === "history"
                                    ? formatTime(time)
                                    : "Đã lưu"
                            }
                           </span>`
                        : ""
                }

            </div>

        </div>

    `;


    /* =================================================
       XÓA
    ================================================= */

    const removeButton =
        card.querySelector(
            ".library-remove"
        );


    removeButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            removeLibraryItem(
                type === "history"
                    ? HISTORY_KEY
                    : FAVORITE_KEY,
                movieId
            );

        }
    );


    /* =================================================
       XEM PHIM
    ================================================= */

    card.addEventListener(
        "click",
        function () {

            if (
                typeof window.watchMovie ===
                "function"
            ) {

                window.watchMovie(
                    movieId
                );

            } else {

                window.location.href =
                    "movie.html?id=" +
                    encodeURIComponent(
                        movieId
                    );

            }

        }
    );


    return card;

}


/* =====================================================
   RENDER
===================================================== */

function renderLibrary() {

    const historyGrid =
        document.getElementById(
            "historyGrid"
        );


    const favoriteGrid =
        document.getElementById(
            "favoriteGrid"
        );


    const historyEmpty =
        document.getElementById(
            "historyEmpty"
        );


    const favoriteEmpty =
        document.getElementById(
            "favoriteEmpty"
        );


    /* ================================================
       HISTORY
    ================================================= */

    if (historyGrid) {

        const history =
            getLibraryData(
                HISTORY_KEY
            );


        historyGrid.innerHTML = "";


        if (!history.length) {

            historyEmpty.style.display =
                "flex";

        } else {

            historyEmpty.style.display =
                "none";


            history.forEach(
                movie => {

                    historyGrid.appendChild(
                        createLibraryCard(
                            movie,
                            "history"
                        )
                    );

                }
            );

        }

    }


    /* ================================================
       FAVORITE
    ================================================= */

    if (favoriteGrid) {

        const favorites =
            getLibraryData(
                FAVORITE_KEY
            );


        favoriteGrid.innerHTML = "";


        if (!favorites.length) {

            favoriteEmpty.style.display =
                "flex";

        } else {

            favoriteEmpty.style.display =
                "none";


            favorites.forEach(
                movie => {

                    favoriteGrid.appendChild(
                        createLibraryCard(
                            movie,
                            "favorite"
                        )
                    );

                }
            );

        }

    }

}


/* =====================================================
   CLEAR BUTTON
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const clearHistory =
            document.getElementById(
                "clearHistoryButton"
            );


        if (clearHistory) {

            clearHistory.addEventListener(
                "click",
                function () {

                    clearLibrary(
                        HISTORY_KEY
                    );

                }
            );

        }


        const clearFavorite =
            document.getElementById(
                "clearFavoriteButton"
            );


        if (clearFavorite) {

            clearFavorite.addEventListener(
                "click",
                function () {

                    clearLibrary(
                        FAVORITE_KEY
                    );

                }
            );

        }


        renderLibrary();

    }
);