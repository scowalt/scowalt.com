# Third-party notices

The GPL license for this repository's original code does not replace the licenses
of its dependencies or third-party assets. Preserve their applicable licenses and
notices when redistributing them.

## Material Design Icons

The site uses Material Design Icons by Pictogrammers through
`@iconify-json/mdi` version 1.2.3. This includes the `envelope` alias of the `email`
icon. The inline heading-link SVG in `astro.config.mjs` also uses the Material
Design `link` icon path, with equivalent path-command spelling changes.

These icons are provided under the
[Apache License 2.0](LICENSES/Apache-2.0.txt), not this repository's GPL grant for
original code.

- [Icon collection and upstream license](https://github.com/Templarian/MaterialDesign/blob/master/LICENSE)
- [Pinned package metadata](https://unpkg.com/@iconify-json/mdi@1.2.3/info.json)

## CoreUI Brands

The LinkedIn, GitHub, YouTube, and Twitter icons come from CoreUI Brands by
creativeLabs Łukasz Holeczek through `@iconify-json/cib` version 1.2.3, which
identifies the source collection as version 2.0.1.

The upstream license's **CoreUI Icons Brand and Flags License** section specifies
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). This is distinct from
the CC BY 4.0 terms for the other CoreUI Free icons.

- [Version-specific upstream license](https://github.com/coreui/coreui-icons/blob/d56257e1d3b9c44ccc12fcab2d692d21539b68ff/LICENSE)
- [Pinned package metadata](https://unpkg.com/@iconify-json/cib@1.2.3/info.json)

Brand names and logos remain the property of their respective owners. Their use
identifies the linked services and does not imply endorsement or grant trademark
rights.

## Portfolio images and personal content

The photographs, screenshots, personal writing, and branding excluded in the
[README](README.md#license) are not licensed under GPL by this repository.
Third-party artwork and logos depicted in screenshots remain subject to their
respective rights; this repository grants no additional rights to them.

## Dependencies and historical vendor files

Packages installed from `bun.lock` retain their own license and copyright notices.
Historical Yarn bundles under `.yarn/releases/` are third-party software, not
original website code; their upstream and bundled-dependency licenses continue to
apply. Do not remove their notices when redistributing those versions.
