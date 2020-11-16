# Changelog
All notable changes to this project will be documented in this file.

## [any] - Unreleased
### Add
### Change

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