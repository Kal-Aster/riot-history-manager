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

### Routing cycle
As soon as the Router calls the `route` component listener, the latter mounts the `slot` in a child div element.

In this stage there is the [mount cycle of riot](https://riot.js.org/documentation/#lifecycle-callbacks).

Just after this the div element is set with `display: none` until the loading is complete, so you should consider this in any operation started in the mount cycle.

Now is dispatched the "beforeroute" event in every newly created element.

The `route` now is waiting all the `need-loading` elements to fire the "load" event.

When all they are done, it will dispatch the "unroute" event to the previous `route` - if any - and then `unmount`ed it.

Now the div element containing the `slot` is set with `display: block` and is dispatched the event "route".

Following a more concise explanation:
1. currentRoute.mount()
2. `display: none`
3. currentRoute.dispatchToChildren("beforeroute")
4. waiting "load" from `need-loading` elements
5. previousRoute.dispatchToChildren("unroute")
6. previousRoute.unmount()
7. `display: block`
8. currentRoute.dispatchToChildren("route")