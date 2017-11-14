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
    const searchInput = this.body.querySelector(this.Selector.searchInput);

    if (searchInput) {
      searchInput.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
        },
      );
    }

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
