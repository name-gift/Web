"use strict";


/* =====================================================
   ACCOUNT ELEMENTS
===================================================== */

const accountUserButton =
  document.querySelector(
    "#userButton"
  );

const accountUserDropdown =
  document.querySelector(
    "#userDropdown"
  );

const accountLoginButton =
  document.querySelector(
    "#loginButton"
  );


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


    /*
       Xóa UID profile cũ
       nếu tài khoản đã đăng xuất
    */

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
      session.username || "User";

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
      session.email || "";

  }


  /* =================================================
     ACCOUNT ID
     
     ID hiển thị là 5 số.
     
     Ví dụ:
     00001
     00002
     00003
===================================================== */

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
     
     UID dùng cho URL.
     
     KHÔNG dùng account ID 5 số.
     
     URL mẫu:
     
     /profile/uid/
     5d72f27a-4757-4c02-81a7-1231d81f5d63
===================================================== */

  const profileLinks =
    document.querySelectorAll(
      "#profileButton, [data-profile-link]"
    );


  profileLinks.forEach(link => {

    if (!session.uid) {

      return;

    }


    const uid =
      String(session.uid);


    /*
       Tạo URL tuyệt đối từ root website.

       Ví dụ UID:

       5d72f27a-4757-4c02-81a7-1231d81f5d63

       Kết quả:

       /profile/uid/
       5d72f27a-4757-4c02-81a7-1231d81f5d63
    */

    const profileUrl =
      `/profile/uid/${encodeURIComponent(uid)}`;


    link.href =
      profileUrl;


    /*
       Lưu UID vào element.
    */

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

        event.stopPropagation();


        if (!accountUserDropdown) {

          return;

        }


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
           TẠO PROFILE URL
        --------------------------------------------- */

        const uid =
          String(session.uid);


        const profileUrl =
          `/profile/uid/${encodeURIComponent(uid)}`;


        /*
           Cập nhật href trước khi chuyển trang.
        */

        button.href =
          profileUrl;


        /*
           Không sử dụng openMyProfile().
           
           URL sẽ giữ nguyên dạng:

           /profile/uid/UID
        */

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
    () => {

      if (
        typeof clearSession ===
        "function"
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
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateAccountUI();

    initUserDropdown();

    initProfileButton();

    initLogout();

  }
);

/* =====================================================
   PROMO CODE MODAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const promoButton = document.getElementById("promoCodeButton");
  const promoModal = document.getElementById("promoModal");
  const closePromo = document.getElementById("closePromo");
  const cancelPromo = document.getElementById("cancelPromo");
  const promoForm = document.getElementById("promoForm");
  const promoInput = document.getElementById("promoCodeInput");
  const promoMessage = document.getElementById("promoMessage");
  const promoSubmit = document.getElementById("promoSubmit");
  const clearPromoCode = document.getElementById("clearPromoCode");

  if (!promoButton || !promoModal) {
    console.warn("Promo modal chưa được tìm thấy.");
    return;
  }


  /* ===================================================
     MỞ MODAL
  =================================================== */

  function openPromoModal() {

    promoModal.classList.add("show");
    promoModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    if (promoInput) {
      setTimeout(() => {
        promoInput.focus();
      }, 100);
    }
  }


  /* ===================================================
     ĐÓNG MODAL
  =================================================== */

  function closePromoModal() {

    promoModal.classList.remove("show");
    promoModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    if (promoInput) {
      promoInput.value = "";
    }

    if (promoMessage) {
      promoMessage.textContent = "";
      promoMessage.className = "promo-message";
    }

    if (clearPromoCode) {
      clearPromoCode.style.display = "none";
    }

    if (promoSubmit) {
      promoSubmit.disabled = false;
      promoSubmit.innerHTML =
        '<i class="fa-solid fa-bolt"></i> Kích hoạt ngay';
    }
  }


  /* ===================================================
     BUTTON NHẬP MÃ KHUYẾN MÃI
  =================================================== */

  promoButton.addEventListener("click", (event) => {

    event.preventDefault();
    event.stopPropagation();

    openPromoModal();

  });


  /* ===================================================
     NÚT X
  =================================================== */

  if (closePromo) {

    closePromo.addEventListener("click", (event) => {

      event.preventDefault();

      closePromoModal();

    });

  }


  /* ===================================================
     NÚT HỦY
  =================================================== */

  if (cancelPromo) {

    cancelPromo.addEventListener("click", (event) => {

      event.preventDefault();

      closePromoModal();

    });

  }


  /* ===================================================
     CLICK RA NGOÀI MODAL
  =================================================== */

  promoModal.addEventListener("click", (event) => {

    if (event.target === promoModal) {
      closePromoModal();
    }

  });


  /* ===================================================
     ESC ĐỂ ĐÓNG
  =================================================== */

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      promoModal.classList.contains("show")
    ) {

      closePromoModal();

    }

  });


  /* ===================================================
     INPUT
  =================================================== */

  if (promoInput) {

    promoInput.addEventListener("input", () => {

      promoInput.value = promoInput.value.toUpperCase();

      if (clearPromoCode) {

        clearPromoCode.style.display =
          promoInput.value.length > 0
            ? "flex"
            : "none";

      }

      if (promoMessage) {

        promoMessage.textContent = "";
        promoMessage.className = "promo-message";

      }

    });

  }


  /* ===================================================
     XÓA MÃ
  =================================================== */

  if (clearPromoCode) {

    clearPromoCode.addEventListener("click", () => {

      promoInput.value = "";
      promoInput.focus();

      clearPromoCode.style.display = "none";

      if (promoMessage) {

        promoMessage.textContent = "";
        promoMessage.className = "promo-message";

      }

    });

  }


  /* ===================================================
     SUBMIT
  =================================================== */

  if (promoForm) {

    promoForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const code = promoInput.value.trim();

      if (!code) {

        promoMessage.textContent =
          "Vui lòng nhập mã khuyến mãi.";

        promoMessage.className =
          "promo-message error";

        promoInput.focus();

        return;
      }


      /* ===============================================
         LOADING
      =============================================== */

      promoSubmit.disabled = true;

      promoSubmit.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Đang kiểm tra...';


      promoMessage.textContent = "";
      promoMessage.className = "promo-message";


      /*
       * ================================================
       * KIỂM TRA MÃ
       *
       * Tạm thời demo.
       *
       * Sau này nếu bạn có Firebase/backend,
       * thay phần này bằng kiểm tra database.
       * ================================================
       */

      setTimeout(() => {

        /*
         * Ví dụ mã hợp lệ:
         * MFS@ABCDEFGH1234567
         */

        const validCode = "MFS@ABCDEFGH1234567";


        if (code === validCode) {

          promoMessage.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> ' +
            'Mã khuyến mãi hợp lệ!';

          promoMessage.className =
            "promo-message success";


          promoSubmit.disabled = false;

          promoSubmit.innerHTML =
            '<i class="fa-solid fa-check"></i> Đã xác minh';


        } else {

          promoMessage.innerHTML =
            '<i class="fa-solid fa-circle-xmark"></i> ' +
            'Mã khuyến mãi không hợp lệ hoặc đã hết hạn.';

          promoMessage.className =
            "promo-message error";


          promoSubmit.disabled = false;

          promoSubmit.innerHTML =
            '<i class="fa-solid fa-bolt"></i> Kích hoạt ngay';

        }

      }, 700);

    });

  }

});