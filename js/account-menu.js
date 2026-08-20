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


        if (!session) {

          event.preventDefault();

          return;

        }


        if (!session.uid) {

          event.preventDefault();

          console.warn(
            "Không tìm thấy UID tài khoản."
          );

          return;

        }


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
   CONNECTION / REFRESH
===================================================== */

function initConnectionHelp() {

  const connectionButton =
    document.querySelector(
      "#connectionHelpButton"
    );


  if (!connectionButton) {

    return;

  }


  connectionButton.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();


      /* Đóng dropdown */

      if (accountUserDropdown) {

        accountUserDropdown.classList.remove(
          "show"
        );

      }


      /* Đóng mobile menu */

      closeMobileMenu();


      /*
       * Hiện /refresh/ ngay trên thanh địa chỉ.
       * Không reload trang.
       */

      try {

        window.history.pushState(
          {},
          "",
          "/refresh/"
        );

      }

      catch (error) {

        console.warn(
          "Không thể đổi URL:",
          error
        );

      }


      /*
       * Chờ rất ngắn để người dùng
       * nhìn thấy /refresh/
       */

      setTimeout(
        () => {

          window.location.replace(
            "/"
          );

        },
        400
      );

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

    if (accountUserDropdown) {

      accountUserDropdown.classList.remove(
        "show"
      );

    }


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


    if (promoInput) {

      promoInput.value =
        "";

    }


    if (promoMessage) {

      promoMessage.textContent =
        "";

      promoMessage.className =
        "promo-message";

    }


    if (clearPromoCode) {

      clearPromoCode.style.display =
        "none";

    }


    if (promoSubmit) {

      promoSubmit.disabled =
        false;

      promoSubmit.innerHTML =
        '<i class="fa-solid fa-bolt"></i> Kích hoạt ngay';

    }


    if (
      typeof MonFansubTurnstile !==
      "undefined"
    ) {

      MonFansubTurnstile.reset();

    }

  }


  /* =================================================
     PROMO BUTTON
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
     CLOSE
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
     CANCEL
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
     CLICK OUTSIDE
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
     CLEAR PROMO
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


        const captchaToken =
          typeof MonFansubTurnstile !==
          "undefined"
            ? MonFansubTurnstile.getToken()
            : null;


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


          /* API SUCCESS */

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


          /* API ERROR */

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

    initConnectionHelp();

    initPromoModal();

  }
);