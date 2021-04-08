<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" content="text/html; charset=UTF-8; X-Content-Type-Options=nosniff">
        <title>riot-history-manager test</title>

        <style>
            body { margin: 0; }
        </style>
    </head>
    <body>
        <div style="position: fixed; z-index: 100; background: #000; left: 0; right: 0; top: 0; bottom: 0;">
            <script>
                (function () {
                    var splashscreen = document.currentScript.parentElement;
                    window.addEventListener("routerload", function onrouterload() {
                        window.removeEventListener("routerload", onrouterload);
                        splashscreen.parentElement.removeChild(splashscreen);
                    });
                }())
            </script>
        </div>
        <test></test>

        <script>
            if (window.history.replaceState) {
                window._ROUTER_BASE = window.location.pathname.split("/").slice(0, -1).join("/");
                window.history.replaceState({}, "", window._ROUTER_BASE + "<?php
                    echo array_key_exists('PATH_INFO', $_SERVER) ? $_SERVER['PATH_INFO'] : (
                        array_key_exists('ORIG_PATH_INFO', $_SERVER) ? $_SERVER['ORIG_PATH_INFO'] : '/'
                    )
                ?>");
            }
        </script>
        <script src="require.js" data-main="scripts/index.js"></script>
    </body>
</html>