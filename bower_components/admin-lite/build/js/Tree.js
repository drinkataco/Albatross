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
