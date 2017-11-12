'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*! Albatross app.js
* ================
* Development*
* @Author  Josh Walwyn
*/

var runner = [];

window.onload = function () {
  return runner.map(function (run) {
    return run();
  });
};

/**
 * Utilities
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * @type {Object}
 */
var Utilities = {};

/**
 * Finds children of element
 * @param {String} nodeType   Required node type, such as LI, DIV
 * @param {String} className  Name of class to grab
 * @param {Object} parentNode Node of who's children to traverse through
 * @return {List<Object>}      List of found elements
 */
Utilities.findChildren = function (nodeType, className, parentNode) {
  var found = [];
  var child = parentNode.firstChild;
  while (child) {
    if (child.nodeName === nodeType && child.classList.contains(className)) {
      found.push(child);
    }
    child = child.nextSibling;
  }

  return found;
};

/**
 * Build options array from element set and defaults
 * @param  {Array<String, Mixed>}      default Default Options for fallback
 * @param  {Array<String, Mixed>|null} current Current Objects
 * @param  {Object|null}               element DOM Element to traverse for data attrs for options
 * @param  {List<String>|null}         fields  List of fields to resolve for options
 * @return {Object}                            Calculated Options
 */
Utilities.grabOptions = function (def, current, element, fields) {
  // Keep all option variations here
  var options = {};
  options.default = def;
  options.current = current || {};
  options.calculated = {};

  // Get FieldNames
  var fieldsToFetch = fields || Object.keys(def);

  // Loop through fields to get option match
  for (var i = 0; i < fieldsToFetch.length; i += 1) {
    var fieldName = fieldsToFetch[i];
    var value = void 0;

    // If field has already been defined, don't change selection
    if (fieldName in options.current) {
      value = options.current[fieldName];
      // Otherwise attempt to find it in the dataset
    } else if (element && fieldName in element.dataset) {
      value = element.dataset[fieldName];
      // Otherwise, let's just go with the default value
    } else {
      value = options.default[fieldName];
    }

    // convert false boolean
    value = value === 'false' ? false : value;

    options.calculated[fieldName] = value;
  }

  return options.calculated;
};

/* global runner */
/* global Velocity */
/* global Utilities */

/* Tree()
 * ======
 * Converts a nested list into a multilevel
 * tree view menu.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Tree.js jQuery Plugin
 *
 * @Usage: new Tree(element, options)
 *         Add [data-widget="tree"] to the ul element
 *         Pass any option as data-option-name="value"
 */

var Tree = function () {
  _createClass(Tree, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(Tree.Selector.data), function (element) {
        return new Tree(element);
      });
    }

    /**
     * Opens existing active element(s) and calls method to bind
     * click event listeners onto the sidebar itself
     * @param {Object} element The main sidebar element
     * @param {Object|null} options list of options
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     * @param {Object|null} events list of event names
     */

  }]);

  function Tree(element, options, classNames, selectors, events) {
    _classCallCheck(this, Tree);

    // Add parameters to global scope
    this.Default = Tree.Default;
    this.ClassName = classNames || Tree.ClassName;
    this.Selector = selectors || Tree.Selector;
    this.Event = events || Tree.Event;
    this.element = element;
    this.element.classList.add(this.ClassName.tree);

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // Open menu for active element
    var active = this.element.querySelector(this.Selector.activeTreeview);

    if (active !== null) {
      active.classList.add(this.ClassName.open);
    }

    // bind listeners
    this.setUpListeners();
  }

  /**
   * Binds an event listener to each parent menu element
   * @return {Object}
   */


  _createClass(Tree, [{
    key: 'setUpListeners',
    value: function setUpListeners() {
      var _this = this;

      // Binds a click event listener for each element
      Array.prototype.forEach.call(this.element.querySelectorAll(this.options.trigger), function (context) {
        context.addEventListener('click', function (event) {
          _this.toggle(context, event);
        });
      });
    }

    /**
     * Handle show/hide of collapsible menus
     * @param {Object} link  The link element clicked
     * @param {Object} event The Triggered Event
     */

  }, {
    key: 'toggle',
    value: function toggle(link, event) {
      // Get contextual DOM elements
      var parentLi = link.parentNode;
      var isOpen = parentLi.classList.contains(this.ClassName.open);
      var treeviewMenu = Utilities.findChildren('UL', this.ClassName.treeviewMenu, parentLi);

      // Stop if not a menu tree
      if (!parentLi.classList.contains(this.ClassName.treeview)) {
        return;
      }

      // Stop link follow
      if (!this.options.followLink || link.getAttribute('href') === '#') {
        event.preventDefault();
      }

      // Open or close depending on current statw
      if (isOpen) {
        this.collapse(treeviewMenu, parentLi);
      } else {
        this.expand(treeviewMenu, parentLi);
      }
    }

    /**
     * Collapse element
     * @param {Object} tree     The child tree/menu
     * @param {Object} parentLi The parent element that contains the tree
     */

  }, {
    key: 'collapse',
    value: function collapse(tree, parentLi) {
      var _this2 = this;

      parentLi.classList.remove(this.ClassName.open);

      var treeLocal = tree;

      Array.prototype.forEach.call(treeLocal, function (t) {
        var treeItem = t;
        if (typeof Velocity === 'undefined') {
          treeItem.style.display = 'none';
          _this2.element.dispatchEvent(new CustomEvent(_this2.Event.collapsed));
        } else {
          Velocity(treeItem, 'slideUp', {
            easing: _this2.options.easing,
            duration: _this2.options.animationSpeed
          }).then(function () {
            // Call custom event to indicate collapse
            _this2.element.dispatchEvent(new CustomEvent(_this2.Event.collapsed));
          });
        }
      });
    }

    /**
     * Expand menu selection, and close all siblings
     * @param {Object} tree     The child tree/menu
     * @param {Object} parentLi The parent element that contains the tree
     */

  }, {
    key: 'expand',
    value: function expand(tree, parentLi) {
      var _this3 = this;

      // We need to access direct siblings to support multilevel menus remaining open
      var openMenus = Utilities.findChildren('LI', this.ClassName.open, parentLi.parentNode);

      // For each currently opened menu (which should be just 1) we should close
      if (this.options.accordion) {
        Array.prototype.forEach.call(openMenus, function (menu) {
          var openTree = Utilities.findChildren('UL', _this3.ClassName.treeviewMenu, menu);

          // Collapse
          _this3.collapse(openTree, menu);
        });
      }

      // Open this menu
      parentLi.classList.add(this.ClassName.open);

      var firstTree = tree[0]; // Only the direct descendant needs to be closed
      if (typeof Velocity === 'undefined') {
        firstTree.style.display = 'block';
        this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
      } else {
        Velocity(firstTree, 'slideDown', {
          easing: this.options.easing,
          duration: this.options.animationSpeed
        }).then(function () {
          // Call custom event to indicate expansion
          _this3.element.dispatchEvent(new CustomEvent(_this3.Event.expanded));
        });
      }
    }
  }]);

  return Tree;
}();

