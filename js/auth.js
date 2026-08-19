"use strict";


/* =====================================================
   AUTH STORAGE
===================================================== */

const USERS_KEY = "monfansub_users";
const SESSION_KEY = "monfansub_session";


/* =====================================================
   GET USERS
===================================================== */

function getUsers() {

    try {

        const data =
            localStorage.getItem(
                USERS_KEY
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
            "Không thể đọc danh sách tài khoản:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE USERS
===================================================== */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =====================================================
   GENERATE 5 DIGIT ACCOUNT ID
===================================================== */

function generateAccountId() {

    const users =
        getUsers();

    const usedIds =
        new Set();


    users.forEach(user => {

        const id =
            String(
                user.id || ""
            );


        if (
            /^\d{5}$/.test(id)
        ) {

            usedIds.add(id);

        }

    });


    for (
        let i = 1;
        i <= 99999;
        i++
    ) {

        const id =
            String(i).padStart(
                5,
                "0"
            );


        if (
            !usedIds.has(id)
        ) {

            return id;

        }

    }


    throw new Error(
        "Đã đạt giới hạn 99999 tài khoản."
    );

}


/* =====================================================
   GENERATE UID
===================================================== */

function generateUID() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
        "function"
    ) {

        return window.crypto.randomUUID();

    }


    /* =============================================
       FALLBACK UUID
    ============================================= */

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(
            /[xy]/g,
            function (c) {

                const r =
                    Math.random() * 16 | 0;

                const v =
                    c === "x"
                        ? r
                        : (
                            r & 0x3 |
                            0x8
                        );

                return v.toString(16);

            }
        );

}


/* =====================================================
   MIGRATE OLD USERS
===================================================== */

function migrateUsers() {

    const users =
        getUsers();


    if (!users.length) {

        return;

    }


    let changed =
        false;


    const usedIds =
        new Set();


    /* =============================================
       ĐÁNH DẤU CÁC ID 5 SỐ ĐÃ CÓ
    ============================================= */

    users.forEach(user => {

        if (
            /^\d{5}$/.test(
                String(
                    user.id || ""
                )
            )
        ) {

            usedIds.add(
                String(user.id)
            );

        }

    });


    /* =============================================
       MIGRATE
    ============================================= */

    users.forEach(user => {


        /* =========================================
           ID CŨ LÀ UUID
        ========================================= */

        if (
            user.id &&
            !/^\d{5}$/.test(
                String(user.id)
            )
        ) {

            /*
             * UUID cũ được giữ làm UID
             */

            if (!user.uid) {

                user.uid =
                    String(user.id);

                changed =
                    true;

            }


            /*
             * Tạo ID 5 số mới
             */

            let newId =
                null;


            for (
                let i = 1;
                i <= 99999;
                i++
            ) {

                const candidate =
                    String(i).padStart(
                        5,
                        "0"
                    );


                if (
                    !usedIds.has(
                        candidate
                    )
                ) {

                    newId =
                        candidate;

                    usedIds.add(
                        candidate
                    );

                    break;

                }

            }


            if (newId) {

                user.id =
                    newId;

                changed =
                    true;

            }

        }


        /* =========================================
           CHƯA CÓ UID
        ========================================= */

        if (!user.uid) {

            user.uid =
                generateUID();

            changed =
                true;

        }


        /* =========================================
           CHƯA CÓ ID
        ========================================= */

        if (
            !user.id ||
            !/^\d{5}$/.test(
                String(user.id)
            )
        ) {

            let newId =
                null;


            for (
                let i = 1;
                i <= 99999;
                i++
            ) {

                const candidate =
                    String(i).padStart(
                        5,
                        "0"
                    );


                if (
                    !usedIds.has(
                        candidate
                    )
                ) {

                    newId =
                        candidate;

                    usedIds.add(
                        candidate
                    );

                    break;

                }

            }


            if (newId) {

                user.id =
                    newId;

                changed =
                    true;

            }

        }

    });


    if (changed) {

        saveUsers(users);

    }

}


/* =====================================================
   REGISTER
===================================================== */

function registerUser(
    username,
    email,
    password
) {

    const users =
        getUsers();


    const normalizedUsername =
        String(username || "")
            .trim()
            .toLowerCase();


    const normalizedEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    /* =============================================
       CHECK EXIST
    ============================================= */

    const exists =
        users.some(user => {

            const userName =
                String(
                    user.username || ""
                )
                    .trim()
                    .toLowerCase();


            const userEmail =
                String(
                    user.email || ""
                )
                    .trim()
                    .toLowerCase();


            return (
                userName ===
                normalizedUsername
            )
            ||
            (
                userEmail ===
                normalizedEmail
            );

        });


    if (exists) {

        return {

            success: false,

            message:
                "Tên tài khoản hoặc email đã tồn tại."

        };

    }


    /* =============================================
       ACCOUNT ID
    ============================================= */

    let accountId;


    try {

        accountId =
            generateAccountId();

    } catch (error) {

        return {

            success: false,

            message:
                error.message

        };

    }


    /* =============================================
       UID
    ============================================= */

    const uid =
        generateUID();


    /* =============================================
       CREATE USER
    ============================================= */

    const user = {

        id:
            accountId,

        uid:
            uid,

        username:
            String(username)
                .trim(),

        email:
            String(email)
                .trim(),

        password:
            password,

        createdAt:
            new Date().toISOString()

    };


    users.push(user);

    saveUsers(users);


    return {

        success: true,

        message:
            "Đăng ký thành công.",

        user:
            user

    };

}


/* =====================================================
   LOGIN
===================================================== */

function loginUser(
    username,
    password
) {

    const users =
        getUsers();


    const keyword =
        String(username || "")
            .trim()
            .toLowerCase();


    const user =
        users.find(user => {

            const userName =
                String(
                    user.username || ""
                )
                    .trim()
                    .toLowerCase();


            const userEmail =
                String(
                    user.email || ""
                )
                    .trim()
                    .toLowerCase();


            return (

                (
                    userName ===
                    keyword

                    ||

                    userEmail ===
                    keyword
                )

                &&

                user.password ===
                password

            );

        });


    /* =============================================
       LOGIN FAIL
    ============================================= */

    if (!user) {

        return {

            success: false,

            message:
                "Tài khoản hoặc mật khẩu không chính xác."

        };

    }


    /* =============================================
       ĐẢM BẢO UID
    ============================================= */

    if (!user.uid) {

        user.uid =
            generateUID();

    }


    /* =============================================
       ĐẢM BẢO ID 5 SỐ
    ============================================= */

    if (
        !/^\d{5}$/.test(
            String(
                user.id || ""
            )
        )
    ) {

        const used =
            new Set(

                users
                    .filter(u =>
                        /^\d{5}$/.test(
                            String(
                                u.id || ""
                            )
                        )
                    )
                    .map(u =>
                        String(
                            u.id
                        )
                    )

            );


        let newId =
            null;


        for (
            let i = 1;
            i <= 99999;
            i++
        ) {

            const candidate =
                String(i).padStart(
                    5,
                    "0"
                );


            if (
                !used.has(candidate)
            ) {

                newId =
                    candidate;

                break;

            }

        }


        if (newId) {

            user.id =
                newId;

        }

    }


    /* =============================================
       SAVE USER
    ============================================= */

    saveUsers(users);


    return {

        success: true,

        user:
            user

    };

}


/* =====================================================
   CREATE SESSION
===================================================== */

function createSession(
    user,
    remember
) {

    if (!user) {

        return;

    }


    const session = {

        /* ID 5 số */

        id:
            String(
                user.id || ""
            )
                .padStart(
                    5,
                    "0"
                ),


        /* UID */

        uid:
            String(
                user.uid || ""
            ),


        username:
            user.username || "",


        email:
            user.email || "",


        loginAt:
            Date.now(),


        remember:
            Boolean(remember)

    };


    /* =============================================
       XÓA SESSION CŨ TRƯỚC KHI TẠO SESSION MỚI
    ============================================= */

    localStorage.removeItem(
        SESSION_KEY
    );

    sessionStorage.removeItem(
        SESSION_KEY
    );


    /* =============================================
       LƯU SESSION
    ============================================= */

    const storage =
        remember
            ? localStorage
            : sessionStorage;


    storage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );

}


