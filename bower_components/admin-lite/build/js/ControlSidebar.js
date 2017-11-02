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