/**
 * Default Options
 * @type {Object}
 */


Tree.Default = {
  animationSpeed: 300,
  accordion: true,
  followLink: true,
  trigger: '.treeview a',
  easing: 'easeInSine'
};

/**
 * Selectors for query selections
 * @type {Object}
 */
Tree.Selector = {
  data: '[data-widget="tree"]',
  activeTreeview: '.treeview.active'
};

/**
 * DOM Class Names
 * @type {Object}
 */
Tree.ClassName = {
  open: 'menu-open',
  tree: 'tree',
  treeview: 'treeview',
  treeviewMenu: 'treeview-menu'
};

/**
 * Custom Events
 * @type {Object}
 */
Tree.Event = {
  expanded: 'tree_expanded',
  collapsed: 'tree_collapsed'
};

runner.push(Tree.bind);

/* global runner */
/* global Utilities */

/* PushMenu()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE PushMenu.js jQuery Plugin
 *
 * @Usage: new PushMenu(element, options)
 *         Add [data-widget="push-menu"] to the ul element
 *         Pass any option as data-option-name="value"
 */

var PushMenu = function () {
  _createClass(PushMenu, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(PushMenu.Selector.button), function (button) {
        return new PushMenu(button);
      });
    }

    /**
     * Binds Listeners to DOM
     * @param {Object} element The main sidebar element
     * @param {Object|null} options list of options
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     */

  }]);

  function PushMenu(element, options, classNames, selectors) {
    var _this4 = this;

    _classCallCheck(this, PushMenu);

    // Add parameters to global scope
    this.Default = PushMenu.Default;
    this.ClassName = classNames || PushMenu.ClassName;
    this.Selector = selectors || PushMenu.Selector;

    this.element = element;

    // And  Window Width
    this.windowWidth = window.innerWidth;

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // Get main page body element
    this.body = document.querySelector('body');

    if (!element) {
      return;
    }

    // Add Listeners to expand/collapse sidebar on hover
    if (this.options.expandOnHover || this.body.classList.contains(this.ClassName.mini) && this.body.classList.contains(this.ClassName.layoutFixed)) {
      this.expandOnHover();
      this.body.classList.add(this.ClassName.expandFeature);
    }

    // Enable hide menu when clicking on the content-wrapper on small screens
    this.body.getElementsByClassName(this.ClassName.contentWrapper)[0].addEventListener('click', function () {
      if (_this4.windowWidth <= _this4.options.collapseScreenSize && _this4.body.classList.contains(_this4.ClassName.open)) {
        _this4.close();
      }
    });

    // Fix for android devices
    this.body.querySelector(this.Selector.searchInput).addEventListener('click', function (e) {
      e.stopPropagation();
    });

    // Bind functionality to close/open sidebar
    this.setUpListeners();
  }

  /**
   * Binds an event listener to each parent menu element
   */


  _createClass(PushMenu, [{
    key: 'setUpListeners',
    value: function setUpListeners() {
      var _this5 = this;

      this.element.addEventListener('click', function (event) {
        // And contextual Window Width
        _this5.windowWidth = window.innerWidth;

        event.preventDefault();
        _this5.toggle();
      });
    }

    /**
     * Toggle sidebar open/close
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      var isOpen = !this.body.classList.contains(this.ClassName.collapsed);

      if (this.windowWidth <= this.options.collapseScreenSize) {
        isOpen = this.body.classList.contains(this.ClassName.open);
      }

      if (!isOpen) {
        this.open();
      } else {
        this.close();
      }
    }

    /**
     * Open the sidebar
     */

  }, {
    key: 'open',
    value: function open() {
      if (this.windowWidth > this.options.collapseScreenSize) {
        this.body.classList.remove(this.ClassName.collapsed);
      } else {
        this.body.classList.add(this.ClassName.open);
      }
    }

    /**
     * Close the sidebar
     */

  }, {
    key: 'close',
    value: function close() {
      if (this.windowWidth > this.options.collapseScreenSize) {
        this.body.classList.remove(this.ClassName.expanded);
        this.body.classList.add(this.ClassName.collapsed);
      } else {
        this.body.classList.remove(this.ClassName.open);
        this.body.classList.remove(this.ClassName.collapsed);
      }
    }

    /**
     * Expand with time delay via mouseover hover
     */

  }, {
    key: 'expand',
    value: function expand() {
      var _this6 = this;

      window.setTimeout(function () {
        _this6.body.classList.remove(_this6.ClassName.collapsed);
        _this6.body.classList.add(_this6.ClassName.expanded);
      }, this.options.expandTransitionDelay);
    }

    /**
     * Collapse with time delay via mouseout hover
     */

  }, {
    key: 'collapse',
    value: function collapse() {
      var _this7 = this;

      window.setTimeout(function () {
        _this7.body.classList.remove(_this7.ClassName.expanded);
        _this7.body.classList.add(_this7.ClassName.collapsed);
      }, this.options.expandTransitionDelay);
    }

    /**
     * Bind mouseover and mouseleave events to colapse/expand sidebar
     */

  }, {
    key: 'expandOnHover',
    value: function expandOnHover() {
      var _this8 = this;

      Array.prototype.forEach.call(document.getElementsByClassName(this.ClassName.mainSidebar), function (context) {
        context.addEventListener('mouseover', function () {
          // Handle Expansion
          if (_this8.body.classList.contains(_this8.ClassName.mini) && _this8.body.classList.contains(_this8.ClassName.collapsed) && _this8.windowWidth > _this8.options.collapseScreenSize) {
            _this8.expand();
          }
        });

        // handle Close the sidebar
        context.addEventListener('mouseleave', function () {
          if (_this8.body.classList.contains(_this8.ClassName.expanded)) {
            _this8.collapse();
          }
        });
      });
    }
  }]);

  return PushMenu;
}();

