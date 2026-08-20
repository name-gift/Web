"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =================================================
           THEME
        ================================================= */

        const themeButton =
            document.getElementById(
                "themeButton"
            );


        const themeValue =
            document.getElementById(
                "themeValue"
            );


        const THEME_KEY =
            "monfansub-theme";


        /* =================================================
           APPLY THEME
        ================================================= */

        function applyTheme(theme) {

            const html =
                document.documentElement;


            /* ---------------------------------------------
               DARK
            --------------------------------------------- */

            if (theme === "dark") {

                html.setAttribute(
                    "data-theme",
                    "dark"
                );

            }


            /* ---------------------------------------------
               LIGHT
            --------------------------------------------- */

            else if (theme === "light") {

                html.setAttribute(
                    "data-theme",
                    "light"
                );

            }


            /* ---------------------------------------------
               AUTO
            --------------------------------------------- */

            else {

                html.removeAttribute(
                    "data-theme"
                );

            }


            /* ---------------------------------------------
               TEXT
            --------------------------------------------- */

            if (!themeValue) {

                return;

            }


            if (theme === "dark") {

                themeValue.textContent =
                    "Tối";

            }

            else if (theme === "light") {

                themeValue.textContent =
                    "Sáng";

            }

            else {

                themeValue.textContent =
                    "Tự động";

            }

        }


        /* =================================================
           THEME BUTTON
        ================================================= */

        if (themeButton) {

            themeButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const current =
                        localStorage.getItem(
                            THEME_KEY
                        ) || "auto";


                    let next;


                    /* AUTO → DARK */

                    if (
                        current === "auto"
                    ) {

                        next = "dark";

                    }


                    /* DARK → LIGHT */

                    else if (
                        current === "dark"
                    ) {

                        next = "light";

                    }


                    /* LIGHT → AUTO */

                    else {

                        next = "auto";

                    }


                    localStorage.setItem(
                        THEME_KEY,
                        next
                    );


                    applyTheme(
                        next
                    );

                }
            );

        }


        /* =================================================
           LOAD SAVED THEME
        ================================================= */

        const savedTheme =
            localStorage.getItem(
                THEME_KEY
            ) || "auto";


        applyTheme(
            savedTheme
        );


    }
);