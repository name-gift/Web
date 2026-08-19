"use strict";


/* =====================================================
   SECURITY.JS
   MONFANSUB VIETNAM

   ĐỔI MẬT KHẨU
   + ĐĂNG XUẤT TOÀN BỘ
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

const SECURITY_USERS_KEY =
    "monfansub_users";

const SECURITY_SESSION_KEY =
    "monfansub_session";



/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initPasswordToggle();

        initPasswordForm();

        initLogoutAll();

        updateSaveButton();

    }
);



/* =====================================================
   GET SESSION
===================================================== */

function getSecuritySession() {

    /*
       Ưu tiên auth.js
    */

    if (
        typeof getSession ===
        "function"
    ) {

        return getSession();

    }


    /*
       Fallback
    */

    try {

        const local =
            localStorage.getItem(
                SECURITY_SESSION_KEY
            );


        if (local) {

            return JSON.parse(local);

        }


        const session =
            sessionStorage.getItem(
                SECURITY_SESSION_KEY
            );


        if (session) {

            return JSON.parse(session);

        }

    } catch (error) {

        console.warn(
            "Không thể đọc session:",
            error
        );

    }


    return null;

}



/* =====================================================
   GET USERS
===================================================== */

function getSecurityUsers() {

    try {

        const data =
            localStorage.getItem(
                SECURITY_USERS_KEY
            );


        if (!data) {

            return [];

        }


        const users =
            JSON.parse(data);


        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.warn(
            "Không thể đọc users:",
            error
        );

        return [];

    }

}



/* =====================================================
   SAVE USERS
===================================================== */

function saveSecurityUsers(
    users
) {

    localStorage.setItem(
        SECURITY_USERS_KEY,
        JSON.stringify(users)
    );

}



/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function initPasswordToggle() {

    const buttons =
        document.querySelectorAll(
            ".security-password-toggle"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;


                    const input =
                        document.getElementById(
                            targetId
                        );


                    if (!input) {

                        return;

                    }


                    const icon =
                        button.querySelector(
                            "i"
                        );


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";


                        if (icon) {

                            icon.className =
                                "fa-solid fa-eye-slash";

                        }

                    } else {

                        input.type =
                            "password";


                        if (icon) {

                            icon.className =
                                "fa-solid fa-eye";

                        }

                    }

                }
            );

        }
    );

}



/* =====================================================
   PASSWORD FORM
===================================================== */

function initPasswordForm() {

    const oldPassword =
        document.getElementById(
            "oldPassword"
        );


    const newPassword =
        document.getElementById(
            "newPassword"
        );


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );


    const saveButton =
        document.getElementById(
            "savePasswordButton"
        );


    if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword ||
        !saveButton
    ) {

        return;

    }


    [
        oldPassword,
        newPassword,
        confirmPassword
    ].forEach(
        input => {

            input.addEventListener(
                "input",
                updateSaveButton
            );

        }
    );


    saveButton.addEventListener(
        "click",
        changePassword
    );

}



/* =====================================================
   UPDATE SAVE BUTTON
===================================================== */

function updateSaveButton() {

    const oldPassword =
        document.getElementById(
            "oldPassword"
        );


    const newPassword =
        document.getElementById(
            "newPassword"
        );


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        );


    const button =
        document.getElementById(
            "savePasswordButton"
        );


    if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword ||
        !button
    ) {

        return;

    }


    const valid =
        oldPassword.value.trim() !== "" &&
        newPassword.value.trim() !== "" &&
        confirmPassword.value.trim() !== "";


    button.disabled =
        !valid;


    button.classList.toggle(
        "ready",
        valid
    );

}



/* =====================================================
   CHANGE PASSWORD
===================================================== */

