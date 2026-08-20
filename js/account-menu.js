"use strict";

/* =====================================================
   API
===================================================== */

const API_BASE =
  "https://xac-minh.abcd1601ab.workers.dev";


/* =====================================================
   ACCOUNT ELEMENTS
===================================================== */

const accountUserButton =
  document.querySelector("#userButton");

const accountUserDropdown =
  document.querySelector("#userDropdown");

const accountLoginButton =
  document.querySelector("#loginButton");


/* =====================================================
   MOBILE MENU ELEMENTS
===================================================== */

const mobileMenu =
  document.querySelector("#mobileMenu");

const mainNav =
  document.querySelector("#mainNav");


/* =====================================================
   UPDATE ACCOUNT UI
===================================================== */

function updateAccountUI() {

  const session =
    typeof getSession === "function"
      ? getSession()
      : null;


  /* =================================================
     CHƯA ĐĂNG NHẬP
  ================================================= */

  if (!session) {

    if (accountLoginButton) {

      accountLoginButton.style.display =
        "flex";

    }


    if (accountUserButton) {

      accountUserButton.style.display =
        "none";

    }


    if (accountUserDropdown) {

      accountUserDropdown.classList.remove(
        "show"
      );

    }


    /* Xóa UID profile cũ */

    const profileLinks =
      document.querySelectorAll(
        "#profileButton, [data-profile-link]"
      );


    profileLinks.forEach(link => {

      link.removeAttribute(
        "data-profile-uid"
      );

    });


    return;

  }


  /* =================================================
     ĐÃ ĐĂNG NHẬP
  ================================================= */

  if (accountLoginButton) {

    accountLoginButton.style.display =
      "none";

  }


  if (accountUserButton) {

    accountUserButton.style.display =
      "flex";

  }


  /* =================================================
     USERNAME
  ================================================= */

  const username =
    document.querySelector(
      "#dropdownUserName"
    );


  if (username) {

    username.textContent =
      session.username ||
      "User";

  }


  /* =================================================
     EMAIL
  ================================================= */

  const email =
    document.querySelector(
      "#dropdownUserEmail"
    );


  if (email) {

    email.textContent =
      session.email ||
      "";

  }


  /* =================================================
     ACCOUNT ID
  ================================================= */

  const id =
    document.querySelector(
      "#dropdownUserId"
    );


  if (id) {

    id.textContent =
      String(
        session.id || "00000"
      ).padStart(
        5,
        "0"
      );

  }


  /* =================================================
     PROFILE LINK
  ================================================= */

  const profileLinks =
    document.querySelectorAll(
      "#profileButton, [data-profile-link]"
    );


  profileLinks.forEach(link => {

    if (!session.uid) {

      link.removeAttribute(
        "data-profile-uid"
      );

      return;

    }


    const uid =
      String(
        session.uid
      );


    link.href =
      `/profile/uid/${encodeURIComponent(uid)}`;


    link.dataset.profileUid =
      uid;

  });

}


/* =====================================================
   USER DROPDOWN
===================================================== */

function initUserDropdown() {

  if (accountUserButton) {

    accountUserButton.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();


        if (!accountUserDropdown) {

          return;

        }


        /* Đóng mobile menu */

        closeMobileMenu();


        accountUserDropdown.classList.toggle(
          "show"
        );

      }
    );

  }


  document.addEventListener(
    "click",
    event => {

      if (!accountUserDropdown) {

        return;

      }


      if (
        !event.target.closest(
          ".account-area"
        )
      ) {

        accountUserDropdown.classList.remove(
          "show"
        );

      }

    }
  );

}


/* =====================================================
   PROFILE BUTTON
===================================================== */

