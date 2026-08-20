"use strict";

const CAPTCHA_WORKER =
    "https://xac-minh.abcd1601ab.workers.dev/api/captcha";


// ======================================================
// VERIFY TURNSTILE
// ======================================================

async function verifyTurnstileToken(token) {

    if (!token) {
        return false;
    }

    try {

        const response =
            await fetch(
                CAPTCHA_WORKER,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        token: token
                    })
                }
            );


        const result =
            await response.json();


        if (result.success === true) {

            return true;

        }


        return false;

    }

    catch (error) {

        console.error(
            "CAPTCHA VERIFY ERROR:",
            error
        );

        return false;

    }

}


// ======================================================
// LOGIN
// ======================================================

window.onLoginTurnstileSuccess =
    async function(token) {

        const verified =
            await verifyTurnstileToken(token);

        if (verified) {

            console.log(
                "Login CAPTCHA: OK"
            );

        }

    };


// ======================================================
// REGISTER
// ======================================================

window.onRegisterTurnstileSuccess =
    async function(token) {

        const verified =
            await verifyTurnstileToken(token);

        if (verified) {

            console.log(
                "Register CAPTCHA: OK"
            );

        }

    };


// ======================================================
// PROMO
// ======================================================

window.onPromoTurnstileSuccess =
    async function(token) {

        const verified =
            await verifyTurnstileToken(token);

        if (verified) {

            console.log(
                "Promo CAPTCHA: OK"
            );

        }

    };


// ======================================================
// EXPIRED
// ======================================================

window.onLoginTurnstileExpired =
window.onRegisterTurnstileExpired =
window.onPromoTurnstileExpired =
function() {

    console.warn(
        "Turnstile đã hết hạn."
    );

};


// ======================================================
// ERROR
// ======================================================

window.onLoginTurnstileError =
window.onRegisterTurnstileError =
window.onPromoTurnstileError =
function() {

    console.warn(
        "Turnstile verification failed."
    );

};
