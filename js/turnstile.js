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
   CẬP NHẬT TRẠNG THÁI NÚT KÍCH HOẠT
   NÚT LUÔN HIỆN - CHỈ MỜ / KHÓA
===================================================== */

function updatePromoSubmitState() {

  const promoSubmit =
    document.querySelector("#promoSubmit");

  const promoInput =
    document.querySelector("#promoCodeInput");


  if (!promoSubmit) {
    return;
  }


  const code =
    promoInput
      ? promoInput.value.trim()
      : "";


  const hasCode =
    code.length > 0;


  const hasCaptcha =
    !!turnstileToken;


  /* =================================================
     CHƯA ĐỦ ĐIỀU KIỆN
     
     Nút vẫn nằm trên giao diện.
     Chỉ mờ + không thể bấm.
  ================================================= */

  if (!hasCode || !hasCaptcha) {

    promoSubmit.disabled =
      true;


    promoSubmit.style.opacity =
      "0.35";


    promoSubmit.style.cursor =
      "not-allowed";


    promoSubmit.style.pointerEvents =
      "none";


    promoSubmit.style.transform =
      "translateY(10px)";


    promoSubmit.style.filter =
      "grayscale(0.25)";


    promoSubmit.style.boxShadow =
      "none";


    return;

  }


  /* =================================================
     ĐÃ NHẬP MÃ + CAPTCHA THÀNH CÔNG
     
     Hiện rõ + cho phép bấm.
  ================================================= */

  promoSubmit.disabled =
    false;


  promoSubmit.style.opacity =
    "1";


  promoSubmit.style.cursor =
    "pointer";


  promoSubmit.style.pointerEvents =
    "auto";


  promoSubmit.style.transform =
    "translateY(0)";


  promoSubmit.style.filter =
    "none";


  promoSubmit.style.boxShadow =
    "0 7px 20px rgba(86,104,255,.2)";

}


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


  /* =================================================
     CHỜ CLOUDFLARE TURNSTILE
  ================================================= */

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


  /* =================================================
     NẾU ĐÃ RENDER THÌ KHÔNG RENDER LẠI
  ================================================= */

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


          /* ==========================================
             CAPTCHA XÁC MINH THÀNH CÔNG
          ========================================== */

          callback:
            function(token) {

              turnstileToken =
                token;


              container.dataset.verified =
                "true";


              /*
               * CAPTCHA thành công.
               *
               * Nếu đã nhập mã:
               * → nút sáng + bấm được.
               *
               * Nếu chưa nhập mã:
               * → nút vẫn mờ + khóa.
               */

              updatePromoSubmitState();


              document.dispatchEvent(
                new CustomEvent(
                  "turnstileVerified",
                  {
                    detail: {
                      token:
                        token
                    }
                  }
                )
              );

            },


          /* ==========================================
             CAPTCHA HẾT HẠN
          ========================================== */

          "expired-callback":
            function() {

              turnstileToken =
                null;


              container.dataset.verified =
                "false";


              /*
               * Có mã:
               * → nút vẫn hiện nhưng mờ + khóa.
               *
               * Chưa có mã:
               * → cũng mờ + khóa.
               */

              updatePromoSubmitState();


              document.dispatchEvent(
                new Event(
                  "turnstileExpired"
                )
              );

            },


          /* ==========================================
             CAPTCHA LỖI
          ========================================== */

          "error-callback":
            function(error) {

              turnstileToken =
                null;


              container.dataset.verified =
                "false";


              /*
               * CAPTCHA lỗi:
               * → khóa nút.
               */

              updatePromoSubmitState();


              console.error(
                "Turnstile error:",
                error
              );


              document.dispatchEvent(
                new CustomEvent(
                  "turnstileError",
                  {
                    detail: {
                      error:
                        error
                    }
                  }
                )
              );

            }

        }
      );


    /*
     * Khi mới vào:
     * nút vẫn hiện nhưng bị khóa.
     */

    updatePromoSubmitState();

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

      success:
        false,

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

        success:
          false,

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

        success:
          true,

        message:
          result.message ||
          "CAPTCHA xác minh thành công."

      };

    }


    /* ================================================
       THẤT BẠI
    ================================================ */

    return {

      success:
        false,

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

      success:
        false,

      message:
        "Không thể kết nối máy chủ xác minh."

    };

  }

}