function initProfileButton() {

  const profileButtons =
    document.querySelectorAll(
      "#profileButton, [data-profile-link]"
    );


  profileButtons.forEach(button => {

    button.addEventListener(
      "click",
      event => {

        const session =
          typeof getSession === "function"
            ? getSession()
            : null;


        /* ---------------------------------------------
           CHƯA ĐĂNG NHẬP
        --------------------------------------------- */

        if (!session) {

          event.preventDefault();

          return;

        }


        /* ---------------------------------------------
           KHÔNG CÓ UID
        --------------------------------------------- */

        if (!session.uid) {

          event.preventDefault();

          console.warn(
            "Không tìm thấy UID tài khoản."
          );

          return;

        }


        /* ---------------------------------------------
           PROFILE URL
        --------------------------------------------- */

        const uid =
          String(
            session.uid
          );


        button.href =
          `/profile/uid/${encodeURIComponent(uid)}`;

      }
    );

  });

}


/* =====================================================
   LOGOUT
===================================================== */

function initLogout() {

  const logoutButton =
    document.querySelector(
      "#logoutButton"
    );


  if (!logoutButton) {

    return;

  }


  logoutButton.addEventListener(
    "click",
    event => {

      event.preventDefault();


      if (
        typeof clearSession === "function"
      ) {

        clearSession();

      }


      if (accountUserDropdown) {

        accountUserDropdown.classList.remove(
          "show"
        );

      }


      updateAccountUI();

    }
  );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function initMobileMenu() {

  if (!mobileMenu || !mainNav) {

    console.warn(
      "Không tìm thấy #mobileMenu hoặc #mainNav."
    );

    return;

  }


  mobileMenu.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();


      const isOpen =
        mobileMenu.classList.toggle(
          "active"
        );


      mainNav.classList.toggle(
        "mobile-open",
        isOpen
      );


      mobileMenu.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      /* Đổi icon bars ↔ X */

      const icon =
        mobileMenu.querySelector(
          "i"
        );


      if (icon) {

        icon.classList.toggle(
          "fa-bars",
          !isOpen
        );

        icon.classList.toggle(
          "fa-xmark",
          isOpen
        );

      }


      /* Đóng account dropdown */

      if (
        isOpen &&
        accountUserDropdown
      ) {

        accountUserDropdown.classList.remove(
          "show"
        );

      }

    }
  );


  /* Click link → đóng menu */

  mainNav
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          closeMobileMenu();

        }
      );

    });


  /* Click ra ngoài → đóng */

  document.addEventListener(
    "click",
    event => {

      if (
        !event.target.closest(
          "#mainNav"
        ) &&
        !event.target.closest(
          "#mobileMenu"
        )
      ) {

        closeMobileMenu();

      }

    }
  );


  /* ESC → đóng */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeMobileMenu();

      }

    }
  );

}


/* =====================================================
   CLOSE MOBILE MENU
===================================================== */

function closeMobileMenu() {

  if (!mobileMenu || !mainNav) {

    return;

  }


  mobileMenu.classList.remove(
    "active"
  );


  mainNav.classList.remove(
    "mobile-open"
  );


  mobileMenu.setAttribute(
    "aria-expanded",
    "false"
  );


  const icon =
    mobileMenu.querySelector(
      "i"
    );


  if (icon) {

    icon.classList.remove(
      "fa-xmark"
    );

    icon.classList.add(
      "fa-bars"
    );

  }

}


/* =====================================================
   PROMO CODE MODAL
===================================================== */

