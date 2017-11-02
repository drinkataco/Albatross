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