/**
 * Default Options
 * @type {Object}
 */


PushMenu.Default = {
  collapseScreenSize: 767,
  expandOnHover: false,
  expandTransitionDelay: 0
};

/**
 * Selectors for query selections
 * @type {Object}
 */
PushMenu.Selector = {
  button: '[data-toggle="push-menu"]',
  mainLogo: '.main-header .logo',
  searchInput: '.sidebar-form .form-control'
};

/**
 * DOM Class NAmes
 * @type {Object}
 */
PushMenu.ClassName = {
  collapsed: 'sidebar-collapse',
  open: 'sidebar-open',
  mainSidebar: 'main-sidebar',
  mini: 'sidebar-mini',
  contentWrapper: 'content-wrapper',
  layoutFixed: 'fixed',
  expanded: 'sidebar-expanded-on-hover',
  expandFeature: 'sidebar-mini-expand-feature'
};

runner.push(PushMenu.bind);

/* global runner */
/* global Utilities */
/* global Tree */

/* Layout()
 * ========
 * Implements AdminLTE layout.
 * Fixes the layout height in case min-height fails.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE Layout.js jQuery Plugin
 *
 * @usage activated automatically upon window load.
 *        Configure any options by passing data-option="value"
 *        to the body tag.
 */

var Layout = function () {
  /**
   * Constructor
   * @param {Object|null} options list of options
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   */
  function Layout(options, classNames, selectors) {
    _classCallCheck(this, Layout);

    // set defaults
    this.Default = Layout.Default;
    this.Selector = selectors || Layout.Selector;
    this.ClassName = classNames || Layout.ClassName;
    this.blindedResize = false; // Bind layout methods to resizing
    // get body element from DOM
    this.element = document.querySelector('body');

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    this.activate();
  }

  /**
   * Actives layout methods
   */


  _createClass(Layout, [{
    key: 'activate',
    value: function activate() {
      this.fixLayout();

      if (this.options.transitionEnabled) {
        this.element.classList.remove(this.ClassName.holdTransition);
      }

      // Reset main wrapper elements
      if (this.options.resetHeight) {
        var elements = document.querySelectorAll(this.Selector.heightReset);

        Array.prototype.forEach.call(elements, function (el) {
          var elC = el;
          elC.style.height = 'auto';
          elC.style.minHeight = '100%';
        });
      }

      // Resize when window is resized
      if (!this.bindedResize) {
        window.addEventListener('resize', this.fixLayout.bind(this));

        var elLogo = document.querySelector(this.Selector.logo);
        var elSidebar = document.querySelector(this.ClassName.sidebar);

        if (elLogo) elLogo.addEventListener('transitionend', this.fixLayout.bind(this));
        if (elSidebar) elSidebar.addEventListener('transitionend', this.fixLayout.bind(this));

        this.bindedResize = true;
      }

      // If sidebar menu has expanded options, ensure layout is recalculated
      var sidebarMenu = document.querySelector(this.Selector.sidebarMenu);

      if (sidebarMenu) {
        sidebarMenu.addEventListener(Tree.Event.expanded, this.fixLayout.bind(this));
        sidebarMenu.addEventListener(Tree.Event.collapsed, this.fixLayout.bind(this));
      }
    }

    /**
     * Fix content height so it fills the page
     */

  }, {
    key: 'fix',
    value: function fix() {
      // Get all elements
      var elFooter = document.querySelector(this.Selector.mainFooter);
      var elSidebar = document.querySelector(this.Selector.sidebar);
      var elHeader = document.querySelector(this.Selector.mainHeader);
      var elWrapper = document.querySelector(this.Selector.contentWrapper);

      // We need a wrapper, otherwise lets just bail now
      if (!elWrapper) {
        return;
      }

      // Remove overflow from .wrapper if layout-boxed exists
      var boxedWrapper = document.querySelector(this.Selector.layoutBoxed + ' > ' + this.Selector.wrapper);
      if (boxedWrapper) {
        boxedWrapper.style.overflow = 'hidden';
      }

      // Get values for height, or set defaults
      var footerHeight = elFooter ? elFooter.offsetHeight : 0;
      var sidebarHeight = elSidebar ? elSidebar.offsetHeight : 0;
      var windowHeight = window.innerHeight;
      var neg = elHeader ? elHeader.offsetHeight + footerHeight : footerHeight;

      var postSetHeight = void 0;

      // Set the min-height of the content and sidebar based on
      // the height of the document.
      if (document.querySelector('body').classList.contains(this.ClassName.fixed)) {
        elWrapper.style.minHeight = windowHeight - footerHeight + 'px';
      } else {
        // Set height of page
        if (windowHeight >= sidebarHeight) {
          postSetHeight = windowHeight - neg;
          elWrapper.style.minHeight = postSetHeight + 'px';
        } else {
          postSetHeight = sidebarHeight;
          elWrapper.style.minHeight = postSetHeight + 'px';
        }

        // Fix for the control sidebar height
        var controlSidebar = document.querySelector(this.Selector.controlSidebar);
        if (controlSidebar) {
          if (controlSidebar.clientHeight > postSetHeight) {
            elWrapper.style.minHeight = controlSidebar.clientHeight + 'px';
          }
        }
      }
    }

    /**
     * Fix Sidebar for scrolling on fixed layout
     */

  }, {
    key: 'fixSidebar',
    value: function fixSidebar() {
      var elHeader = document.querySelector(this.Selector.mainHeader);
      var elSidebar = document.querySelector(this.Selector.sidebar);

      if (!elSidebar) return;

      // Make sure the body tag has the .fixed class otherwise return
      if (!this.element.classList.contains(this.ClassName.fixed)) {
        return;
      }

      // Fix for scrolling here
      var headerHeight = elHeader ? elHeader.offsetHeight : 0;
      var windowHeight = window.innerHeight;

      elSidebar.style.height = windowHeight - headerHeight + 'px';
      elSidebar.style.overflowY = 'scroll';
    }

    /**
     * Proxy for calling both fix methods
     */

  }, {
    key: 'fixLayout',
    value: function fixLayout() {
      this.fix();
      this.fixSidebar();
    }
  }]);

  return Layout;
}();

