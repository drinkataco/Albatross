Introduction
============
[![Build Status](https://travis-ci.org/drinkataco/AdminLite.svg?branch=master)](https://travis-ci.org/drinkataco/AdminLite)

**AdminLite** -- is a fully responsive admin template. Based on **[AdminLTE](https://adminlte.io/docs)** which uses the **[Bootstrap 3](https://github.com/twbs/bootstrap)** framework. Highly customizable and easy to use. Fits many screen resolutions from small mobile devices to large desktops. Check out the live preview now and see for yourself.

### Difference between AdminLite and AdminLTE?
AdminLite is a lighter version of AdminLTE – which scraps the main dependency of jQuery and removes most packages. No CSS has been changed at all.

All JS has been rewritten in ES6, with a babel compiler (and polyfill) included to open up browser compatability. A boostrap native package is also available, as bootstrap traditionally requires jQuery.

I have tried my hardest to immitate the functionality of the existing javascript. The only difference should be on initiation, instead of initiating as a jQuery plugin, they should be initiated as an object - `new Tree(element)` (if initiated manually).

For certain animations, Velocity can be included for slideUps and slideDowns, although this is not necessary.

### ES6 and Browser Support
By default, the javascript is now in ES6 – which is very unfriendly to some older browsers. All JS is compiled using babel, so that older browsers can be supported if needed.

In order to use this version, swap out the `dist/js/adminlite.min.js` script reference for `dist/js/adminlite.babel.min.js`. You may have to include the polyfill as well, so ES6 functions such as Promises can be supported by these browsers – located in `bower_components/babel-polyfill/browser-polyfill.js`

## Documentation & Installation Guide
AdminLite is only available from github. Just git clone it - `git clone https://github.com/drinkataco/AdminLite`

!["AdminLTE Presentation"](https://adminlte.io/AdminLTE2.png "AdminLTE Presentation")

### Licence
AdminLTE is an open source project by [AdminLTE.IO](https://adminlte.io) that is licensed under [MIT](http://opensource.org/licenses/MIT). AdminLTE.IO
reserves the right to change the license of future releases. Wondering what you can or can't do? View the [license guide](https://adminlte.io/docs/license).

AdminLite follows this licence

### Image Credits
- [Pixeden](http://www.pixeden.com/psd-web-elements/flat-responsive-showcase-psd)
- [Graphicsfuel](http://www.graphicsfuel.com/2013/02/13-high-resolution-blur-backgrounds/)
- [Pickaface](http://pickaface.net/)
- [Unsplash](https://unsplash.com/)
- [Uifaces](http://uifaces.com/)

### Thanks
[Massive thanks to AdminLTE for this great free theme](https://adminlte.io/docs)