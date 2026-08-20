"use strict";


/* =====================================================
   PROFILE.JS
   MONFANSUB VIETNAM

   URL PROFILE:

   /profile/uid/5d72f27a-4757-4c02-81a7-1231d81f5d63

   UID dùng để xác định tài khoản.

   Account ID 5 số chỉ dùng để HIỂN THỊ.
===================================================== */


/* =====================================================
   STORAGE KEY
===================================================== */

const PROFILE_USERS_KEY =
    "monfansub_users";

const PROFILE_SESSION_KEY =
    "monfansub_session";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ===============================
           TAB SYSTEM
        =============================== */

        initProfileTabs();


        /* ===============================
           LOAD PROFILE
        =============================== */

        loadProfileUser();

    }
);


/* =====================================================
   TAB SYSTEM
===================================================== */

function initProfileTabs() {

    const tabs =
        document.querySelectorAll(
            ".profile-tab"
        );


    const panels =
        document.querySelectorAll(
            ".profile-panel"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.tab;


                /* -------------------------
                   ACTIVE TAB
                ------------------------- */

                tabs.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                tab.classList.add(
                    "active"
                );


                /* -------------------------
                   ACTIVE PANEL
                ------------------------- */

                panels.forEach(panel => {

                    panel.classList.remove(
                        "active"
                    );

                });


                const targetPanel =
                    document.getElementById(
                        `tab-${target}`
                    );


                if (targetPanel) {

                    targetPanel.classList.add(
                        "active"
                    );

                }

            }
        );

    });

}


/* =====================================================
   GET USERS
===================================================== */

