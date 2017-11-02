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