/* =====================================================
   RESET CAPTCHA
===================================================== */

function resetTurnstile() {

  /*
   * Xóa token cũ.
   */

  turnstileToken =
    null;


  /*
   * Cập nhật trạng thái container.
   */

  const container =
    document.querySelector(
      "#turnstileWidget"
    );


  if (container) {

    container.dataset.verified =
      "false";

  }


  /*
   * Nút vẫn ở đó.
   *
   * Chỉ chuyển thành:
   * mờ + khóa.
   */

  updatePromoSubmitState();


  /*
   * Reset đúng widget Turnstile.
   */

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
   TẢI LẠI CAPTCHA
===================================================== */

function initReloadPromoCaptcha() {

  const reloadCaptchaButton =
    document.getElementById(
      "reloadPromoCaptcha"
    );


  if (!reloadCaptchaButton) {

    return;

  }


  reloadCaptchaButton.addEventListener(
    "click",
    function(event) {

      event.preventDefault();
      event.stopPropagation();


      /*
       * Nếu Turnstile chưa sẵn sàng.
       */

      if (
        typeof turnstile ===
          "undefined"
      ) {

        console.warn(
          "Cloudflare Turnstile chưa sẵn sàng."
        );

        return;

      }


      try {

        /*
         * Xóa token CAPTCHA cũ.
         */

        turnstileToken =
          null;


        /*
         * Cập nhật trạng thái.
         */

        const container =
          document.querySelector(
            "#turnstileWidget"
          );


        if (container) {

          container.dataset.verified =
            "false";

        }


        /*
         * Nút KHÔNG biến mất.
         *
         * Chỉ mờ + khóa lại.
         */

        updatePromoSubmitState();


        /*
         * Reset đúng widget.
         */

        if (
          turnstileWidgetId !== null
        ) {

          turnstile.reset(
            turnstileWidgetId
          );

        }


        console.log(
          "Đã tải lại CAPTCHA."
        );

      }

      catch (error) {

        console.error(
          "Không thể tải lại CAPTCHA:",
          error
        );

      }

    }
  );

}


/* =====================================================
   THEO DÕI Ô NHẬP MÃ PROMO
===================================================== */

function initPromoCodeInput() {

  const promoInput =
    document.querySelector(
      "#promoCodeInput"
    );


  if (!promoInput) {

    return;

  }


  promoInput.addEventListener(
    "input",
    function() {

      /*
       * Tự động viết hoa mã.
       */

      promoInput.value =
        promoInput.value.toUpperCase();


      /*
       * Cập nhật nút ngay khi nhập/xóa mã.
       *
       * Có mã + CAPTCHA:
       * → sáng + bấm được.
       *
       * Thiếu một trong hai:
       * → mờ + khóa.
       */

      updatePromoSubmitState();

    }
  );


  /*
   * Kiểm tra ngay khi khởi tạo.
   */

  updatePromoSubmitState();

}


/* =====================================================
   THEO DÕI KHI MODAL PROMO ĐƯỢC MỞ
===================================================== */

function initPromoModalStateObserver() {

  const promoModal =
    document.querySelector(
      "#promoModal"
    );


  if (!promoModal) {

    return;

  }


  /*
   * Khi modal mở:
   * đảm bảo nút vẫn hiện và ở trạng thái đúng.
   */

  const observer =
    new MutationObserver(
      function() {

        if (
          promoModal.classList.contains(
            "show"
          ) ||
          promoModal.classList.contains(
            "active"
          )
        ) {

          updatePromoSubmitState();

        }

      }
    );


  observer.observe(
    promoModal,
    {
      attributes:
        true,

      attributeFilter:
        ["class"]
    }
  );

}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initTurnstile();

    initReloadPromoCaptcha();

    initPromoCodeInput();

    initPromoModalStateObserver();


    /*
     * Khi trang vừa tải:
     * nút vẫn hiện,
     * nhưng bị mờ + khóa.
     */

    updatePromoSubmitState();

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


window.updatePromoSubmitState =
  updatePromoSubmitState;