/**
 * Default Options
 * @type {Object}
 */


Layout.Default = {
  resetHeight: true,
  transitionEnabled: true
};

/**
 * Selectors for query selections
 * @type {Object}
 */
Layout.Selector = {
  heightReset: 'body, html, .wrapper',
  wrapper: '.wrapper',
  sidebar: '.sidebar',
  logo: '.main-header .logo',
  layoutBoxed: '.layout-boxed',
  sidebarMenu: '.sidebar-menu',
  mainFooter: '.main-footer',
  mainHeader: '.main-header',
  contentWrapper: '.content-wrapper',
  controlSidebar: '.control-sidebar'
};

/**
 * DOM Class Names
 * @type {Object}
 */
Layout.ClassName = {
  holdTransition: 'hold-transition',
  fixed: 'fixed'
};

runner.push(function () {
  return new Layout();
});

/* global runner */
/* global Utilities */

/* ControlSidebar()
 * ===============
 * Toggles the state of the control sidebar
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE ControlSidebar.js jQuery Plugin
 *
 * @Usage: new ControlSider(button, options);
 *         or add [data-toggle="control-sidebar"] to the sidbar trigger/button
 *         Pass any option as data-option="value"
 */

var ControlSidebar = function () {
  _createClass(ControlSidebar, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      var buttons = document.querySelectorAll(ControlSidebar.Selector.data);

      if (!buttons) return;

      Array.prototype.forEach.call(buttons, function (button) {
        return new ControlSidebar(button);
      });
    }

    /**
     * Opens existing active element(s) and calls method to bind
     * click event listeners onto the sidebar itself
     * @param {Object} button The main sidebar control trigger
     * @param {Object|null} options list of options
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     * @param {Object|null} events list of event names
     */

  }]);

  function ControlSidebar(button, options, classNames, selectors, events) {
    var _this9 = this;

    _classCallCheck(this, ControlSidebar);

    // Add parameters to global scope
    this.Default = ControlSidebar.Default;
    this.ClassName = classNames || ControlSidebar.ClassName;
    this.Selector = selectors || ControlSidebar.Selector;
    this.Event = events || ControlSidebar.Event;

    this.element = document.querySelector(this.Selector.sidebar);

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // Get main page body element
    this.body = document.querySelector('body');

    // Toggle open/close
    if (!button) return;
    button.addEventListener('click', function (e) {
      e.preventDefault();
      _this9.toggle();
      _this9.fix();
    });

    window.addEventListener('resize', this.fix.bind(this));
  }

  /**
   * Fix sidebar height
   */


  _createClass(ControlSidebar, [{
    key: 'fix',
    value: function fix() {
      if (this.body.classList.contains(this.ClassName.boxed)) {
        var sbg = document.querySelector(this.Selector.bg);
        var wrapper = document.querySelector(this.Selector.wrapper);

        if (sbg && wrapper) {
          sbg.style.position = 'absolute';
          sbg.style.height = wrapper.innerHeight;
        }
      }
    }

    /**
     * Toggle sidebar open/close
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      var sidebar = document.querySelector(this.Selector.sidebar);

      if (!sidebar) return;

      this.fix();

      if (!sidebar.classList.contains(this.ClassName.open) && !this.body.classList.contains(this.ClassName.open)) {
        this.expand();
      } else {
        this.collapse();
      }
    }

    /**
     * Open Sidebar
     */

  }, {
    key: 'expand',
    value: function expand() {
      if (!this.options.slide) {
        this.body.classList.add(this.ClassName.open);
      } else {
        this.element.classList.add(this.ClassName.open);
      }

      this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
    }

    /**
     * Close Sidebr
     */

  }, {
    key: 'collapse',
    value: function collapse() {
      this.body.classList.remove(this.ClassName.open);
      this.element.classList.remove(this.ClassName.open);

      this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
    }
  }]);

  return ControlSidebar;
}();

