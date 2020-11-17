# Changelog
All notable changes to this project will be documented in this file.

## [any] - Unreleased
### Add
- "requestvisibility" documentation
### Change
- customable `z-index` of loading bar

## [1.3.8] - 2020-11-17
### Added
### Changed
- fixed bug: loading bar was not released correctly when reached a non-`route`d path

## [1.3.7] - 2020-11-17
### Added
### Changed
- `a` tag in `navigate` has the default href if `context` is specified
- `routerload` event is dispatch as soon as the loading bar progress ends

## [1.3.4] - 2020-11-16
### Added
- "requestvisibility" event
### Changed

## [1.3.1] - 2020-11-16
### Added
### Changed
- route `slot` is only mounted during routing cycle
- route `slot` children are left in the mounting element and the mounting element is appended in the `<route>`
- route `slot` mounting element is appended right away when created, with `display: none` and showed with `display: block` when routing cycle completes

## [1.2.3] - 2020-11-14
### Added
### Changed
- Calling `unmount` on unroute