/* =====================================================
   GET SESSION
===================================================== */

function getSession() {

    try {

        /* =============================================
           LOCAL STORAGE
        ============================================= */

        const local =
            localStorage.getItem(
                SESSION_KEY
            );


        if (local) {

            const session =
                JSON.parse(local);


            return normalizeSession(
                session
            );

        }


        /* =============================================
           SESSION STORAGE
        ============================================= */

        const sessionData =
            sessionStorage.getItem(
                SESSION_KEY
            );


        if (sessionData) {

            const session =
                JSON.parse(
                    sessionData
                );


            return normalizeSession(
                session
            );

        }

    } catch (error) {

        console.warn(
            "SESSION ERROR:",
            error
        );

    }


    return null;

}


/* =====================================================
   NORMALIZE SESSION
===================================================== */

function normalizeSession(
    session
) {

    if (!session) {

        return null;

    }


    const users =
        getUsers();


    /* =============================================
       SESSION CŨ DÙNG UUID LÀM ID
    ============================================= */

    if (
        session.id &&
        !/^\d{5}$/.test(
            String(
                session.id
            )
        )
    ) {

        const user =
            users.find(u => {

                return (
                    String(
                        u.uid || ""
                    ) ===
                    String(
                        session.id
                    )
                );

            });


        if (user) {

            session.uid =
                user.uid ||
                session.id;


            session.id =
                String(
                    user.id || ""
                )
                    .padStart(
                        5,
                        "0"
                    );

        }

    }


    /* =============================================
       SESSION CHƯA CÓ UID
    ============================================= */

    if (!session.uid) {

        const user =
            users.find(u => {

                return (
                    String(
                        u.id || ""
                    ) ===
                    String(
                        session.id || ""
                    )
                );

            });


        if (user) {

            session.uid =
                user.uid;

        }

    }


    /* =============================================
       SESSION CHƯA CÓ ID
    ============================================= */

    if (!session.id) {

        const user =
            users.find(u => {

                return (
                    String(
                        u.uid || ""
                    ) ===
                    String(
                        session.uid || ""
                    )
                );

            });


        if (user) {

            session.id =
                String(
                    user.id || ""
                )
                    .padStart(
                        5,
                        "0"
                    );

        }

    }


    /* =============================================
       ĐẢM BẢO ID LUÔN 5 SỐ
    ============================================= */

    if (
        session.id &&
        /^\d+$/.test(
            String(
                session.id
            )
        ) &&
        !/^\d{5}$/.test(
            String(
                session.id
            )
        )
    ) {

        session.id =
            String(
                session.id
            )
                .padStart(
                    5,
                    "0"
                );

    }


    return session;

}