/**
 * Default Options
 * @type {Object}
 */


ControlSidebar.Default = {
  slide: true
};

/**
 * Selectors for query selections
 * @type {Object}
 */
ControlSidebar.Selector = {
  data: '[data-toggle="control-sidebar"]',
  bg: '.control-sidebar-bg',
  wrapper: '.wrapper',
  sidebar: '.control-sidebar'
};

/**
 * DOM Class Names
 * @type {Object}
 */
ControlSidebar.ClassName = {
  open: 'control-sidebar-open',
  boxed: 'layout-boxed'
};

/**
 * Custom Events
 * @type {Object}
 */
ControlSidebar.Event = {
  expanded: 'controlsidebar_expanded',
  collapsed: 'controlsidebar_collapsed'
};

runner.push(ControlSidebar.bind);

/* global runner */
/* global Utilities */

/* BoxRefresh()
 * =========
 * Adds AJAX content control to a box.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE BoxRefresh.js jQuery Plugin
 *
 * @Usage: new BoxRefresh(element, options);
 *         or add [data-widget="box-refresh"] to the box element
 *         Pass any option as data-option="value"
 */

var BoxRefresh = function () {
  _createClass(BoxRefresh, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(BoxRefresh.Selector.data), function (element) {
        return new BoxRefresh(element);
      });
    }

    /**
     * Binds Listeners to DOM
     * @param {Object} element The main sidebar element
     * @param {Object|null} options list of options
     * @param {Object|null} selectors list of dom selectors
     */

  }]);

  function BoxRefresh(element, options, selectors) {
    _classCallCheck(this, BoxRefresh);

    // Add parameters to global scope
    this.Default = BoxRefresh.Default;
    this.Selector = selectors || BoxRefresh.Selector;

    this.element = element;

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    if (this.options.source === '') {
      throw new Error('Source url was not defined. Please specify a url in your BoxRefresh source option.');
    }

    this.setUpListeners();
    this.load();
  }

  /**
   * Bind listener on refresh trigger
   */


  _createClass(BoxRefresh, [{
    key: 'setUpListeners',
    value: function setUpListeners() {
      var _this10 = this;

      var trigger = this.element.querySelector(this.options.trigger);
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        _this10.load();
      });
    }

    /**
     * Load Content
     */

  }, {
    key: 'load',
    value: function load() {
      var _this11 = this;

      // Add loading overlay
      if (this.options.showOverlay) {
        this.addOverlay();
      }

      // Try to convert string to object – for headers/param definition
      var stringToObj = function stringToObj(s) {
        var obj = typeof s === 'string' ? JSON.parse(s) : s;
        return obj;
      };

      // Declare method for http callout
      var httpRequest = function httpRequest(resolve, reject) {
        // Create param string
        var params = '?';
        _this11.options.params = stringToObj(_this11.options.params);
        Object.keys(_this11.options.params).map(function (param) {
          params = '' + params + param + '=' + _this11.options.params[param] + '&';
          return params;
        });
        params = params.substring(0, params.length - 1);

        // HTTP Request
        _this11.xhr = new XMLHttpRequest();
        _this11.xhr.open('GET', '' + _this11.options.source + params);

        // Add headers
        _this11.options.headers = stringToObj(_this11.options.headers);
        Object.keys(_this11.options.headers).map(function (header) {
          return _this11.xhr.setRequestHeader(header, _this11.options.headers[header]);
        });

        _this11.xhr.onload = function () {
          if (_this11.xhr.status >= 200 && _this11.xhr.status < 300) {
            resolve(_this11.xhr.response);
          } else {
            reject(_this11.xhr.statusText);
          }
        };

        _this11.xhr.onerror = function () {
          return reject(_this11.xhr.statusText);
        };
        _this11.xhr.send();
      };

      // Declare method for resolving of request
      var httpResolve = function httpResolve(response) {
        if (typeof _this11.options.onLoadDone === 'string') {
          window[_this11.options.onLoadDone](_this11, response);
        } else {
          _this11.options.onLoadDone.call(_this11, response);
        }

        // remove loading overlay if it was shown
        if (_this11.options.showOverlay) {
          _this11.removeOverlay();
        }

        if (_this11.options.loadInContent) {
          _this11.element.querySelector(_this11.options.content).innerHTML = response;
        }
      };

      /**
       * Start with custom pre-callout method
       */
      var request = new Promise(function (resolve, reject) {
        if (typeof _this11.options.onLoadStart === 'string') {
          window[_this11.options.onLoadStart](_this11, reject, resolve);
        } else {
          _this11.options.onLoadStart.call(_this11, reject, resolve);
        }
      });

      /**
       * Main HTTP Request here
       */
      request.then(function () {
        return new Promise(function (resolve, reject) {
          return httpRequest(resolve, reject);
        });
      })
      /**
       * Remove loading overlay and call post-callout method
       */
      .then(function (response) {
        return httpResolve(response);
      }).catch(function (response) {
        return httpResolve(response);
      });
    }

    /**
     * Add loading overlay to element
     */

  }, {
    key: 'addOverlay',
    value: function addOverlay() {
      this.element.innerHTML += this.options.overlayTemplate;
    }

    /**
     * Remove loading overlay
     */

  }, {
    key: 'removeOverlay',
    value: function removeOverlay() {
      var overlay = this.element.querySelector(this.Selector.overlay);
      if (overlay) overlay.remove();
      this.setUpListeners();
    }
  }]);

  return BoxRefresh;
}();

