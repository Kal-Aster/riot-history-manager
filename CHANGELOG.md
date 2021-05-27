# Changelog
All notable changes to this project will be documented in this file.

## [2.0.3] - 2021-05-27
- accepts object with handleEvent as listener for custom events

## [2.0.2] - 2021-04-08
- update dependencies

## [2.0.1] - 2021-04-08
- update dependencies

## [2.0.0] - 2021-04-08
- add riot tag namespace

## [1.7.0] - 2021-04-08
- update dependencies

## [1.6.1] - 2021-03-23
- temporary fix multiple unrouting

## [1.6.0] - 2021-03-15
- hide route element from dom

## [1.5.3] - 2021-03-15
- dispatch "routerload" on document to keep capture/bubble order

## [1.5.2] - 2021-03-15
- fix `route` last to be aware of "routerload"

## [1.5.1] - 2021-03-11
- get `route` from riot parent (allowing ```<template is="router">```)

## [any] - Unreleased
- "requestvisibility" documentation

- customable `z-index` of loading bar

## [1.5.0] - 2021-03-09
- implement customizable loading bar color (via `loading-bar::setColor`)
- update tests
- update dependencies

## [1.4.2] - 2021-01-31
- change "dist" structure
- edit entry points in "package.json"
- add "files" in "package.json"
- update dependencies

## [1.4.1] - 2020-11-24
- remove delay from actual display of route and "routerload" event dispatch
- change `loading-bar.claimed` to `loading-bar.claimedBy` (previous one still available)
- add `loading-bar.isLoading`

## [1.4.0] - 2020-11-23
- change bundle configuration
- index exports `components` and `loadingBar`

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