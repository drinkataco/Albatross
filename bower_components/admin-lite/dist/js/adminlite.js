/*! Albatross app.js
* ================
* Development*
* @Author  Josh Walwyn
*/

const runner = [];

window.onload = () => runner.map(run => run());

/**
 * Utilities
 *
 * @author Josh Walwyn <me@joshwalwyn.com>
 *
 * @type {Object}
 */
const Utilities = {};

/**
 * Finds children of element
 * @param {String} nodeType   Required node type, such as LI, DIV
 * @param {String} className  Name of class to grab
 * @param {Object} parentNode Node of who's children to traverse through
 * @return {List<Object>}      List of found elements
 */
Utilities.findChildren = (nodeType, className, parentNode) => {
  const found = [];
  let child = parentNode.firstChild;
  while (child) {
    if (child.nodeName === nodeType &&
        child.classList.contains(className)) {
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
Utilities.grabOptions = (def, current, element, fields) => {
  // Keep all option variations here
  const options = {};
  options.default = def;
  options.current = current || {};
  options.calculated = {};

  // Get FieldNames
  const fieldsToFetch = fields || Object.keys(def);

  // Loop through fields to get option match
  for (let i = 0; i < fieldsToFetch.length; i += 1) {
    const fieldName = fieldsToFetch[i];
    let value;

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
    value = (value === 'false') ? false : value;

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
class Tree {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(Tree.Selector.data),
      element => new Tree(element),
    );
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
  constructor(element, options, classNames, selectors, events) {
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
    const active = this.element.querySelector(this.Selector.activeTreeview);

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
  setUpListeners() {
    // Binds a click event listener for each element
    Array.prototype.forEach.call(
      this.element.querySelectorAll(this.options.trigger),
      (context) => {
        context.addEventListener('click', (event) => {
          this.toggle(context, event);
        });
      },
    );
  }

  /**
   * Handle show/hide of collapsible menus
   * @param {Object} link  The link element clicked
   * @param {Object} event The Triggered Event
   */
  toggle(link, event) {
    // Get contextual DOM elements
    const parentLi = link.parentNode;
    const isOpen = parentLi.classList.contains(this.ClassName.open);
    const treeviewMenu = Utilities.findChildren('UL', this.ClassName.treeviewMenu, parentLi);

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
  collapse(tree, parentLi) {
    parentLi.classList.remove(this.ClassName.open);

    const treeLocal = tree;

    Array.prototype.forEach.call(treeLocal, (t) => {
      const treeItem = t;
      if (typeof Velocity === 'undefined') {
        treeItem.style.display = 'none';
        this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
      } else {
        Velocity(treeItem, 'slideUp', {
          easing: this.options.easing,
          duration: this.options.animationSpeed,
        }).then(() => {
          // Call custom event to indicate collapse
          this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
        });
      }
    });
  }

  /**
   * Expand menu selection, and close all siblings
   * @param {Object} tree     The child tree/menu
   * @param {Object} parentLi The parent element that contains the tree
   */
  expand(tree, parentLi) {
    // We need to access direct siblings to support multilevel menus remaining open
    const openMenus = Utilities.findChildren('LI', this.ClassName.open, parentLi.parentNode);

    // For each currently opened menu (which should be just 1) we should close
    if (this.options.accordion) {
      Array.prototype.forEach.call(openMenus, (menu) => {
        const openTree = Utilities.findChildren('UL', this.ClassName.treeviewMenu, menu);

        // Collapse
        this.collapse(openTree, menu);
      });
    }

    // Open this menu
    parentLi.classList.add(this.ClassName.open);

    const firstTree = tree[0]; // Only the direct descendant needs to be closed
    if (typeof Velocity === 'undefined') {
      firstTree.style.display = 'block';
      this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
    } else {
      Velocity(firstTree, 'slideDown', {
        easing: this.options.easing,
        duration: this.options.animationSpeed,
      }).then(() => {
        // Call custom event to indicate expansion
        this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
      });
    }
  }
}

/**
 * Default Options
 * @type {Object}
 */
Tree.Default = {
  animationSpeed: 300,
  accordion: true,
  followLink: true,
  trigger: '.treeview a',
  easing: 'easeInSine',
};

/**
 * Selectors for query selections
 * @type {Object}
 */
Tree.Selector = {
  data: '[data-widget="tree"]',
  activeTreeview: '.treeview.active',
};

/**
 * DOM Class Names
 * @type {Object}
 */
Tree.ClassName = {
  open: 'menu-open',
  tree: 'tree',
  treeview: 'treeview',
  treeviewMenu: 'treeview-menu',
};

/**
 * Custom Events
 * @type {Object}
 */
Tree.Event = {
  expanded: 'tree_expanded',
  collapsed: 'tree_collapsed',
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
class PushMenu {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(PushMenu.Selector.button),
      button => new PushMenu(button),
    );
  }

  /**
   * Binds Listeners to DOM
   * @param {Object} element The main sidebar element
   * @param {Object|null} options list of options
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   */
  constructor(element, options, classNames, selectors) {
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
    if (this.options.expandOnHover ||
        (this.body.classList.contains(this.ClassName.mini) &&
         this.body.classList.contains(this.ClassName.layoutFixed))) {
      this.expandOnHover();
      this.body.classList.add(this.ClassName.expandFeature);
    }

    // Enable hide menu when clicking on the content-wrapper on small screens
    this.body.getElementsByClassName(this.ClassName.contentWrapper)[0]
      .addEventListener(
        'click',
        () => {
          if (this.windowWidth <= this.options.collapseScreenSize &&
            this.body.classList.contains(this.ClassName.open)) {
            this.close();
          }
        },
      );

    // Fix for android devices
    this.body.querySelector(this.Selector.searchInput)
      .addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
      );


    // Bind functionality to close/open sidebar
    this.setUpListeners();
  }

  /**
   * Binds an event listener to each parent menu element
   */
  setUpListeners() {
    this.element.addEventListener('click', (event) => {
      // And contextual Window Width
      this.windowWidth = window.innerWidth;

      event.preventDefault();
      this.toggle();
    });
  }

  /**
   * Toggle sidebar open/close
   */
  toggle() {
    let isOpen = !this.body.classList.contains(this.ClassName.collapsed);

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
  open() {
    if (this.windowWidth > this.options.collapseScreenSize) {
      this.body.classList.remove(this.ClassName.collapsed);
    } else {
      this.body.classList.add(this.ClassName.open);
    }
  }

  /**
   * Close the sidebar
   */
  close() {
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
  expand() {
    window.setTimeout(() => {
      this.body.classList.remove(this.ClassName.collapsed);
      this.body.classList.add(this.ClassName.expanded);
    }, this.options.expandTransitionDelay);
  }

  /**
   * Collapse with time delay via mouseout hover
   */
  collapse() {
    window.setTimeout(() => {
      this.body.classList.remove(this.ClassName.expanded);
      this.body.classList.add(this.ClassName.collapsed);
    }, this.options.expandTransitionDelay);
  }

  /**
   * Bind mouseover and mouseleave events to colapse/expand sidebar
   */
  expandOnHover() {
    Array.prototype.forEach.call(
      document.getElementsByClassName(this.ClassName.mainSidebar),
      (context) => {
        context.addEventListener('mouseover', () => {
          // Handle Expansion
          if (this.body.classList.contains(this.ClassName.mini) &&
              this.body.classList.contains(this.ClassName.collapsed) &&
              this.windowWidth > this.options.collapseScreenSize) {
            this.expand();
          }
        });

        // handle Close the sidebar
        context.addEventListener('mouseleave', () => {
          if (this.body.classList.contains(this.ClassName.expanded)) {
            this.collapse();
          }
        });
      },
    );
  }
}

/**
 * Default Options
 * @type {Object}
 */
PushMenu.Default = {
  collapseScreenSize: 767,
  expandOnHover: false,
  expandTransitionDelay: 0,
};

/**
 * Selectors for query selections
 * @type {Object}
 */
PushMenu.Selector = {
  button: '[data-toggle="push-menu"]',
  mainLogo: '.main-header .logo',
  searchInput: '.sidebar-form .form-control',
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
  expandFeature: 'sidebar-mini-expand-feature',
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
class Layout {
  /**
   * Constructor
   * @param {Object|null} options list of options
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   */
  constructor(options, classNames, selectors) {
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
  activate() {
    this.fixLayout();

    if (this.options.transitionEnabled) {
      this.element.classList.remove(this.ClassName.holdTransition);
    }

    // Reset main wrapper elements
    if (this.options.resetHeight) {
      const elements = document.querySelectorAll(this.Selector.heightReset);

      Array.prototype.forEach.call(elements, (el) => {
        const elC = el;
        elC.style.height = 'auto';
        elC.style.minHeight = '100%';
      });
    }

    // Resize when window is resized
    if (!this.bindedResize) {
      window.addEventListener('resize', this.fixLayout.bind(this));

      const elLogo = document.querySelector(this.Selector.logo);
      const elSidebar = document.querySelector(this.ClassName.sidebar);

      if (elLogo) elLogo.addEventListener('transitionend', this.fixLayout.bind(this));
      if (elSidebar) elSidebar.addEventListener('transitionend', this.fixLayout.bind(this));

      this.bindedResize = true;
    }

    // If sidebar menu has expanded options, ensure layout is recalculated
    const sidebarMenu = document.querySelector(this.Selector.sidebarMenu);

    if (sidebarMenu) {
      sidebarMenu.addEventListener(Tree.Event.expanded, this.fixLayout.bind(this));
      sidebarMenu.addEventListener(Tree.Event.collapsed, this.fixLayout.bind(this));
    }
  }

  /**
   * Fix content height so it fills the page
   */
  fix() {
    // Get all elements
    const elFooter = document.querySelector(this.Selector.mainFooter);
    const elSidebar = document.querySelector(this.Selector.sidebar);
    const elHeader = document.querySelector(this.Selector.mainHeader);
    const elWrapper = document.querySelector(this.Selector.contentWrapper);

    // We need a wrapper, otherwise lets just bail now
    if (!elWrapper) {
      return;
    }

    // Remove overflow from .wrapper if layout-boxed exists
    const boxedWrapper = document.querySelector(`${this.Selector.layoutBoxed} > ${this.Selector.wrapper}`);
    if (boxedWrapper) {
      boxedWrapper.style.overflow = 'hidden';
    }

    // Get values for height, or set defaults
    const footerHeight = (elFooter) ? elFooter.offsetHeight : 0;
    const sidebarHeight = (elSidebar) ? elSidebar.offsetHeight : 0;
    const windowHeight = window.innerHeight;
    const neg = (elHeader) ? elHeader.offsetHeight + footerHeight : footerHeight;

    let postSetHeight;

    // Set the min-height of the content and sidebar based on
    // the height of the document.
    if (document.querySelector('body').classList.contains(this.ClassName.fixed)) {
      elWrapper.style.minHeight = `${windowHeight - footerHeight}px`;
    } else {
      // Set height of page
      if (windowHeight >= sidebarHeight) {
        postSetHeight = windowHeight - neg;
        elWrapper.style.minHeight = `${postSetHeight}px`;
      } else {
        postSetHeight = sidebarHeight;
        elWrapper.style.minHeight = `${postSetHeight}px`;
      }

      // Fix for the control sidebar height
      const controlSidebar = document.querySelector(this.Selector.controlSidebar);
      if (controlSidebar) {
        if (controlSidebar.clientHeight > postSetHeight) {
          elWrapper.style.minHeight = `${controlSidebar.clientHeight}px`;
        }
      }
    }
  }

  /**
   * Fix Sidebar for scrolling on fixed layout
   */
  fixSidebar() {
    const elHeader = document.querySelector(this.Selector.mainHeader);
    const elSidebar = document.querySelector(this.Selector.sidebar);

    if (!elSidebar) return;

    // Make sure the body tag has the .fixed class otherwise return
    if (!this.element.classList.contains(this.ClassName.fixed)) {
      return;
    }

    // Fix for scrolling here
    const headerHeight = (elHeader) ? elHeader.offsetHeight : 0;
    const windowHeight = window.innerHeight;

    elSidebar.style.height = `${windowHeight - headerHeight}px`;
    elSidebar.style.overflowY = 'scroll';
  }

  /**
   * Proxy for calling both fix methods
   */
  fixLayout() {
    this.fix();
    this.fixSidebar();
  }
}

/**
 * Default Options
 * @type {Object}
 */
Layout.Default = {
  resetHeight: true,
  transitionEnabled: true,
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
  controlSidebar: '.control-sidebar',
};

/**
 * DOM Class Names
 * @type {Object}
 */
Layout.ClassName = {
  holdTransition: 'hold-transition',
  fixed: 'fixed',
};

runner.push(() => new Layout());


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
class ControlSidebar {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    const buttons = document.querySelectorAll(ControlSidebar.Selector.data);

    if (!buttons) return;

    Array.prototype.forEach.call(
      buttons,
      button => new ControlSidebar(button),
    );
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
  constructor(button, options, classNames, selectors, events) {
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
    button.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        this.toggle();
        this.fix();
      },
    );

    window.addEventListener('resize', this.fix.bind(this));
  }

  /**
   * Fix sidebar height
   */
  fix() {
    if (this.body.classList.contains(this.ClassName.boxed)) {
      const sbg = document.querySelector(this.Selector.bg);
      const wrapper = document.querySelector(this.Selector.wrapper);

      if (sbg && wrapper) {
        sbg.style.position = 'absolute';
        sbg.style.height = wrapper.innerHeight;
      }
    }
  }

  /**
   * Toggle sidebar open/close
   */
  toggle() {
    const sidebar = document.querySelector(this.Selector.sidebar);

    if (!sidebar) return;

    this.fix();

    if (!sidebar.classList.contains(this.ClassName.open) &&
        !this.body.classList.contains(this.ClassName.open)) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  /**
   * Open Sidebar
   */
  expand() {
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
  collapse() {
    this.body.classList.remove(this.ClassName.open);
    this.element.classList.remove(this.ClassName.open);

    this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
  }
}

/**
 * Default Options
 * @type {Object}
 */
ControlSidebar.Default = {
  slide: true,
};

/**
 * Selectors for query selections
 * @type {Object}
 */
ControlSidebar.Selector = {
  data: '[data-toggle="control-sidebar"]',
  bg: '.control-sidebar-bg',
  wrapper: '.wrapper',
  sidebar: '.control-sidebar',
};

/**
 * DOM Class Names
 * @type {Object}
 */
ControlSidebar.ClassName = {
  open: 'control-sidebar-open',
  boxed: 'layout-boxed',
};

/**
 * Custom Events
 * @type {Object}
 */
ControlSidebar.Event = {
  expanded: 'controlsidebar_expanded',
  collapsed: 'controlsidebar_collapsed',
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
class BoxRefresh {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(BoxRefresh.Selector.data),
      element => new BoxRefresh(element),
    );
  }

  /**
   * Binds Listeners to DOM
   * @param {Object} element The main sidebar element
   * @param {Object|null} options list of options
   * @param {Object|null} selectors list of dom selectors
   */
  constructor(element, options, selectors) {
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
  setUpListeners() {
    const trigger = this.element.querySelector(this.options.trigger);
    trigger.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        this.load();
      },
    );
  }

  /**
   * Load Content
   */
  load() {
    // Add loading overlay
    if (this.options.showOverlay) {
      this.addOverlay();
    }

    // Try to convert string to object – for headers/param definition
    const stringToObj = (s) => {
      const obj = (typeof s === 'string') ? JSON.parse(s) : s;
      return obj;
    };

    // Declare method for http callout
    const httpRequest = (resolve, reject) => {
      // Create param string
      let params = '?';
      this.options.params = stringToObj(this.options.params);
      Object.keys(this.options.params).map((param) => {
        params = `${params}${param}=${this.options.params[param]}&`;
        return params;
      });
      params = params.substring(0, params.length - 1);

      // HTTP Request
      this.xhr = new XMLHttpRequest();
      this.xhr.open('GET', `${this.options.source}${params}`);

      // Add headers
      this.options.headers = stringToObj(this.options.headers);
      Object.keys(this.options.headers).map(header =>
        this.xhr.setRequestHeader(header, this.options.headers[header]));

      this.xhr.onload = () => {
        if (this.xhr.status >= 200 && this.xhr.status < 300) {
          resolve(this.xhr.response);
        } else {
          reject(this.xhr.statusText);
        }
      };

      this.xhr.onerror = () => reject(this.xhr.statusText);
      this.xhr.send();
    };

    // Declare method for resolving of request
    const httpResolve = (response) => {
      if (typeof this.options.onLoadDone === 'string') {
        window[this.options.onLoadDone](this, response);
      } else {
        this.options.onLoadDone.call(this, response);
      }

      // remove loading overlay if it was shown
      if (this.options.showOverlay) {
        this.removeOverlay();
      }

      if (this.options.loadInContent) {
        this.element.querySelector(this.options.content).innerHTML = response;
      }
    };

    /**
     * Start with custom pre-callout method
     */
    const request = new Promise((resolve, reject) => {
      if (typeof this.options.onLoadStart === 'string') {
        window[this.options.onLoadStart](this, reject, resolve);
      } else {
        this.options.onLoadStart.call(this, reject, resolve);
      }
    });

    /**
     * Main HTTP Request here
     */
    request.then(() => new Promise((resolve, reject) => httpRequest(resolve, reject)))
      /**
       * Remove loading overlay and call post-callout method
       */
      .then(response => httpResolve(response))
      .catch(response => httpResolve(response));
  }

  /**
   * Add loading overlay to element
   */
  addOverlay() {
    this.element.innerHTML += this.options.overlayTemplate;
  }

  /**
   * Remove loading overlay
   */
  removeOverlay() {
    const overlay = this.element.querySelector(this.Selector.overlay);
    if (overlay) overlay.remove();
    this.setUpListeners();
  }
}

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
  onLoadStart: (reject, resolve) => { resolve(); }, // pass as method name in data-attr
  onLoadDone: response => response, // pass as method name in data-attr
};

/**
 * Selectors for query selections
 * @type {Object}
 */
BoxRefresh.Selector = {
  data: '[data-widget="box-refresh"]',
  overlay: '.overlay',
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
class BoxWidget {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(BoxWidget.Selector.data),
      element => new BoxWidget(element),
    );
  }

  /**
   * Add event listeners to box buttons if exists
   * @param {Object} element The main sidebar element
   * @param {Object|null} options list of options
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   * @param {Object|null} events list of event names
   */
  constructor(element, options, classNames, selectors, events) {
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
  setUpListeners() {
    // Bind Collapse Events
    Array.prototype.forEach.call(
      this.element.querySelectorAll(this.options.collapseTrigger),
      (el) => {
        el.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            this.toggle();
          },
        );
      },
    );

    // Bind Remove Events
    Array.prototype.forEach.call(
      this.element.querySelectorAll(this.options.removeTrigger),
      (el) => {
        el.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            this.remove();
          },
        );
      },
    );
  }

  /**
   * Toggle the collapse state of the box
   */
  toggle() {
    const isOpen = !this.element.classList.contains(this.ClassName.collapsed);

    if (isOpen) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * Remove box
   */
  remove() {
    // Slide whole element up to remove if velocity defined, else just hide
    if (typeof Velocity === 'undefined') {
      this.element.dispatchEvent(new CustomEvent(this.Event.removed));
      this.element.remove();
    } else {
      Velocity(this.element, 'slideUp', {
        easing: this.options.easing,
        duration: this.options.animationSpeed,
      }).then(() => {
        this.element.dispatchEvent(new CustomEvent(this.Event.removed));
        this.element.remove();
      });
    }
  }

  /**
   * Collapse box by sliding up elements
   */
  collapse() {
    // Change collapse icon(s) to show expanded icon
    const collapseIcons = this.element.querySelectorAll(`.${this.options.collapseIcon}`);

    Array.prototype.forEach.call(collapseIcons, (i) => {
      i.classList.remove(this.options.collapseIcon);
      i.classList.add(this.options.expandIcon);
    });

    // Determine whether to dispatch collapsed event
    const dispatchEvent = (fireEvent) => {
      if (fireEvent) {
        this.element.dispatchEvent(new CustomEvent(this.Event.collapsed));
      }
    };

    // Slide elements up
    const slideUp = (element, fireEvent) => {
      const boxElement = element;
      if (boxElement) {
        // Slide if velocity exists, otherwise just hide
        if (typeof Velocity === 'undefined') {
          boxElement.style.display = 'none';
          dispatchEvent(fireEvent);
        } else {
          Velocity(boxElement, 'slideUp', {
            easing: this.options.easing,
            duration: this.options.animationSpeed,
          }).then(() => {
            dispatchEvent(fireEvent);
          });
        }
      }
    };

    // Slide both body and footer
    slideUp(this.element.querySelector(this.Selector.footer));
    slideUp(this.element.querySelector(this.Selector.body), true);

    // Add collapsed class after animation finished
    setTimeout(
      () => this.element.classList.add(this.ClassName.collapsed),
      this.options.animationSpeed,
    );
  }

  /**
   * Expand box by sliding down elements
   */
  expand() {
    // Change collapse icon(s) to show expanded icon
    const collapseIcons = this.element.querySelectorAll(`.${this.options.expandIcon}`);

    Array.prototype.forEach.call(collapseIcons, (i) => {
      i.classList.remove(this.options.expandIcon);
      i.classList.add(this.options.collapseIcon);
    });

    // Determine whether to dispatch expanded event
    const dispatchEvent = (fireEvent) => {
      if (fireEvent) {
        this.element.dispatchEvent(new CustomEvent(this.Event.expanded));
      }
    };

    // Slide elements up
    const slideDown = (element, fireEvent) => {
      const boxElement = element;
      if (boxElement) {
        // Slide if velocity exists, otherwise just show
        if (typeof Velocity === 'undefined') {
          boxElement.style.display = 'block';
          dispatchEvent(fireEvent);
        } else {
          Velocity(element, 'slideDown', {
            easing: this.options.easing,
            duration: this.options.animationSpeed,
          }).then(() => {
            dispatchEvent(fireEvent);
          });
        }
      }
    };

    // Slide both body and footer
    slideDown(this.element.querySelector(this.Selector.footer));
    slideDown(this.element.querySelector(this.Selector.body), true);

    // Add collapsed class after animation finished
    setTimeout(
      () => this.element.classList.remove(this.ClassName.collapsed),
      this.options.animationSpeed,
    );
  }
}

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
  removeIcon: 'fa-times',
};

/**
 * Selectors for query selections
 * @type {Object}
 */
BoxWidget.Selector = {
  data: '.box',
  // collapsed: '.collapsed-box',
  body: '.box-body',
  footer: '.box-footer',
  // tools: '.box-tools',
};

/**
 * DOM Class Names
 * @type {Object}
 */
BoxWidget.ClassName = {
  collapsed: 'collapsed-box',
};

/**
 * Custom Events
 * @type {Object}
 */
BoxWidget.Event = {
  collapsed: 'boxwidget_collapsed',
  expanded: 'boxwidget_expanded',
  removed: 'boxwidget_remove',
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
class DirectChat {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(DirectChat.Selector.data),
      element => new DirectChat(element),
    );
  }

  /**
   * Get options, call to set listeners
   * @param {Object} element The main trigger element
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   */
  constructor(element, classNames, selectors) {
    // Add parameters to global scope
    this.ClassName = classNames || DirectChat.ClassName;
    this.Selector = selectors || DirectChat.Selector;

    this.element = element;

    this.setUpListener();
  }

  /**
   * Set up event listeners
   */
  setUpListener() {
    this.element.addEventListener(
      'click',
      (e) => {
        this.toggle();
        e.preventDefault();
      },
    );
  }

  /**
   * Toggle overlay
   */
  toggle() {
    const mainBox = this.element.closest(this.Selector.box);

    if (mainBox) {
      mainBox.classList.toggle(this.ClassName.open);
    }
  }
}

