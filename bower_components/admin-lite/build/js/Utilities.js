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
