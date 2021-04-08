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
        <rhm-test></rhm-test>

        <script>
            var require = {};
            (function () {
                if (window.history.replaceState) {
                    const route = "<?php
                        $route = array_key_exists('PATH_INFO', $_SERVER) ? $_SERVER['PATH_INFO'] : (
                            array_key_exists('ORIG_PATH_INFO', $_SERVER) ? $_SERVER['ORIG_PATH_INFO'] : '/'
                        );
                        $backward = [];
                        $count = count(explode('/', $route)) - 2;
                        if ($count > 0) {
                            for ($i = $count; $i > 0; $i--) {
                                array_push($backward, '..');
                            }
                            array_push($backward, '');
                        }
                        
                        $relativePath = implode('/', $backward);
                        unset($backward);

                        echo $route;
                    ?>";
                    window._ROUTER_BASE = window.location.pathname.split(route).slice(0, -1).join(route);
                    require.baseUrl = window._ROUTER_BASE;
                }
            }());
        </script>
        <script src="<?php
            if (isset($relativePath)) {
                echo $relativePath;
            }
        ?>require.js" data-main="scripts/index.js"></script>
    </body>
</html>