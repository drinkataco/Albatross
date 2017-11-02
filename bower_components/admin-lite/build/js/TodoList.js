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