function changePassword() {

    const oldPassword =
        document.getElementById(
            "oldPassword"
        ).value;


    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    const message =
        document.getElementById(
            "passwordMessage"
        );


    const session =
        getSecuritySession();


    /* -----------------------------------------------
       SESSION
    ------------------------------------------------ */

    if (!session) {

        showSecurityMessage(
            message,
            "Vui lòng đăng nhập để thay đổi mật khẩu.",
            "error"
        );

        return;

    }


    /* -----------------------------------------------
       VALIDATE
    ------------------------------------------------ */

    if (!oldPassword) {

        showSecurityMessage(
            message,
            "Vui lòng nhập mật khẩu cũ.",
            "error"
        );

        return;

    }


    if (
        newPassword.length <
        6
    ) {

        showSecurityMessage(
            message,
            "Mật khẩu mới phải có ít nhất 6 ký tự.",
            "error"
        );

        return;

    }


    if (
        newPassword !==
        confirmPassword
    ) {

        showSecurityMessage(
            message,
            "Mật khẩu nhập lại không khớp.",
            "error"
        );

        return;

    }


    if (
        oldPassword ===
        newPassword
    ) {

        showSecurityMessage(
            message,
            "Mật khẩu mới phải khác mật khẩu cũ.",
            "error"
        );

        return;

    }


    /* -----------------------------------------------
       USERS
    ------------------------------------------------ */

    const users =
        getSecurityUsers();


    let userIndex =
        -1;


    /*
       Tìm bằng UID
    */

    if (session.uid) {

        userIndex =
            users.findIndex(
                user =>
                    String(
                        user.uid || ""
                    ) === String(
                        session.uid
                    )
            );

    }


    /*
       Fallback ID
    */

    if (
        userIndex === -1 &&
        session.id
    ) {

        userIndex =
            users.findIndex(
                user =>
                    String(
                        user.id || ""
                    ) === String(
                        session.id
                    )
            );

    }


    if (
        userIndex === -1
    ) {

        showSecurityMessage(
            message,
            "Không tìm thấy tài khoản.",
            "error"
        );

        return;

    }


    const user =
        users[userIndex];


    /* -----------------------------------------------
       CHECK OLD PASSWORD
    ------------------------------------------------ */

    /*
       Hỗ trợ các tên field thường dùng.
    */

    const currentPassword =
        user.password ||
        user.pass ||
        user.userPassword;


    if (
        currentPassword !==
        oldPassword
    ) {

        showSecurityMessage(
            message,
            "Mật khẩu cũ không chính xác.",
            "error"
        );

        return;

    }


    /* -----------------------------------------------
       SAVE
    ------------------------------------------------ */

    users[userIndex].password =
        newPassword;


    localStorage.setItem(
        SECURITY_USERS_KEY,
        JSON.stringify(users)
    );


    /* -----------------------------------------------
       SUCCESS
    ------------------------------------------------ */

    showSecurityMessage(
        message,
        "Đổi mật khẩu thành công.",
        "success"
    );


    document.getElementById(
        "oldPassword"
    ).value = "";


    document.getElementById(
        "newPassword"
    ).value = "";


    document.getElementById(
        "confirmPassword"
    ).value = "";


    updateSaveButton();

}



/* =====================================================
   MESSAGE
===================================================== */

function showSecurityMessage(
    element,
    text,
    type
) {

    if (!element) {

        return;

    }


    element.textContent =
        text;


    element.className =
        `security-message ${type}`;

}



/* =====================================================
   LOGOUT ALL
===================================================== */

let logoutClickCount = 0;

let logoutTimer = null;


function initLogoutAll() {

    const button =
        document.getElementById(
            "logoutAllButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            logoutClickCount++;


            const text =
                document.getElementById(
                    "logoutAllText"
                );


            /*
               Reset sau 2 giây
            */

            clearTimeout(
                logoutTimer
            );


            logoutTimer =
                setTimeout(
                    () => {

                        logoutClickCount =
                            0;


                        if (text) {

                            text.textContent =
                                "Đăng xuất (Nhấn 5 lần)";

                        }

                    },
                    2000
                );


            /*
               CHƯA ĐỦ 5 LẦN
            */

            if (
                logoutClickCount <
                5
            ) {

                if (text) {

                    text.textContent =
                        `Đăng xuất (${logoutClickCount}/5)`;

                }

                return;

            }


            /*
               ĐỦ 5 LẦN
            */

            logoutAll();

        }
    );

}



/* =====================================================
   LOGOUT ALL ACTION
===================================================== */

function logoutAll() {

    clearTimeout(
        logoutTimer
    );


    const button =
        document.getElementById(
            "logoutAllButton"
        );


    const text =
        document.getElementById(
            "logoutAllText"
        );


    const message =
        document.getElementById(
            "logoutAllMessage"
        );


    /*
       Xóa session local
    */

    try {

        localStorage.removeItem(
            SECURITY_SESSION_KEY
        );

        sessionStorage.removeItem(
            SECURITY_SESSION_KEY
        );

    } catch (error) {

        console.warn(
            "Không thể xóa session:",
            error
        );

    }


    /*
       Nếu auth.js có logout()
    */

    if (
        typeof logout ===
        "function"
    ) {

        try {

            logout();

        } catch (error) {

            console.warn(
                "auth.js logout error:",
                error
            );

        }

    }


    /*
       UI
    */

    if (button) {

        button.classList.add(
            "completed"
        );

    }


    if (text) {

        text.textContent =
            "Đã đăng xuất toàn bộ";

    }


    showSecurityMessage(
        message,
        "Tài khoản đã được đăng xuất khỏi thiết bị này.",
        "success"
    );


    /*
       Về trang chủ sau một khoảng ngắn.
    */

    setTimeout(
        () => {

            window.location.href =
                "index.html";

        },
        1200
    );

}