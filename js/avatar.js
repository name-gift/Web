"use strict";


document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* =================================================
       THEME
    ================================================= */

    const themeButton =
      document.getElementById(
        "themeButton"
      );


    const themeValue =
      document.getElementById(
        "themeValue"
      );


    function applyTheme(theme) {

      if (theme === "dark") {

        document.documentElement
          .setAttribute(
            "data-theme",
            "dark"
          );

      } else if (
        theme === "light"
      ) {

        document.documentElement
          .setAttribute(
            "data-theme",
            "light"
          );

      } else {

        document.documentElement
          .removeAttribute(
            "data-theme"
          );

      }


      if (!themeValue) {
        return;
      }


      if (theme === "dark") {

        themeValue.textContent =
          "Tối";

      } else if (
        theme === "light"
      ) {

        themeValue.textContent =
          "Sáng";

      } else {

        themeValue.textContent =
          "Tự động";

      }

    }


    /* =================================================
       THEME BUTTON
    ================================================= */

    if (themeButton) {

      themeButton.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          const current =
            localStorage.getItem(
              "monfansub-theme"
            ) || "auto";


          let next;


          if (
            current === "auto"
          ) {

            next = "dark";

          } else if (
            current === "dark"
          ) {

            next = "light";

          } else {

            next = "auto";

          }


          localStorage.setItem(
            "monfansub-theme",
            next
          );


          applyTheme(next);

        }
      );

    }


    /* =================================================
       LOAD THEME
    ================================================= */

    const savedTheme =
      localStorage.getItem(
        "monfansub-theme"
      ) || "auto";


    applyTheme(
      savedTheme
    );


    /* =================================================
       CONNECTION HELP
    ================================================= */

    const connectionHelpButton =
      document.getElementById(
        "connectionHelpButton"
      );


    connectionHelpButton
      ?.addEventListener(
        "click",
        function () {

          alert(
            "Nếu MonFansub không thể kết nối hoặc gặp lỗi, em hãy thử tải lại trang hoặc kiểm tra kết nối Internet."
          );

        }
      );


    /* =================================================
       PROMO CODE
    ================================================= */

    const promoCodeButton =
      document.getElementById(
        "promoCodeButton"
      );


    promoCodeButton
      ?.addEventListener(
        "click",
        function () {

          const code =
            prompt(
              "Nhập mã khuyến mãi:"
            );


          if (!code) {
            return;
          }


          alert(
            'Mã "' +
            code +
            '" đã được ghi nhận.'
          );

        }
      );


  }
);