/* =====================================================
   CLEAR SESSION
===================================================== */

function clearSession() {

    localStorage.removeItem(
        SESSION_KEY
    );


    sessionStorage.removeItem(
        SESSION_KEY
    );

}


/* =====================================================
   SHOW LOGIN MODAL
===================================================== */

function showLoginModal() {

    const loginModal =
        document.getElementById(
            "loginModal"
        );


    if (!loginModal) {

        return;

    }


    loginModal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open"
    );


    /* =============================================
       FOCUS INPUT
    ============================================= */

    setTimeout(() => {

        const input =
            document.getElementById(
                "loginUsername"
            );


        if (input) {

            input.focus();

        }

    }, 100);

}


/* =====================================================
   HIDE LOGIN MODAL
===================================================== */

function hideLoginModal() {

    const loginModal =
        document.getElementById(
            "loginModal"
        );


    if (!loginModal) {

        return;

    }


    loginModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =====================================================
   SHOW REGISTER MODAL
===================================================== */

function showRegisterModal() {

    const registerModal =
        document.getElementById(
            "registerModal"
        );


    if (!registerModal) {

        return;

    }


    registerModal.classList.add(
        "show"
    );


    document.body.classList.add(
        "modal-open"
    );


    setTimeout(() => {

        const input =
            document.getElementById(
                "registerUsername"
            );


        if (input) {

            input.focus();

        }

    }, 100);

}


/* =====================================================
   HIDE REGISTER MODAL
===================================================== */

function hideRegisterModal() {

    const registerModal =
        document.getElementById(
            "registerModal"
        );


    if (!registerModal) {

        return;

    }


    registerModal.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =====================================================
   LOGIN MODAL
===================================================== */

function initLoginModal() {

    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const loginModal =
        document.getElementById(
            "loginModal"
        );


    const closeLogin =
        document.getElementById(
            "closeLogin"
        );


    const openRegister =
        document.getElementById(
            "openRegister"
        );


    /* =============================================
       NÚT AVATAR / ĐĂNG NHẬP
    ============================================= */

    if (
        loginButton &&
        loginModal
    ) {

        loginButton.addEventListener(
            "click",
            event => {

                /*
                 * QUAN TRỌNG:
                 * Chặn trình duyệt submit
                 * hoặc thêm dấu ?
                 */

                event.preventDefault();

                event.stopPropagation();


                showLoginModal();

            }
        );

    }


    /* =============================================
       ĐÓNG LOGIN
    ============================================= */

    if (closeLogin) {

        closeLogin.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                hideLoginModal();

            }
        );

    }


    /* =============================================
       CLICK RA NGOÀI LOGIN
    ============================================= */

    if (loginModal) {

        loginModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    loginModal
                ) {

                    hideLoginModal();

                }

            }
        );

    }


    /* =============================================
       MỞ REGISTER
    ============================================= */

    if (openRegister) {

        openRegister.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                hideLoginModal();

                showRegisterModal();

            }
        );

    }

}