function initPromoModal() {

  const promoButton =
    document.querySelector(
      "#promoCodeButton"
    );

  const promoModal =
    document.querySelector(
      "#promoModal"
    );

  const closePromo =
    document.querySelector(
      "#closePromo"
    );

  const cancelPromo =
    document.querySelector(
      "#cancelPromo"
    );

  const promoForm =
    document.querySelector(
      "#promoForm"
    );

  const promoInput =
    document.querySelector(
      "#promoCodeInput"
    );

  const promoMessage =
    document.querySelector(
      "#promoMessage"
    );

  const promoSubmit =
    document.querySelector(
      "#promoSubmit"
    );

  const clearPromoCode =
    document.querySelector(
      "#clearPromoCode"
    );


  /* =================================================
     KIỂM TRA ELEMENT
  ================================================= */

  if (
    !promoButton ||
    !promoModal
  ) {

    console.warn(
      "Promo modal chưa được tìm thấy."
    );

    return;

  }


  /* =================================================
     MỞ MODAL
  ================================================= */

  function openPromoModal() {

    /* Đóng account dropdown */

    if (accountUserDropdown) {

      accountUserDropdown.classList.remove(
        "show"
      );

    }


    /* Đóng mobile menu */

    closeMobileMenu();


    promoModal.classList.add(
      "show"
    );


    promoModal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.classList.add(
      "modal-open"
    );


    /* Focus input */

    if (promoInput) {

      setTimeout(
        () => {

          promoInput.focus();

        },
        100
      );

    }

  }


  /* =================================================
     ĐÓNG MODAL
  ================================================= */

  function closePromoModal() {

    promoModal.classList.remove(
      "show"
    );


    promoModal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "modal-open"
    );


    /* Reset input */

    if (promoInput) {

      promoInput.value =
        "";

    }


    /* Reset message */

    if (promoMessage) {

      promoMessage.textContent =
        "";

      promoMessage.className =
        "promo-message";

    }


    /* Reset clear */

    if (clearPromoCode) {

      clearPromoCode.style.display =
        "none";

    }


    /* Reset button */

    if (promoSubmit) {

      promoSubmit.disabled =
        false;

      promoSubmit.innerHTML =
        '<i class="fa-solid fa-bolt"></i> Kích hoạt ngay';

    }


    /* Reset CAPTCHA */

    if (
      typeof MonFansubTurnstile !==
      "undefined"
    ) {

      MonFansubTurnstile.reset();

    }

  }


  /* =================================================
     NÚT NHẬP MÃ KHUYẾN MÃI
  ================================================= */

  promoButton.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();


      openPromoModal();

    }
  );


  /* =================================================
     NÚT X
  ================================================= */

  if (closePromo) {

    closePromo.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();


        closePromoModal();

      }
    );

  }


  /* =================================================
     NÚT HỦY
  ================================================= */

  if (cancelPromo) {

    cancelPromo.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();


        closePromoModal();

      }
    );

  }


  /* =================================================
     CLICK NGOÀI MODAL
  ================================================= */

  promoModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        promoModal
      ) {

        closePromoModal();

      }

    }
  );


  /* =================================================
     ESC
  ================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        promoModal.classList.contains(
          "show"
        )
      ) {

        closePromoModal();

      }

    }
  );


  /* =================================================
     INPUT
  ================================================= */

  if (promoInput) {

    promoInput.addEventListener(
      "input",
      () => {

        promoInput.value =
          promoInput.value.toUpperCase();


        if (clearPromoCode) {

          clearPromoCode.style.display =
            promoInput.value.length > 0
              ? "flex"
              : "none";

        }


        if (promoMessage) {

          promoMessage.textContent =
            "";

          promoMessage.className =
            "promo-message";

        }

      }
    );

  }


  /* =================================================
     XÓA MÃ
  ================================================= */

  if (clearPromoCode) {

    clearPromoCode.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();


        if (promoInput) {

          promoInput.value =
            "";

          promoInput.focus();

        }


        clearPromoCode.style.display =
          "none";


        if (promoMessage) {

          promoMessage.textContent =
            "";

          promoMessage.className =
            "promo-message";

        }

      }
    );

  }


  /* =================================================
     SUBMIT PROMO
  ================================================= */

  if (promoForm) {

    promoForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        if (!promoInput) {

          return;

        }


        const code =
          promoInput.value
            .trim()
            .toUpperCase();


        /* ---------------------------------------------
           CHƯA NHẬP MÃ
        --------------------------------------------- */

        if (!code) {

          if (promoMessage) {

            promoMessage.innerHTML =
              '<i class="fa-solid fa-circle-exclamation"></i> ' +
              "Vui lòng nhập mã khuyến mãi.";

            promoMessage.className =
              "promo-message error";

          }


          promoInput.focus();

          return;

        }


        /* ---------------------------------------------
           LẤY TURNSTILE TOKEN
           
           CAPTCHA đã được tách sang
           js/turnstile.js
        --------------------------------------------- */

        const captchaToken =
          typeof MonFansubTurnstile !==
          "undefined"
            ? MonFansubTurnstile.getToken()
            : null;


        /* ---------------------------------------------
           CHƯA CÓ CAPTCHA
        --------------------------------------------- */

        if (!captchaToken) {

          if (promoMessage) {

            promoMessage.innerHTML =
              '<i class="fa-solid fa-circle-exclamation"></i> ' +
              "Vui lòng hoàn thành xác minh CAPTCHA.";

            promoMessage.className =
              "promo-message error";

          }

          return;

        }


        /* ---------------------------------------------
           LOADING
        --------------------------------------------- */

        if (promoSubmit) {

          promoSubmit.disabled =
            true;

          promoSubmit.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> ' +
            "Đang kiểm tra...";

        }


        if (promoMessage) {

          promoMessage.textContent =
            "";

          promoMessage.className =
            "promo-message";

        }


        /* ---------------------------------------------
           GỌI PROMO WORKER
        --------------------------------------------- */

        try {

          const response =
            await fetch(
              `${API_BASE}/api/promo`,
              {

                method:
                  "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify({

                    code:
                      code,

                    captchaToken:
                      captchaToken

                  })

              }
            );


          let result;


          try {

            result =
              await response.json();

          }

          catch {

            result = {

              success: false,

              message:
                "Máy chủ trả về dữ liệu không hợp lệ."

            };

          }


          /* -----------------------------------------
             API SUCCESS
          ----------------------------------------- */

          if (
            response.ok &&
            result.success
          ) {

            if (promoMessage) {

              promoMessage.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> ' +
                (
                  result.message ||
                  "Mã khuyến mãi hợp lệ."
                );

              promoMessage.className =
                "promo-message success";

            }


            /* Hiển thị phần thưởng */

            if (result.reward) {

              if (promoMessage) {

                promoMessage.innerHTML +=
                  "<br>" +
                  '<span class="promo-reward">' +
                  '<i class="fa-solid fa-gift"></i> ' +
                  String(
                    result.reward
                  ) +
                  "</span>";

              }

            }


            if (promoSubmit) {

              promoSubmit.disabled =
                false;

              promoSubmit.innerHTML =
                '<i class="fa-solid fa-check"></i> ' +
                "Đã xác minh";

            }


            return;

          }


          /* -----------------------------------------
             API ERROR
          ----------------------------------------- */

          if (promoMessage) {

            promoMessage.innerHTML =
              '<i class="fa-solid fa-circle-xmark"></i> ' +
              (
                result.message ||
                "Mã khuyến mãi không hợp lệ."
              );

            promoMessage.className =
              "promo-message error";

          }


          if (promoSubmit) {

            promoSubmit.disabled =
              false;

            promoSubmit.innerHTML =
              '<i class="fa-solid fa-bolt"></i> ' +
              "Kích hoạt ngay";

          }


          /* CAPTCHA lỗi → reset */

          if (
            typeof MonFansubTurnstile !==
            "undefined"
          ) {

            MonFansubTurnstile.reset();

          }

        }

        catch (error) {

          console.error(
            "PROMO API ERROR:",
            error
          );


          if (promoMessage) {

            promoMessage.innerHTML =
              '<i class="fa-solid fa-triangle-exclamation"></i> ' +
              "Không thể kết nối máy chủ. Vui lòng thử lại.";

            promoMessage.className =
              "promo-message error";

          }


          if (promoSubmit) {

            promoSubmit.disabled =
              false;

            promoSubmit.innerHTML =
              '<i class="fa-solid fa-bolt"></i> ' +
              "Kích hoạt ngay";

          }

        }

      }
    );

  }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateAccountUI();

    initUserDropdown();

    initProfileButton();

    initLogout();

    initMobileMenu();

    initPromoModal();

  }
);