/**
 * Default Options
 * @type {Object}
 */


BoxRefresh.Default = {
  source: '',
  params: {},
  headers: {},
  trigger: '.refresh-btn',
  content: '.box-body',
  loadInContent: true,
  responseType: '',
  showOverlay: true,
  overlayTemplate: '<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>',
  onLoadStart: function onLoadStart(reject, resolve) {
    resolve();
  }, // pass as method name in data-attr
  onLoadDone: function onLoadDone(response) {
    return response;
  } // pass as method name in data-attr
};

/**
 * Selectors for query selections
 * @type {Object}
 */
BoxRefresh.Selector = {
  data: '[data-widget="box-refresh"]',
  overlay: '.overlay'
};

runner.push(BoxRefresh.bind);

/* global runner */
/* global Velocity */
/* global Utilities */

/* BoxWidget()
 * =========
 * Adds AJAX content control to a box.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE BoxWidget.js jQuery Plugin
 *
 * @Usage: new BoxWidget(element, options);
 *         or add [data-widget="box-refresh"] to the box element
 *         Pass any option as data-option="value"
 */

var BoxWidget = function () {
  _createClass(BoxWidget, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(BoxWidget.Selector.data), function (element) {
        return new BoxWidget(element);
      });
    }

    /**
     * Add event listeners to box buttons if exists
     * @param {Object} element The main sidebar element
     * @param {Object|null} options list of options
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     * @param {Object|null} events list of event names
     */

  }]);

  function BoxWidget(element, options, classNames, selectors, events) {
    _classCallCheck(this, BoxWidget);

    // Add parameters to global scope
    this.Default = BoxWidget.Default;
    this.ClassName = classNames || BoxWidget.ClassName;
    this.Selector = selectors || BoxWidget.Selector;
    this.Event = events || BoxWidget.Event;
    this.element = element;

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    // bind listeners
    this.setUpListeners();
  }

  /**
   * Set up box widget button listeners
   */


  _createClass(BoxWidget, [{
    key: 'setUpListeners',
    value: function setUpListeners() {
      var _this12 = this;

      // Bind Collapse Events
      Array.prototype.forEach.call(this.element.querySelectorAll(this.options.collapseTrigger), function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          _this12.toggle();
        });
      });

      // Bind Remove Events
      Array.prototype.forEach.call(this.element.querySelectorAll(this.options.removeTrigger), function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          _this12.remove();
        });
      });
    }

    /**
     * Toggle the collapse state of the box
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      var isOpen = !this.element.classList.contains(this.ClassName.collapsed);

      if (isOpen) {
        this.collapse();
      } else {
        this.expand();
      }
    }

    /**
     * Remove box
     */

  }, {
    key: 'remove',
    value: function remove() {
      var _this13 = this;

      // Slide whole element up to remove if velocity defined, else just hide
      if (typeof Velocity === 'undefined') {
        this.element.dispatchEvent(new CustomEvent(this.Event.removed));
        this.element.remove();
      } else {
        Velocity(this.element, 'slideUp', {
          easing: this.options.easing,
          duration: this.options.animationSpeed
        }).then(function () {
          _this13.element.dispatchEvent(new CustomEvent(_this13.Event.removed));
          _this13.element.remove();
        });
      }
    }

    /**
     * Collapse box by sliding up elements
     */

  }, {
    key: 'collapse',
    value: function collapse() {
      var _this14 = this;

      // Change collapse icon(s) to show expanded icon
      var collapseIcons = this.element.querySelectorAll('.' + this.options.collapseIcon);

      Array.prototype.forEach.call(collapseIcons, function (i) {
        i.classList.remove(_this14.options.collapseIcon);
        i.classList.add(_this14.options.expandIcon);
      });

      // Determine whether to dispatch collapsed event
      var dispatchEvent = function dispatchEvent(fireEvent) {
        if (fireEvent) {
          _this14.element.dispatchEvent(new CustomEvent(_this14.Event.collapsed));
        }
      };

      // Slide elements up
      var slideUp = function slideUp(element, fireEvent) {
        var boxElement = element;
        if (boxElement) {
          // Slide if velocity exists, otherwise just hide
          if (typeof Velocity === 'undefined') {
            boxElement.style.display = 'none';
            dispatchEvent(fireEvent);
          } else {
            Velocity(boxElement, 'slideUp', {
              easing: _this14.options.easing,
              duration: _this14.options.animationSpeed
            }).then(function () {
              dispatchEvent(fireEvent);
            });
          }
        }
      };

      // Slide both body and footer
      slideUp(this.element.querySelector(this.Selector.footer));
      slideUp(this.element.querySelector(this.Selector.body), true);

      // Add collapsed class after animation finished
      setTimeout(function () {
        return _this14.element.classList.add(_this14.ClassName.collapsed);
      }, this.options.animationSpeed);
    }

    /**
     * Expand box by sliding down elements
     */

  }, {
    key: 'expand',
    value: function expand() {
      var _this15 = this;

      // Change collapse icon(s) to show expanded icon
      var collapseIcons = this.element.querySelectorAll('.' + this.options.expandIcon);

      Array.prototype.forEach.call(collapseIcons, function (i) {
        i.classList.remove(_this15.options.expandIcon);
        i.classList.add(_this15.options.collapseIcon);
      });

      // Determine whether to dispatch expanded event
      var dispatchEvent = function dispatchEvent(fireEvent) {
        if (fireEvent) {
          _this15.element.dispatchEvent(new CustomEvent(_this15.Event.expanded));
        }
      };

      // Slide elements up
      var slideDown = function slideDown(element, fireEvent) {
        var boxElement = element;
        if (boxElement) {
          // Slide if velocity exists, otherwise just show
          if (typeof Velocity === 'undefined') {
            boxElement.style.display = 'block';
            dispatchEvent(fireEvent);
          } else {
            Velocity(element, 'slideDown', {
              easing: _this15.options.easing,
              duration: _this15.options.animationSpeed
            }).then(function () {
              dispatchEvent(fireEvent);
            });
          }
        }
      };

      // Slide both body and footer
      slideDown(this.element.querySelector(this.Selector.footer));
      slideDown(this.element.querySelector(this.Selector.body), true);

      // Add collapsed class after animation finished
      setTimeout(function () {
        return _this15.element.classList.remove(_this15.ClassName.collapsed);
      }, this.options.animationSpeed);
    }
  }]);

  return BoxWidget;
}();

