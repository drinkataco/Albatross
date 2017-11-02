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
