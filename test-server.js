const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from ./test directory
app.use(express.static('./test'));

// HTML template (your PHP file with placeholders)
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
        <script src="{{RELATIVE_PATH}}require.js" data-main="scripts/index.js"></script>
    </body>
</html>`;

// Function to calculate relative path (equivalent to PHP logic)
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

// Route handler for index.html and all other routes
app.get('*', (req, res) => {
    // Get the route (equivalent to PHP's PATH_INFO logic)
    const route = req.path || '/';
    
    // Calculate relative path
    const relativePath = calculateRelativePath(route);
    
    // Replace placeholders in template
    const html = htmlTemplate
        .replace('{{ROUTE}}', route)
        .replace('{{RELATIVE_PATH}}', relativePath);
    
    // Set appropriate headers
    res.set({
        'Content-Type': 'text/html; charset=UTF-8',
        'X-Content-Type-Options': 'nosniff'
    });
    
    res.send(html);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Static files served from: ./test`);
});