/**
 * Default Options
 * @type {Object}
 */


BoxWidget.Default = {
  animationSpeed: 500,
  easing: 'easeInSine',
  collapseTrigger: '[data-widget="collapse"]',
  removeTrigger: '[data-widget="remove"]',
  collapseIcon: 'fa-minus',
  expandIcon: 'fa-plus',
  removeIcon: 'fa-times'
};

/**
 * Selectors for query selections
 * @type {Object}
 */
BoxWidget.Selector = {
  data: '.box',
  // collapsed: '.collapsed-box',
  body: '.box-body',
  footer: '.box-footer'
  // tools: '.box-tools',
};

/**
 * DOM Class Names
 * @type {Object}
 */
BoxWidget.ClassName = {
  collapsed: 'collapsed-box'
};

/**
 * Custom Events
 * @type {Object}
 */
BoxWidget.Event = {
  collapsed: 'boxwidget_collapsed',
  expanded: 'boxwidget_expanded',
  removed: 'boxwidget_remove'
};

runner.push(BoxWidget.bind);

/* global runner */

/* DirectChat()
 * ===============
 * Toggles the state of the control sidebar
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE DirectChat.js jQuery Plugin
 *
 * @Usage: new DirectChat(element, options)
 *         or add [data-widget="direct-chat"] to the trigger
 */

