"use strict";

/* =====================================================
   MONFANSUB - TURNSTILE VERIFY
===================================================== */

const TURNSTILE_VERIFY_API =
  "https://xac-minh.abcd1601ab.workers.dev/api/captcha";


/* =====================================================
   TRẠNG THÁI
===================================================== */

let turnstileWidgetId = null;
let turnstileToken = null;


/* =====================================================
   KHỞI TẠO TURNSTILE
===================================================== */

function initTurnstile() {

  const container =
    document.querySelector(
      "#turnstileWidget"
    );

  if (!container) {

    console.warn(
      "Không tìm thấy #turnstileWidget."
    );

    return;

  }


  /* Chờ Cloudflare Turnstile */

  if (
    typeof turnstile ===
    "undefined"
  ) {

    setTimeout(
      initTurnstile,
      300
    );

    return;

  }


  /* Nếu đã render rồi thì không render lại */

  if (
    turnstileWidgetId !== null
  ) {

    return;

  }


  try {

    turnstileWidgetId =
      turnstile.render(
        container,
        {

          sitekey:
            container.dataset.sitekey,

          language:
            "vi",

          callback:
            function(token) {

              turnstileToken =
                token;


              container.dataset.verified =
                "true";


              document.dispatchEvent(
                new CustomEvent(
                  "turnstileVerified",
                  {
                    detail: {
                      token: token
                    }
                  }
                )
              );

            },


          "expired-callback":
            function() {

              turnstileToken =
                null;


              container.dataset.verified =
                "false";


              document.dispatchEvent(
                new Event(
                  "turnstileExpired"
                )
              );

            },


          "error-callback":
            function(error) {

              turnstileToken =
                null;


              container.dataset.verified =
                "false";


              console.error(
                "Turnstile error:",
                error
              );


              document.dispatchEvent(
                new CustomEvent(
                  "turnstileError",
                  {
                    detail: {
                      error: error
                    }
                  }
                )
              );

            }

        }
      );

  }

  catch (error) {

    console.error(
      "Không thể khởi tạo Turnstile:",
      error
    );

  }

}


/* =====================================================
   LẤY TOKEN
===================================================== */

function getTurnstileToken() {

  return turnstileToken;

}


/* =====================================================
   XÁC MINH VỚI WORKER
===================================================== */

async function verifyTurnstile() {

  const token =
    getTurnstileToken();


  if (!token) {

    return {

      success: false,

      message:
        "Vui lòng hoàn thành CAPTCHA."

    };

  }


  try {

    const response =
      await fetch(
        TURNSTILE_VERIFY_API,
        {

          method:
            "POST",

          headers: {

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              token:
                token

            })

        }
      );


    let result;


    try {

      result =
        await response.json();

    }

    catch {

      return {

        success: false,

        message:
          "Worker trả về dữ liệu không hợp lệ."

      };

    }


    /* ================================================
       THÀNH CÔNG
    ================================================ */

    if (
      response.ok &&
      result.success === true
    ) {

      return {

        success: true,

        message:
          result.message ||
          "CAPTCHA xác minh thành công."

      };

    }


    /* ================================================
       THẤT BẠI
    ================================================ */

    return {

      success: false,

      message:
        result.message ||
        "CAPTCHA không hợp lệ."

    };

  }

  catch (error) {

    console.error(
      "TURNSTILE VERIFY ERROR:",
      error
    );


    return {

      success: false,

      message:
        "Không thể kết nối máy chủ xác minh."

    };

  }

}


/* =====================================================
   RESET CAPTCHA
===================================================== */

function resetTurnstile() {

  turnstileToken =
    null;


  const container =
    document.querySelector(
      "#turnstileWidget"
    );


  if (container) {

    container.dataset.verified =
      "false";

  }


  if (
    typeof turnstile !==
    "undefined" &&
    turnstileWidgetId !== null
  ) {

    try {

      turnstile.reset(
        turnstileWidgetId
      );

    }

    catch (error) {

      console.warn(
        "Không thể reset Turnstile:",
        error
      );

    }

  }

}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initTurnstile();

  }
);


/* =====================================================
   EXPORT GLOBAL
===================================================== */

window.getTurnstileToken =
  getTurnstileToken;

window.verifyTurnstile =
  verifyTurnstile;

window.resetTurnstile =
  resetTurnstile;

window.initTurnstile =
  initTurnstile;