/* =====================================================
   REGISTER MODAL
===================================================== */

function initRegisterModal() {

    const registerModal =
        document.getElementById(
            "registerModal"
        );


    const closeRegister =
        document.getElementById(
            "closeRegister"
        );


    const openLogin =
        document.getElementById(
            "openLogin"
        );


    /* =============================================
       ĐÓNG REGISTER
    ============================================= */

    if (closeRegister) {

        closeRegister.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                hideRegisterModal();

            }
        );

    }


    /* =============================================
       CLICK RA NGOÀI
    ============================================= */

    if (registerModal) {

        registerModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    registerModal
                ) {

                    hideRegisterModal();

                }

            }
        );

    }


    /* =============================================
       MỞ LOGIN
    ============================================= */

    if (openLogin) {

        openLogin.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                hideRegisterModal();

                showLoginModal();

            }
        );

    }

}


/* =====================================================
   LOGIN FORM
===================================================== */

function initLoginForm() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (!loginForm) {

        return;

    }


    loginForm.addEventListener(
        "submit",
        event => {

            /*
             * QUAN TRỌNG NHẤT:
             *
             * Không cho form submit mặc định.
             *
             * Nếu thiếu dòng này:
             *
             * index.html?
             *
             * sẽ xuất hiện.
             */

            event.preventDefault();

            event.stopPropagation();


            const usernameInput =
                document.getElementById(
                    "loginUsername"
                );


            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );


            const rememberInput =
                document.getElementById(
                    "rememberLogin"
                );


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const username =
                usernameInput
                    ? usernameInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            const remember =
                rememberInput
                    ? rememberInput.checked
                    : false;


            /* =========================================
               KIỂM TRA INPUT
            ========================================= */

            if (
                !username ||
                !password
            ) {

                if (message) {

                    message.textContent =
                        "Vui lòng nhập đầy đủ tài khoản và mật khẩu.";

                    message.className =
                        "auth-message error";

                }

                return;

            }


            /* =========================================
               LOGIN
            ========================================= */

            const result =
                loginUser(
                    username,
                    password
                );


            /* =========================================
               LOGIN FAIL
            ========================================= */

            if (
                !result ||
                !result.success
            ) {

                if (message) {

                    message.textContent =
                        result &&
                        result.message
                            ? result.message
                            : "Đăng nhập thất bại.";

                    message.className =
                        "auth-message error";

                }

                return;

            }


            /* =========================================
               CREATE SESSION
            ========================================= */

            createSession(
                result.user,
                remember
            );


            /* =========================================
               SUCCESS MESSAGE
            ========================================= */

            if (message) {

                message.textContent =
                    "Đăng nhập thành công.";

                message.className =
                    "auth-message success";

            }


            /* =========================================
               ĐÓNG MODAL
            ========================================= */

            hideLoginModal();


            /* =========================================
               UPDATE ACCOUNT UI
            ========================================= */

            if (
                typeof updateAccountUI ===
                "function"
            ) {

                updateAccountUI();

            }


            /* =========================================
               RESET FORM
            ========================================= */

            loginForm.reset();


            /* =========================================
               KHÔNG RELOAD TRANG
            ========================================= */

        }
    );

}


/* =====================================================
   REGISTER FORM
===================================================== */

