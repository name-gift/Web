"use strict";


/* =====================================================
   SETTING.JS
   MONFANSUB VIETNAM

   ACCOUNT SETTINGS
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

const SETTING_USERS_KEY =
    "monfansub_users";

const SETTING_SESSION_KEY =
    "monfansub_session";


const SETTING_OPTIONS_KEY =
    "monfansub_settings";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSettingAccount();

        initSettingOptions();

        initBackTop();

        initProfileLink();

    }
);


/* =====================================================
   GET USERS
===================================================== */

function getSettingUsers() {

    try {

        const data =
            localStorage.getItem(
                SETTING_USERS_KEY
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
   GET SESSION
===================================================== */

function getSettingSession() {

    /*
       Nếu auth.js đã có getSession()
       thì ưu tiên sử dụng.
    */

    if (
        typeof getSession ===
        "function"
    ) {

        try {

            return getSession();

        } catch (error) {

            console.warn(
                "getSession() lỗi:",
                error
            );

        }

    }


    /*
       Fallback localStorage.
    */

    try {

        const localData =
            localStorage.getItem(
                SETTING_SESSION_KEY
            );


        if (localData) {

            return JSON.parse(
                localData
            );

        }


        const sessionData =
            sessionStorage.getItem(
                SETTING_SESSION_KEY
            );


        if (sessionData) {

            return JSON.parse(
                sessionData
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
   FIND CURRENT USER
===================================================== */

function getCurrentSettingUser() {

    const session =
        getSettingSession();


    if (!session) {

        return null;

    }


    const users =
        getSettingUsers();


    let user = null;


    /* -------------------------------------------------
       FIND BY UID
    ------------------------------------------------- */

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


    /* -------------------------------------------------
       FIND BY ACCOUNT ID
    ------------------------------------------------- */

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


    /* -------------------------------------------------
       FALLBACK SESSION
    ------------------------------------------------- */

    if (!user) {

        user = {
            uid:
                session.uid,

            id:
                session.id,

            username:
                session.username,

            email:
                session.email,

            provider:
                session.provider,

            createdAt:
                session.createdAt,

            verified:
                session.verified
        };

    }


    return user;

}


/* =====================================================
   LOAD ACCOUNT
===================================================== */

function loadSettingAccount() {

    const user =
        getCurrentSettingUser();


    if (!user) {

        renderSettingLoggedOut();

        return;

    }


    /* -------------------------------------------------
       ACCOUNT ID
    ------------------------------------------------- */

    let accountId =
        user.id ||
        "—";


    if (
        accountId !== "—"
    ) {

        accountId =
            String(
                accountId
            ).padStart(
                5,
                "0"
            );

    }


    const accountIdElement =
        document.getElementById(
            "settingAccountId"
        );


    if (accountIdElement) {

        accountIdElement.textContent =
            accountId;

    }


    /* -------------------------------------------------
       EMAIL
    ------------------------------------------------- */

    const emailElement =
        document.getElementById(
            "settingEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            user.email ||
            "—";

    }


    /* -------------------------------------------------
       PROVIDER
    ------------------------------------------------- */

    const providerElement =
        document.getElementById(
            "settingProvider"
        );


    if (providerElement) {

        providerElement.textContent =
            getProviderName(
                user
            );

    }


    /* -------------------------------------------------
       JOIN DATE
    ------------------------------------------------- */

    const joinDate =
        user.createdAt ||
        user.created_at ||
        user.joinDate;


    const joinDateElement =
        document.getElementById(
            "settingJoinDate"
        );


    if (joinDateElement) {

        joinDateElement.textContent =
            joinDate
                ? formatSettingDate(
                    joinDate
                )
                : "—";

    }


    /* -------------------------------------------------
       VERIFIED
    ------------------------------------------------- */

    const verifiedElement =
        document.getElementById(
            "settingVerified"
        );


    if (verifiedElement) {

        const verified =
            user.verified === true ||
            user.isVerified === true ||
            user.verified === "true";


        verifiedElement.textContent =
            verified
                ? "Có"
                : "Không";

        verifiedElement.classList.toggle(
            "is-verified",
            verified
        );

    }

}


/* =====================================================
   PROVIDER NAME
===================================================== */

function getProviderName(
    user
) {

    const provider =
        String(
            user.provider ||
            user.authProvider ||
            user.loginProvider ||
            ""
        ).toLowerCase();


    if (
        provider.includes("google")
    ) {

        return "Google";

    }


    if (
        provider.includes("facebook")
    ) {

        return "Facebook";

    }


    if (
        provider.includes("github")
    ) {

        return "GitHub";

    }


    if (
        provider.includes("apple")
    ) {

        return "Apple";

    }


    return "MonFansub";

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatSettingDate(
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

        return String(
            value
        );

    }


    /*
       Hiển thị:

       23:41:38 20/6/2024

       nếu dữ liệu là Date hợp lệ.
    */

    const time =
        date.toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    const day =
        date.getDate();


    const month =
        date.getMonth() + 1;


    const year =
        date.getFullYear();


    return `${time} ${day}/${month}/${year}`;

}


/* =====================================================
   LOGGED OUT
===================================================== */

function renderSettingLoggedOut() {

    const accountId =
        document.getElementById(
            "settingAccountId"
        );


    const email =
        document.getElementById(
            "settingEmail"
        );


    const provider =
        document.getElementById(
            "settingProvider"
        );


    const joinDate =
        document.getElementById(
            "settingJoinDate"
        );


    const verified =
        document.getElementById(
            "settingVerified"
        );


    if (accountId) {

        accountId.textContent =
            "—";

    }


    if (email) {

        email.textContent =
            "Chưa đăng nhập";

    }


    if (provider) {

        provider.textContent =
            "—";

    }


    if (joinDate) {

        joinDate.textContent =
            "—";

    }


    if (verified) {

        verified.textContent =
            "—";

    }

}


/* =====================================================
   SETTINGS STORAGE
===================================================== */

function getSettingOptions() {

    try {

        const data =
            localStorage.getItem(
                SETTING_OPTIONS_KEY
            );


        if (!data) {

            return {};

        }


        const settings =
            JSON.parse(data);


        return (
            settings &&
            typeof settings === "object"
        )
            ? settings
            : {};

    } catch (error) {

        return {};

    }

}


/* =====================================================
   SAVE SETTINGS
===================================================== */

function saveSettingOptions(
    settings
) {

    try {

        localStorage.setItem(
            SETTING_OPTIONS_KEY,
            JSON.stringify(
                settings
            )
        );

    } catch (error) {

        console.warn(
            "Không thể lưu cài đặt:",
            error
        );

    }

}


/* =====================================================
   INIT SETTING OPTIONS
===================================================== */

function initSettingOptions() {

    const settings =
        getSettingOptions();


    const reduceEffects =
        document.getElementById(
            "reduceEffectsToggle"
        );


    const boldText =
        document.getElementById(
            "boldTextToggle"
        );


    const popupPlayer =
        document.getElementById(
            "popupPlayerToggle"
        );


    const skipIntro =
        document.getElementById(
            "skipIntroToggle"
        );


    /* -------------------------------------------------
       LOAD
    ------------------------------------------------- */

    if (reduceEffects) {

        reduceEffects.checked =
            settings.reduceEffects === true;

    }


    if (boldText) {

        boldText.checked =
            settings.boldText === true;

    }


    if (popupPlayer) {

        popupPlayer.checked =
            settings.popupPlayer === true;

    }


    if (skipIntro) {

        skipIntro.checked =
            settings.skipIntro === true;

    }


    /* -------------------------------------------------
       CHANGE EVENTS
    ------------------------------------------------- */

    if (reduceEffects) {

        reduceEffects.addEventListener(
            "change",
            () => {

                settings.reduceEffects =
                    reduceEffects.checked;


                saveSettingOptions(
                    settings
                );


                applySettingEffects(
                    settings
                );

            }
        );

    }


    if (boldText) {

        boldText.addEventListener(
            "change",
            () => {

                settings.boldText =
                    boldText.checked;


                saveSettingOptions(
                    settings
                );


                applySettingEffects(
                    settings
                );

            }
        );

    }


    if (popupPlayer) {

        popupPlayer.addEventListener(
            "change",
            () => {

                settings.popupPlayer =
                    popupPlayer.checked;


                saveSettingOptions(
                    settings
                );

                applySettingEffects(
                    settings
                );

            }
        );

    }


    if (skipIntro) {

        skipIntro.addEventListener(
            "change",
            () => {

                settings.skipIntro =
                    skipIntro.checked;


                saveSettingOptions(
                    settings
                );

            }
        );

    }


    /* -------------------------------------------------
       APPLY ON LOAD
    ------------------------------------------------- */

    applySettingEffects(
        settings
    );

}


/* =====================================================
   APPLY SETTINGS
===================================================== */

function applySettingEffects(
    settings
) {

    /* -------------------------------------------------
       REDUCE EFFECTS
    ------------------------------------------------- */

    document.body.classList.toggle(
        "reduce-effects",
        settings.reduceEffects === true
    );


    /* -------------------------------------------------
       BOLD TEXT
    ------------------------------------------------- */

    document.body.classList.toggle(
        "bold-text",
        settings.boldText === true
    );


    /* -------------------------------------------------
       POPUP PLAYER
       
       Các player khác có thể kiểm tra:
       
       body.classList.contains(
           "popup-player-disabled"
       )
    ------------------------------------------------- */

    document.body.classList.toggle(
        "popup-player-disabled",
        settings.popupPlayer === true
    );

}


/* =====================================================
   PROFILE LINK
===================================================== */

function initProfileLink() {

    const link =
        document.getElementById(
            "personalInfoLink"
        );


    if (!link) {

        return;

    }


    const user =
        getCurrentSettingUser();


    if (
        user &&
        user.uid
    ) {

        link.href =
            `profile/uid/${encodeURIComponent(
                user.uid
            )}`;

    } else {

        link.href =
            "profile.html";

    }

}


/* =====================================================
   BACK TO TOP
===================================================== */

function initBackTop() {

    const button =
        document.getElementById(
            "backTop"
        );


    if (!button) {

        return;

    }


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY >
                400
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        },
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            );

        }
    );

}