function getProfileUsers() {

    try {

        const data =
            localStorage.getItem(
                PROFILE_USERS_KEY
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
   GET CURRENT SESSION
===================================================== */

function getProfileSession() {

    /*
       Nếu auth.js đã được load,
       ưu tiên sử dụng getSession().
    */

    if (
        typeof getSession ===
        "function"
    ) {

        return getSession();

    }


    /*
       Fallback nếu profile.js
       chạy độc lập.
    */

    try {

        const localSession =
            localStorage.getItem(
                PROFILE_SESSION_KEY
            );


        if (localSession) {

            return JSON.parse(
                localSession
            );

        }


        const sessionStorageData =
            sessionStorage.getItem(
                PROFILE_SESSION_KEY
            );


        if (sessionStorageData) {

            return JSON.parse(
                sessionStorageData
            );

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
   GET UID FROM URL
===================================================== */

function getProfileUIDFromURL() {

    /*
       Hỗ trợ URL:

       /profile/uid/UUID

       hoặc:

       profile/uid/UUID
    */


    const pathname =
        window.location.pathname;


    const match =
        pathname.match(
            /\/profile\/uid\/([^\/?#]+)/i
        );


    if (!match) {

        return null;

    }


    try {

        return decodeURIComponent(
            match[1]
        );

    } catch (error) {

        return match[1];

    }

}


/* =====================================================
   LOAD PROFILE USER
===================================================== */

function loadProfileUser() {

    /*
       Lấy UID từ URL.
    */

    const profileUID =
        getProfileUIDFromURL();


    /*
       Danh sách user.
    */

    const users =
        getProfileUsers();


    let user = null;


    /* =================================================
       TRƯỜNG HỢP 1
       URL CÓ UID

       Ví dụ:

       /profile/uid/
       5d72f27a-4757-4c02-81a7-1231d81f5d63
    ================================================== */

    if (profileUID) {

        user =
            users.find(
                item =>
                    String(
                        item.uid || ""
                    ) === String(
                        profileUID
                    )
            );

    }


    /* =================================================
       TRƯỜNG HỢP 2
       KHÔNG CÓ UID TRONG URL

       Lấy tài khoản hiện tại.
    ================================================== */

    if (!user) {

        const session =
            getProfileSession();


        if (session) {

            /*
               Tìm bằng UID trước.
            */

            if (session.uid) {

                user =
                    users.find(
                        item =>
                            String(
                                item.uid || ""
                            ) === String(
                                session.uid
                            )
                    );

            }


            /*
               Fallback bằng account ID.
            */

            if (
                !user &&
                session.id
            ) {

                user =
                    users.find(
                        item =>
                            String(
                                item.id || ""
                            ) === String(
                                session.id
                            )
                    );

            }


            /*
               Nếu users chưa có
               nhưng session có thông tin,
               dùng session để hiển thị.
            */

            if (!user) {

                user = {
                    uid:
                        session.uid,

                    id:
                        session.id,

                    username:
                        session.username,

                    email:
                        session.email
                };

            }

        }

    }


    /* =================================================
       KHÔNG TÌM THẤY USER
    ================================================== */

    if (!user) {

        showProfileNotFound();

        return;

    }


    /* =================================================
       RENDER PROFILE
    ================================================== */

    renderProfileUser(
        user
    );

}


/* =====================================================
   RENDER PROFILE USER
===================================================== */

function renderProfileUser(
    user
) {


    /* =================================================
       USERNAME
    ================================================= */

    const name =
        user.username ||
        user.name ||
        user.displayName ||
        "User";


    const nameElement =
        document.getElementById(
            "profileName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    /* =================================================
       ACCOUNT ID
       
       Đây là ID 5 số.
       
       KHÔNG phải UID.
    ================================================== */

    let accountId =
        user.id ||
        "00000";


    accountId =
        String(
            accountId
        ).padStart(
            5,
            "0"
        );


    const idElement =
        document.getElementById(
            "profileAccountId"
        );


    if (idElement) {

        idElement.textContent =
            accountId;

    }


    /* =================================================
       BIO
    ================================================== */

    const bio =
        user.bio ||
        "Chưa có thông tin giới thiệu.";


    const bioElement =
        document.getElementById(
            "profileBio"
        );


    if (bioElement) {

        bioElement.textContent =
            bio;

    }


    /* =================================================
       AVATAR
    ================================================== */

    const avatar =
        user.avatar ||
        user.photoURL ||
        user.photoUrl ||
        user.avatarUrl;


    const avatarElement =
        document.getElementById(
            "profileAvatar"
        );


    if (
        avatarElement &&
        avatar
    ) {

        avatarElement.src =
            avatar;

    }


    /* =================================================
       COVER
    ================================================== */

    const cover =
        user.cover ||
        user.coverImage ||
        user.coverPhoto ||
        user.coverUrl;


    const coverElement =
        document.getElementById(
            "profileCoverImage"
        );


    if (
        coverElement &&
        cover
    ) {

        coverElement.src =
            cover;

    }


    /* =================================================
       JOIN DATE
    ================================================== */

    const joinDate =
        user.createdAt ||
        user.created_at ||
        user.joinDate;


    const joinDateElement =
        document.getElementById(
            "profileJoinDate"
        );


    if (
        joinDateElement &&
        joinDate
    ) {

        joinDateElement.textContent =
            formatProfileDate(
                joinDate
            );

    }


    /* =================================================
       WATCHED COUNT
    ================================================== */

    const watched =
        Array.isArray(
            user.watched
        )
            ? user.watched.length
            : Number(
                user.watchedCount ||
                0
            );


    const watchedElement =
        document.getElementById(
            "profileWatchedCount"
        );


    if (watchedElement) {

        watchedElement.textContent =
            `${watched} bộ phim`;

    }


    /* =================================================
       FAVORITE COUNT
    ================================================= */

    const favorites =
        Array.isArray(
            user.favorites
        )
            ? user.favorites.length
            : Number(
                user.favoriteCount ||
                user.favoritesCount ||
                0
            );


    const favoriteElement =
        document.getElementById(
            "profileFavoriteCount"
        );


    if (favoriteElement) {

        favoriteElement.textContent =
            `${favorites} bộ phim`;

    }


    /* =================================================
       FOLLOWING COUNT
    ================================================= */

    const following =
        Array.isArray(
            user.following
        )
            ? user.following.length
            : Number(
                user.followingCount ||
                0
            );


    const followingElement =
        document.getElementById(
            "profileFollowingCount"
        );


    if (followingElement) {

        followingElement.textContent =
            `${following} người`;

    }


    /* =================================================
       UPDATE PAGE TITLE
    ================================================= */

    document.title =
        `${name} - MonFansub Vietnam`;


    /* =================================================
       PROFILE UID
       
       Lưu UID hiện tại vào body.
       Các script khác có thể sử dụng.
    ================================================= */

    if (user.uid) {

        document.body.dataset.profileUid =
            String(
                user.uid
            );

    }


    /* =================================================
       PROFILE ACCOUNT ID
    ================================================= */

    if (user.id) {

        document.body.dataset.profileId =
            String(
                user.id
            );

    }

}


/* =====================================================
   PROFILE NOT FOUND
===================================================== */

function showProfileNotFound() {

    const nameElement =
        document.getElementById(
            "profileName"
        );


    if (nameElement) {

        nameElement.textContent =
            "Không tìm thấy tài khoản";

    }


    const idElement =
        document.getElementById(
            "profileAccountId"
        );


    if (idElement) {

        idElement.textContent =
            "—";

    }


    const bioElement =
        document.getElementById(
            "profileBio"
        );


    if (bioElement) {

        bioElement.textContent =
            "Tài khoản này không tồn tại hoặc UID không hợp lệ.";

    }


    const joinDateElement =
        document.getElementById(
            "profileJoinDate"
        );


    if (joinDateElement) {

        joinDateElement.textContent =
            "—";

    }


    document.title =
        "Không tìm thấy tài khoản - MonFansub Vietnam";

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatProfileDate(
    value
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}