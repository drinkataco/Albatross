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
