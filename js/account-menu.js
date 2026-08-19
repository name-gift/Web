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