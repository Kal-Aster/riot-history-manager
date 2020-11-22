# Changelog
All notable changes to this project will be documented in this file.

## [1.4.0] - 2020-11-23
- change bundle configuration
- index exports `components` and `loadingBar`

## [any] - Unreleased
- "requestvisibility" documentation

- customable `z-index` of loading bar

## [1.3.12] - 2020-11-18
- unroutes correctly when loading routes overlap

## [1.3.11] - 2020-11-18
- fix the way the scope is created for the route slot

## [1.3.10] - 2020-11-18
- fix bug: route slot preserve parent scope

## [1.3.8] - 2020-11-17
- fix bug: loading bar was not released correctly when reached a non-`route`d path

## [1.3.7] - 2020-11-17
- `a` tag in `navigate` has the default href if `context` is specified
- `routerload` event is dispatch as soon as the loading bar progress ends

## [1.3.4] - 2020-11-16
- "requestvisibility" event

## [1.3.1] - 2020-11-16
- route `slot` is only mounted during routing cycle
- route `slot` children are left in the mounting element and the mounting element is appended in the `<route>`
- route `slot` mounting element is appended right away when created, with `display: none` and showed with `display: block` when routing cycle completes

## [1.2.3] - 2020-11-14
- Call `unmount` on unroute