const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./test'));

const htmlTemplate = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" content="text/html; charset=UTF-8; X-Content-Type-Options=nosniff">
        <title>riot-history-manager test</title>

        <style>
            body { margin: 0; background: lightgray; }
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
                    const route = "{{ROUTE}}";
                    window._ROUTER_BASE = window.location.pathname.split(route).slice(0, -1).join(route);
                    require.baseUrl = window._ROUTER_BASE;
                }
            }());
        </script>
        <script src="{{RELATIVE_PATH}}require.js" data-main="{{RELATIVE_PATH}}scripts/index.js"></script>
    </body>
</html>`;

function calculateRelativePath(route) {
    const pathSegments = route.split('/');
    const count = pathSegments.length - 2;
    
    if (count > 0) {
        const backward = [];
        for (let i = count; i > 0; i--) {
            backward.push('..');
        }
        backward.push('');
        return backward.join('/');
    }
    
    return '';
}

app.get('*', (req, res) => {
    const route = req.path || '/';

    const relativePath = calculateRelativePath(route);

    const html = (htmlTemplate
        .replaceAll('{{ROUTE}}', route)
        .replaceAll('{{RELATIVE_PATH}}', relativePath)
    );

    res.set({
        'Content-Type': 'text/html; charset=UTF-8',
        'X-Content-Type-Options': 'nosniff'
    });

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Static files served from: ./test`);
});