function initRegisterForm() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (!registerForm) {

        return;

    }


    registerForm.addEventListener(
        "submit",
        event => {

            /*
             * Chặn form reload trang
             */

            event.preventDefault();

            event.stopPropagation();


            const usernameInput =
                document.getElementById(
                    "registerUsername"
                );


            const emailInput =
                document.getElementById(
                    "registerEmail"
                );


            const passwordInput =
                document.getElementById(
                    "registerPassword"
                );


            const password2Input =
                document.getElementById(
                    "registerPassword2"
                );


            const message =
                document.getElementById(
                    "registerMessage"
                );


            const username =
                usernameInput
                    ? usernameInput.value.trim()
                    : "";


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const password =
                passwordInput
                    ? passwordInput.value
                    : "";


            const password2 =
                password2Input
                    ? password2Input.value
                    : "";


            /* =========================================
               CHECK PASSWORD
            ========================================= */

            if (
                password !==
                password2
            ) {

                if (message) {

                    message.textContent =
                        "Mật khẩu nhập lại không khớp.";

                    message.className =
                        "auth-message error";

                }

                return;

            }


            /* =========================================
               REGISTER
            ========================================= */

            const result =
                registerUser(
                    username,
                    email,
                    password
                );


            /* =========================================
               REGISTER FAIL
            ========================================= */

            if (
                !result ||
                !result.success
            ) {

                if (message) {

                    message.textContent =
                        result &&
                        result.message
                            ? result.message
                            : "Đăng ký thất bại.";

                    message.className =
                        "auth-message error";

                }

                return;

            }


            /* =========================================
               THÔNG BÁO
            ========================================= */

            if (message) {

                message.textContent =
                    "Tạo tài khoản thành công. Hãy đăng nhập.";

                message.className =
                    "auth-message success";

            }


            /* =========================================
               RESET FORM
            ========================================= */

            registerForm.reset();


            /* =========================================
               CHUYỂN SANG LOGIN
            ========================================= */

            setTimeout(() => {

                hideRegisterModal();

                showLoginModal();

            }, 700);

        }
    );

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function initPasswordToggle() {

    const buttons =
        document.querySelectorAll(
            ".password-toggle"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const targetId =
                    button.dataset.target;


                if (!targetId) {

                    return;

                }


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


                    button.setAttribute(
                        "aria-label",
                        "Ẩn mật khẩu"
                    );


                    if (icon) {

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );

                    }

                } else {

                    input.type =
                        "password";


                    button.setAttribute(
                        "aria-label",
                        "Hiện mật khẩu"
                    );


                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );

                    }

                }

            }
        );

    });

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

function initForgotPassword() {

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (!forgotPassword) {

        return;

    }


    forgotPassword.addEventListener(
        "click",
        event => {

            /*
             * Chặn href="#"
             *
             * Nếu không có dòng này:
             *
             * index.html#
             *
             * có thể xuất hiện trên URL.
             */

            event.preventDefault();

            event.stopPropagation();


            alert(
                "Tính năng quên mật khẩu sẽ được cập nhật sau."
            );

        }
    );

}


/* =====================================================
   ESC KEY
===================================================== */

function initAuthEscape() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            hideLoginModal();

            hideRegisterModal();

        }
    );

}

/* =====================================================
   PUBLIC PROFILE
   TÌM USER THEO UID
===================================================== */

/**
 * Lấy user theo UID.
 *
 * QUAN TRỌNG:
 * Không dùng session ở đây.
 *
 * URL profile của ai thì tìm user của người đó.
 */
function getUserByUID(uid) {

    const targetUID =
        String(uid || "").trim();


    if (!targetUID) {

        return null;

    }


    const users =
        getUsers();


    const user =
        users.find(user => {

            return (
                String(
                    user.uid || ""
                ).trim() ===
                targetUID
            );

        });


    return user || null;

}


/* =====================================================
   PUBLIC USER
   DÙNG CHO PROFILE CÔNG KHAI
===================================================== */

function getPublicUserByUID(uid) {

    const user =
        getUserByUID(uid);


    if (!user) {

        return null;

    }


    /*
     * Không trả password ra profile.
     */
    return {

        uid:
            String(
                user.uid || ""
            ),

        id:
            String(
                user.id || ""
            ).padStart(
                5,
                "0"
            ),

        username:
            user.username || "User",

        email:
            user.email || "",

        createdAt:
            user.createdAt || "",

        avatar:
            user.avatar || "",

        cover:
            user.cover || "",

        bio:
            user.bio || "",

        watchedCount:
            Number(
                user.watchedCount || 0
            ),

        favoriteCount:
            Number(
                user.favoriteCount || 0
            ),

        followingCount:
            Number(
                user.followingCount || 0
            )

    };

}

/* =====================================================
   START AUTH
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Migrate tài khoản cũ
         */

        migrateUsers();


        /*
         * Login modal
         */

        initLoginModal();


        /*
         * Register modal
         */

        initRegisterModal();


        /*
         * Login form
         */

        initLoginForm();


        /*
         * Register form
         */

        initRegisterForm();


        /*
         * Hiện / ẩn mật khẩu
         */

        initPasswordToggle();


        /*
         * Quên mật khẩu
         */

        initForgotPassword();


        /*
         * ESC đóng modal
         */

        initAuthEscape();

    }
);