var DirectChat = function () {
  _createClass(DirectChat, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(DirectChat.Selector.data), function (element) {
        return new DirectChat(element);
      });
    }

    /**
     * Get options, call to set listeners
     * @param {Object} element The main trigger element
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     */

  }]);

  function DirectChat(element, classNames, selectors) {
    _classCallCheck(this, DirectChat);

    // Add parameters to global scope
    this.ClassName = classNames || DirectChat.ClassName;
    this.Selector = selectors || DirectChat.Selector;

    this.element = element;

    this.setUpListener();
  }

  /**
   * Set up event listeners
   */


  _createClass(DirectChat, [{
    key: 'setUpListener',
    value: function setUpListener() {
      var _this16 = this;

      this.element.addEventListener('click', function (e) {
        _this16.toggle();
        e.preventDefault();
      });
    }

    /**
     * Toggle overlay
     */

  }, {
    key: 'toggle',
    value: function toggle() {
      var mainBox = this.element.closest(this.Selector.box);

      if (mainBox) {
        mainBox.classList.toggle(this.ClassName.open);
      }
    }
  }]);

  return DirectChat;
}();

/**
 * Selectors for query selections
 * @type {Object}
 */


DirectChat.Selector = {
  data: '[data-widget="chat-pane-toggle"]',
  box: '.direct-chat'
};

/**
 * DOM Class Names
 * @type {Object}
 */
DirectChat.ClassName = {
  open: 'direct-chat-contacts-open'
};

runner.push(DirectChat.bind);

/* global runner */
/* global Utilities */

/* TodoList()
 * =========
 * Converts a list into a todoList.
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * Adapted from Admin LTE TodoList.js jQuery Plugin
 *
 * @Usage: new TodoList(element, options)
 *         or add [data-widget="todo-list"] to the ul element
 *         Pass any option as data-option="value"
 */

var TodoList = function () {
  _createClass(TodoList, null, [{
    key: 'bind',

    /**
     * Binds listeners onto sidebar elements
     */
    value: function bind() {
      Array.prototype.forEach.call(document.querySelectorAll(TodoList.Selector.data), function (element) {
        return new TodoList(element);
      });
    }

    /**
     * Binds Listeners to DOM
     * @param {Object} element The main checkbox list element
     * @param {Object|null} options list of options
     * @param {Object|null} classNames list of classnames
     * @param {Object|null} selectors list of dom selectors
     */

  }]);

  function TodoList(element, options, classNames, selectors) {
    _classCallCheck(this, TodoList);

    // Add parameters to global scope
    this.Default = TodoList.Default;
    this.Selector = selectors || TodoList.Selector;
    this.ClassName = classNames || TodoList.ClassName;

    this.element = element;

    // Set options here
    this.options = Utilities.grabOptions(this.Default, options, this.element);

    this.setUpListeners();
  }

  /**
   * Set up event listeners
   */


  _createClass(TodoList, [{
    key: 'setUpListeners',
    value: function setUpListeners() {
      var _this17 = this;

      Array.prototype.forEach.call(this.element.querySelectorAll('input[type=checkbox]'), function (el) {
        el.addEventListener('change', function () {
          return _this17.toggle(el);
        });
      });
    }

    /**
     * Handle toggling of checkbox
     * @param {Object} checkbox The Checkbox element
     */

  }, {
    key: 'toggle',
    value: function toggle(checkbox) {
      var listElement = checkbox.closest('li');
      listElement.classList.toggle(this.ClassName.done);

      // Handle checked
      if (checkbox.checked) {
        this.check(checkbox);
      } else {
        this.uncheck(checkbox);
      }
    }

    /**
     * Handle check - call custom method if set
     * @param {Object} checkbox The Checkbox element
     */

  }, {
    key: 'check',
    value: function check(checkbox) {
      if (typeof this.options.onCheck === 'string') {
        window[this.options.onCheck](checkbox);
      } else {
        this.options.onCheck.call(checkbox);
      }
    }

    /**
     * Handle uncheck - call custom method if set
     * @param {Object} checkbox The Checkbox element
     */

  }, {
    key: 'uncheck',
    value: function uncheck(checkbox) {
      if (typeof this.options.onUncheck === 'string') {
        window[this.options.onUncheck](checkbox);
      } else {
        this.options.onUncheck.call(checkbox);
      }
    }
  }]);

  return TodoList;
}();

/**
 * Default Options
 * @type {Object}
 */


TodoList.Default = {
  onCheck: function onCheck(item) {
    return item;
  }, // pass as method name in data-attr
  onUncheck: function onUncheck(item) {
    return item;
  } // pass as method name in data-attr
};

/**
 * Selectors for query selections
 * @type {Object}
 */
TodoList.Selector = {
  data: '[data-widget="todo-list"]'
};

/**
 * DOM Class Names
 * @type {Object}
 */
TodoList.ClassName = {
  done: 'done'
};

runner.push(TodoList.bind);
//# sourceMappingURL=adminlite.babel.js.map
