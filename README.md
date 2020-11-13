# [riot](https://riot.js.org/) wrapper for [history-manager](https://www.npmjs.com/package/history-manager)

## Installation
```npm install riot-history-manager```

## Usage
index.js
```js
import "riot-history-manager";

// any code here
```

main.riot
```riot
<main>
    <router>
        <route path="" redirect="home" />
        <route path="home">
            <span>HOME</span>
        </route>
        <route path="page1">
            <span>PAGE 1</span>
            <img src="img.jpg" need-loading>
        </route>
    </router>

    <script>
        import { Router } from "history-manager";

        Router.setContext({
            // ...
        });
        Router.setContext({
            // ...
        });

        export default {
            onMounted() {
                Router.start()
            }
        }
    </script>
</main>
```