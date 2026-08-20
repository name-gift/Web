"use strict";

/* =====================================================
   MONFANSUB - TURNSTILE
===================================================== */


/* =====================================================
   TURNSTILE TOKEN
===================================================== */

let loginTurnstileToken = "";

let registerTurnstileToken = "";

let promoTurnstileToken = "";


/* =====================================================
   LOGIN
===================================================== */

function onLoginTurnstileSuccess(token) {

    loginTurnstileToken =
        String(token || "");

}


function onLoginTurnstileExpired() {

    loginTurnstileToken = "";

}


function onLoginTurnstileError() {

    loginTurnstileToken = "";

}


/* =====================================================
   REGISTER
===================================================== */

function onRegisterTurnstileSuccess(token) {

    registerTurnstileToken =
        String(token || "");

}


function onRegisterTurnstileExpired() {

    registerTurnstileToken = "";

}


function onRegisterTurnstileError() {

    registerTurnstileToken = "";

}


/* =====================================================
   PROMO
===================================================== */

function onPromoTurnstileSuccess(token) {

    promoTurnstileToken =
        String(token || "");

}


function onPromoTurnstileExpired() {

    promoTurnstileToken = "";

}


function onPromoTurnstileError() {

    promoTurnstileToken = "";

}


/* =====================================================
   GET TOKENS
===================================================== */

function getLoginTurnstileToken() {

    return loginTurnstileToken;

}


function getRegisterTurnstileToken() {

    return registerTurnstileToken;

}


function getPromoTurnstileToken() {

    return promoTurnstileToken;

}