/**
 * Selectors for query selections
 * @type {Object}
 */
DirectChat.Selector = {
  data: '[data-widget="chat-pane-toggle"]',
  box: '.direct-chat',
};

/**
 * DOM Class Names
 * @type {Object}
 */
DirectChat.ClassName = {
  open: 'direct-chat-contacts-open',
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
class TodoList {
  /**
   * Binds listeners onto sidebar elements
   */
  static bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(TodoList.Selector.data),
      element => new TodoList(element),
    );
  }

  /**
   * Binds Listeners to DOM
   * @param {Object} element The main checkbox list element
   * @param {Object|null} options list of options
   * @param {Object|null} classNames list of classnames
   * @param {Object|null} selectors list of dom selectors
   */
  constructor(element, options, classNames, selectors) {
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
  setUpListeners() {
    Array.prototype.forEach.call(
      this.element.querySelectorAll('input[type=checkbox]'),
      (el) => {
        el.addEventListener(
          'change',
          () => this.toggle(el),
        );
      },
    );
  }

  /**
   * Handle toggling of checkbox
   * @param {Object} checkbox The Checkbox element
   */
  toggle(checkbox) {
    const listElement = checkbox.closest('li');
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
  check(checkbox) {
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
  uncheck(checkbox) {
    if (typeof this.options.onUncheck === 'string') {
      window[this.options.onUncheck](checkbox);
    } else {
      this.options.onUncheck.call(checkbox);
    }
  }
}

/**
 * Default Options
 * @type {Object}
 */
TodoList.Default = {
  onCheck: item => item, // pass as method name in data-attr
  onUncheck: item => item, // pass as method name in data-attr
};

/**
 * Selectors for query selections
 * @type {Object}
 */
TodoList.Selector = {
  data: '[data-widget="todo-list"]',
};

/**
 * DOM Class Names
 * @type {Object}
 */
TodoList.ClassName = {
  done: 'done',
};

runner.push(TodoList.bind);
