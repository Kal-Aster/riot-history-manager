define(['require'], function (require) { 'use strict';

  /* Riot v5.3.1, @license MIT */
  /**
   * Convert a string from camel case to dash-case
   * @param   {string} string - probably a component tag name
   * @returns {string} component name normalized
   */
  function camelToDashCase(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  /**
   * Convert a string containing dashes to camel case
   * @param   {string} string - input string
   * @returns {string} my-string -> myString
   */

  function dashToCamelCase(string) {
    return string.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }

  /**
   * Get all the element attributes as object
   * @param   {HTMLElement} element - DOM node we want to parse
   * @returns {Object} all the attributes found as a key value pairs
   */

  function DOMattributesToObject(element) {
    return Array.from(element.attributes).reduce((acc, attribute) => {
      acc[dashToCamelCase(attribute.name)] = attribute.value;
      return acc;
    }, {});
  }
  /**
   * Move all the child nodes from a source tag to another
   * @param   {HTMLElement} source - source node
   * @param   {HTMLElement} target - target node
   * @returns {undefined} it's a void method ¯\_(ツ)_/¯
   */
  // Ignore this helper because it's needed only for svg tags

  function moveChildren(source, target) {
    if (source.firstChild) {
      target.appendChild(source.firstChild);
      moveChildren(source, target);
    }
  }
  /**
   * Remove the child nodes from any DOM node
   * @param   {HTMLElement} node - target node
   * @returns {undefined}
   */

  function cleanNode(node) {
    clearChildren(node.childNodes);
  }
  /**
   * Clear multiple children in a node
   * @param   {HTMLElement[]} children - direct children nodes
   * @returns {undefined}
   */

  function clearChildren(children) {
    Array.from(children).forEach(removeChild);
  }
  /**
   * Remove a node
   * @param {HTMLElement}node - node to remove
   * @returns {undefined}
   */

  const removeChild = node => node && node.parentNode && node.parentNode.removeChild(node);
  /**
   * Insert before a node
   * @param {HTMLElement} newNode - node to insert
   * @param {HTMLElement} refNode - ref child
   * @returns {undefined}
   */

  const insertBefore = (newNode, refNode) => refNode && refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode);
  /**
   * Replace a node
   * @param {HTMLElement} newNode - new node to add to the DOM
   * @param {HTMLElement} replaced - node to replace
   * @returns {undefined}
   */

  const replaceChild = (newNode, replaced) => replaced && replaced.parentNode && replaced.parentNode.replaceChild(newNode, replaced);

  // Riot.js constants that can be used accross more modules
  const COMPONENTS_IMPLEMENTATION_MAP$1 = new Map(),
        DOM_COMPONENT_INSTANCE_PROPERTY$1 = Symbol('riot-component'),
        PLUGINS_SET$1 = new Set(),
        IS_DIRECTIVE = 'is',
        VALUE_ATTRIBUTE = 'value',
        MOUNT_METHOD_KEY = 'mount',
        UPDATE_METHOD_KEY = 'update',
        UNMOUNT_METHOD_KEY = 'unmount',
        SHOULD_UPDATE_KEY = 'shouldUpdate',
        ON_BEFORE_MOUNT_KEY = 'onBeforeMount',
        ON_MOUNTED_KEY = 'onMounted',
        ON_BEFORE_UPDATE_KEY = 'onBeforeUpdate',
        ON_UPDATED_KEY = 'onUpdated',
        ON_BEFORE_UNMOUNT_KEY = 'onBeforeUnmount',
        ON_UNMOUNTED_KEY = 'onUnmounted',
        PROPS_KEY = 'props',
        STATE_KEY = 'state',
        SLOTS_KEY = 'slots',
        ROOT_KEY = 'root',
        IS_PURE_SYMBOL = Symbol('pure'),
        IS_COMPONENT_UPDATING = Symbol('is_updating'),
        PARENT_KEY_SYMBOL = Symbol('parent'),
        ATTRIBUTES_KEY_SYMBOL = Symbol('attributes'),
        TEMPLATE_KEY_SYMBOL = Symbol('template');

  var globals = /*#__PURE__*/Object.freeze({
    __proto__: null,
    COMPONENTS_IMPLEMENTATION_MAP: COMPONENTS_IMPLEMENTATION_MAP$1,
    DOM_COMPONENT_INSTANCE_PROPERTY: DOM_COMPONENT_INSTANCE_PROPERTY$1,
    PLUGINS_SET: PLUGINS_SET$1,
    IS_DIRECTIVE: IS_DIRECTIVE,
    VALUE_ATTRIBUTE: VALUE_ATTRIBUTE,
    MOUNT_METHOD_KEY: MOUNT_METHOD_KEY,
    UPDATE_METHOD_KEY: UPDATE_METHOD_KEY,
    UNMOUNT_METHOD_KEY: UNMOUNT_METHOD_KEY,
    SHOULD_UPDATE_KEY: SHOULD_UPDATE_KEY,
    ON_BEFORE_MOUNT_KEY: ON_BEFORE_MOUNT_KEY,
    ON_MOUNTED_KEY: ON_MOUNTED_KEY,
    ON_BEFORE_UPDATE_KEY: ON_BEFORE_UPDATE_KEY,
    ON_UPDATED_KEY: ON_UPDATED_KEY,
    ON_BEFORE_UNMOUNT_KEY: ON_BEFORE_UNMOUNT_KEY,
    ON_UNMOUNTED_KEY: ON_UNMOUNTED_KEY,
    PROPS_KEY: PROPS_KEY,
    STATE_KEY: STATE_KEY,
    SLOTS_KEY: SLOTS_KEY,
    ROOT_KEY: ROOT_KEY,
    IS_PURE_SYMBOL: IS_PURE_SYMBOL,
    IS_COMPONENT_UPDATING: IS_COMPONENT_UPDATING,
    PARENT_KEY_SYMBOL: PARENT_KEY_SYMBOL,
    ATTRIBUTES_KEY_SYMBOL: ATTRIBUTES_KEY_SYMBOL,
    TEMPLATE_KEY_SYMBOL: TEMPLATE_KEY_SYMBOL
  });

  const EACH = 0;
  const IF = 1;
  const SIMPLE = 2;
  const TAG = 3;
  const SLOT = 4;
  var bindingTypes = {
    EACH,
    IF,
    SIMPLE,
    TAG,
    SLOT
  };

  const ATTRIBUTE = 0;
  const EVENT = 1;
  const TEXT = 2;
  const VALUE = 3;
  var expressionTypes = {
    ATTRIBUTE,
    EVENT,
    TEXT,
    VALUE
  };

  const HEAD_SYMBOL = Symbol('head');
  const TAIL_SYMBOL = Symbol('tail');

  /**
   * Create the <template> fragments comment nodes
   * @return {Object} {{head: Comment, tail: Comment}}
   */

  function createHeadTailPlaceholders() {
    const head = document.createComment('fragment head');
    const tail = document.createComment('fragment tail');
    head[HEAD_SYMBOL] = true;
    tail[TAIL_SYMBOL] = true;
    return {
      head,
      tail
    };
  }

  /**
   * Create the template meta object in case of <template> fragments
   * @param   {TemplateChunk} componentTemplate - template chunk object
   * @returns {Object} the meta property that will be passed to the mount function of the TemplateChunk
   */

  function createTemplateMeta(componentTemplate) {
    const fragment = componentTemplate.dom.cloneNode(true);
    const {
      head,
      tail
    } = createHeadTailPlaceholders();
    return {
      avoidDOMInjection: true,
      fragment,
      head,
      tail,
      children: [head, ...Array.from(fragment.childNodes), tail]
    };
  }

  /**
   * Get the current <template> fragment children located in between the head and tail comments
   * @param {Comment} head - head comment node
   * @param {Comment} tail - tail comment node
   * @return {Array[]} children list of the nodes found in this template fragment
   */

  function getFragmentChildren(_ref) {
    let {
      head,
      tail
    } = _ref;
    const nodes = walkNodes([head], head.nextSibling, n => n === tail, false);
    nodes.push(tail);
    return nodes;
  }
  /**
   * Recursive function to walk all the <template> children nodes
   * @param {Array[]} children - children nodes collection
   * @param {ChildNode} node - current node
   * @param {Function} check - exit function check
   * @param {boolean} isFilterActive - filter flag to skip nodes managed by other bindings
   * @returns {Array[]} children list of the nodes found in this template fragment
   */

  function walkNodes(children, node, check, isFilterActive) {
    const {
      nextSibling
    } = node; // filter tail and head nodes together with all the nodes in between
    // this is needed only to fix a really ugly edge case https://github.com/riot/riot/issues/2892

    if (!isFilterActive && !node[HEAD_SYMBOL] && !node[TAIL_SYMBOL]) {
      children.push(node);
    }

    if (!nextSibling || check(node)) return children;
    return walkNodes(children, nextSibling, check, // activate the filters to skip nodes between <template> fragments that will be managed by other bindings
    isFilterActive && !node[TAIL_SYMBOL] || nextSibling[HEAD_SYMBOL]);
  }

  /**
   * Quick type checking
   * @param   {*} element - anything
   * @param   {string} type - type definition
   * @returns {boolean} true if the type corresponds
   */
  function checkType(element, type) {
    return typeof element === type;
  }
  /**
   * Check if an element is part of an svg
   * @param   {HTMLElement}  el - element to check
   * @returns {boolean} true if we are in an svg context
   */

  function isSvg(el) {
    const owner = el.ownerSVGElement;
    return !!owner || owner === null;
  }
  /**
   * Check if an element is a template tag
   * @param   {HTMLElement}  el - element to check
   * @returns {boolean} true if it's a <template>
   */

  function isTemplate(el) {
    return !isNil(el.content);
  }
  /**
   * Check that will be passed if its argument is a function
   * @param   {*} value - value to check
   * @returns {boolean} - true if the value is a function
   */

  function isFunction(value) {
    return checkType(value, 'function');
  }
  /**
   * Check if a value is a Boolean
   * @param   {*}  value - anything
   * @returns {boolean} true only for the value is a boolean
   */

  function isBoolean(value) {
    return checkType(value, 'boolean');
  }
  /**
   * Check if a value is an Object
   * @param   {*}  value - anything
   * @returns {boolean} true only for the value is an object
   */

  function isObject(value) {
    return !isNil(value) && value.constructor === Object;
  }
  /**
   * Check if a value is null or undefined
   * @param   {*}  value - anything
   * @returns {boolean} true only for the 'undefined' and 'null' types
   */

  function isNil(value) {
    return value === null || value === undefined;
  }

  /**
   * ISC License
   *
   * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
   * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
   * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
   * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
   * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
   * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
   * PERFORMANCE OF THIS SOFTWARE.
   */
  // fork of https://github.com/WebReflection/udomdiff version 1.1.0
  // due to https://github.com/WebReflection/udomdiff/pull/2

  /* eslint-disable */

  /**
   * @param {Node[]} a The list of current/live children
   * @param {Node[]} b The list of future children
   * @param {(entry: Node, action: number) => Node} get
   * The callback invoked per each entry related DOM operation.
   * @param {Node} [before] The optional node used as anchor to insert before.
   * @returns {Node[]} The same list of future children.
   */

  var udomdiff = ((a, b, get, before) => {
    const bLength = b.length;
    let aEnd = a.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    let map = null;

    while (aStart < aEnd || bStart < bEnd) {
      // append head, tail, or nodes in between: fast path
      if (aEnd === aStart) {
        // we could be in a situation where the rest of nodes that
        // need to be added are not at the end, and in such case
        // the node to `insertBefore`, if the index is more than 0
        // must be retrieved, otherwise it's gonna be the first item.
        const node = bEnd < bLength ? bStart ? get(b[bStart - 1], -0).nextSibling : get(b[bEnd - bStart], 0) : before;

        while (bStart < bEnd) insertBefore(get(b[bStart++], 1), node);
      } // remove head or tail: fast path
      else if (bEnd === bStart) {
          while (aStart < aEnd) {
            // remove the node only if it's unknown or not live
            if (!map || !map.has(a[aStart])) removeChild(get(a[aStart], -1));
            aStart++;
          }
        } // same node: fast path
        else if (a[aStart] === b[bStart]) {
            aStart++;
            bStart++;
          } // same tail: fast path
          else if (a[aEnd - 1] === b[bEnd - 1]) {
              aEnd--;
              bEnd--;
            } // The once here single last swap "fast path" has been removed in v1.1.0
            // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
            // reverse swap: also fast path
            else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
                // this is a "shrink" operation that could happen in these cases:
                // [1, 2, 3, 4, 5]
                // [1, 4, 3, 2, 5]
                // or asymmetric too
                // [1, 2, 3, 4, 5]
                // [1, 2, 3, 5, 6, 4]
                const node = get(a[--aEnd], -1).nextSibling;
                insertBefore(get(b[bStart++], 1), get(a[aStart++], -1).nextSibling);
                insertBefore(get(b[--bEnd], 1), node); // mark the future index as identical (yeah, it's dirty, but cheap 👍)
                // The main reason to do this, is that when a[aEnd] will be reached,
                // the loop will likely be on the fast path, as identical to b[bEnd].
                // In the best case scenario, the next loop will skip the tail,
                // but in the worst one, this node will be considered as already
                // processed, bailing out pretty quickly from the map index check

                a[aEnd] = b[bEnd];
              } // map based fallback, "slow" path
              else {
                  // the map requires an O(bEnd - bStart) operation once
                  // to store all future nodes indexes for later purposes.
                  // In the worst case scenario, this is a full O(N) cost,
                  // and such scenario happens at least when all nodes are different,
                  // but also if both first and last items of the lists are different
                  if (!map) {
                    map = new Map();
                    let i = bStart;

                    while (i < bEnd) map.set(b[i], i++);
                  } // if it's a future node, hence it needs some handling


                  if (map.has(a[aStart])) {
                    // grab the index of such node, 'cause it might have been processed
                    const index = map.get(a[aStart]); // if it's not already processed, look on demand for the next LCS

                    if (bStart < index && index < bEnd) {
                      let i = aStart; // counts the amount of nodes that are the same in the future

                      let sequence = 1;

                      while (++i < aEnd && i < bEnd && map.get(a[i]) === index + sequence) sequence++; // effort decision here: if the sequence is longer than replaces
                      // needed to reach such sequence, which would brings again this loop
                      // to the fast path, prepend the difference before a sequence,
                      // and move only the future list index forward, so that aStart
                      // and bStart will be aligned again, hence on the fast path.
                      // An example considering aStart and bStart are both 0:
                      // a: [1, 2, 3, 4]
                      // b: [7, 1, 2, 3, 6]
                      // this would place 7 before 1 and, from that time on, 1, 2, and 3
                      // will be processed at zero cost


                      if (sequence > index - bStart) {
                        const node = get(a[aStart], 0);

                        while (bStart < index) insertBefore(get(b[bStart++], 1), node);
                      } // if the effort wasn't good enough, fallback to a replace,
                      // moving both source and target indexes forward, hoping that some
                      // similar node will be found later on, to go back to the fast path
                      else {
                          replaceChild(get(b[bStart++], 1), get(a[aStart++], -1));
                        }
                    } // otherwise move the source forward, 'cause there's nothing to do
                    else aStart++;
                  } // this node has no meaning in the future list, so it's more than safe
                  // to remove it, and check the next live node out instead, meaning
                  // that only the live list index should be forwarded
                  else removeChild(get(a[aStart++], -1));
                }
    }

    return b;
  });

  const UNMOUNT_SCOPE = Symbol('unmount');
  const EachBinding = {
    // dynamic binding properties
    // childrenMap: null,
    // node: null,
    // root: null,
    // condition: null,
    // evaluate: null,
    // template: null,
    // isTemplateTag: false,
    nodes: [],

    // getKey: null,
    // indexName: null,
    // itemName: null,
    // afterPlaceholder: null,
    // placeholder: null,
    // API methods
    mount(scope, parentScope) {
      return this.update(scope, parentScope);
    },

    update(scope, parentScope) {
      const {
        placeholder,
        nodes,
        childrenMap
      } = this;
      const collection = scope === UNMOUNT_SCOPE ? null : this.evaluate(scope);
      const items = collection ? Array.from(collection) : []; // prepare the diffing

      const {
        newChildrenMap,
        batches,
        futureNodes
      } = createPatch(items, scope, parentScope, this); // patch the DOM only if there are new nodes

      udomdiff(nodes, futureNodes, patch(Array.from(childrenMap.values()), parentScope), placeholder); // trigger the mounts and the updates

      batches.forEach(fn => fn()); // update the children map

      this.childrenMap = newChildrenMap;
      this.nodes = futureNodes; // make sure that the loop edge nodes are marked

      markEdgeNodes(this.nodes);
      return this;
    },

    unmount(scope, parentScope) {
      this.update(UNMOUNT_SCOPE, parentScope);
      return this;
    }

  };
  /**
   * Patch the DOM while diffing
   * @param   {any[]} redundant - list of all the children (template, nodes, context) added via each
   * @param   {*} parentScope - scope of the parent template
   * @returns {Function} patch function used by domdiff
   */

  function patch(redundant, parentScope) {
    return (item, info) => {
      if (info < 0) {
        // get the last element added to the childrenMap saved previously
        const element = redundant[redundant.length - 1];

        if (element) {
          // get the nodes and the template in stored in the last child of the childrenMap
          const {
            template,
            nodes,
            context
          } = element; // remove the last node (notice <template> tags might have more children nodes)

          nodes.pop(); // notice that we pass null as last argument because
          // the root node and its children will be removed by domdiff

          if (nodes.length === 0) {
            // we have cleared all the children nodes and we can unmount this template
            redundant.pop();
            template.unmount(context, parentScope, null);
          }
        }
      }

      return item;
    };
  }
  /**
   * Check whether a template must be filtered from a loop
   * @param   {Function} condition - filter function
   * @param   {Object} context - argument passed to the filter function
   * @returns {boolean} true if this item should be skipped
   */


  function mustFilterItem(condition, context) {
    return condition ? Boolean(condition(context)) === false : false;
  }
  /**
   * Extend the scope of the looped template
   * @param   {Object} scope - current template scope
   * @param   {string} options.itemName - key to identify the looped item in the new context
   * @param   {string} options.indexName - key to identify the index of the looped item
   * @param   {number} options.index - current index
   * @param   {*} options.item - collection item looped
   * @returns {Object} enhanced scope object
   */


  function extendScope(scope, _ref) {
    let {
      itemName,
      indexName,
      index,
      item
    } = _ref;
    scope[itemName] = item;
    if (indexName) scope[indexName] = index;
    return scope;
  }
  /**
   * Mark the first and last nodes in order to ignore them in case we need to retrieve the <template> fragment nodes
   * @param {Array[]} nodes - each binding nodes list
   * @returns {undefined} void function
   */


  function markEdgeNodes(nodes) {
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (first) first[HEAD_SYMBOL] = true;
    if (last) last[TAIL_SYMBOL] = true;
  }
  /**
   * Loop the current template items
   * @param   {Array} items - expression collection value
   * @param   {*} scope - template scope
   * @param   {*} parentScope - scope of the parent template
   * @param   {EeachBinding} binding - each binding object instance
   * @returns {Object} data
   * @returns {Map} data.newChildrenMap - a Map containing the new children template structure
   * @returns {Array} data.batches - array containing the template lifecycle functions to trigger
   * @returns {Array} data.futureNodes - array containing the nodes we need to diff
   */


  function createPatch(items, scope, parentScope, binding) {
    const {
      condition,
      template,
      childrenMap,
      itemName,
      getKey,
      indexName,
      root,
      isTemplateTag
    } = binding;
    const newChildrenMap = new Map();
    const batches = [];
    const futureNodes = [];
    items.forEach((item, index) => {
      const context = extendScope(Object.create(scope), {
        itemName,
        indexName,
        index,
        item
      });
      const key = getKey ? getKey(context) : index;
      const oldItem = childrenMap.get(key);
      const nodes = [];

      if (mustFilterItem(condition, context)) {
        return;
      }

      const mustMount = !oldItem;
      const componentTemplate = oldItem ? oldItem.template : template.clone();
      const el = componentTemplate.el || root.cloneNode();
      const meta = isTemplateTag && mustMount ? createTemplateMeta(componentTemplate) : componentTemplate.meta;

      if (mustMount) {
        batches.push(() => componentTemplate.mount(el, context, parentScope, meta));
      } else {
        batches.push(() => componentTemplate.update(context, parentScope));
      } // create the collection of nodes to update or to add
      // in case of template tags we need to add all its children nodes


      if (isTemplateTag) {
        nodes.push(...(mustMount ? meta.children : getFragmentChildren(meta)));
      } else {
        nodes.push(el);
      } // delete the old item from the children map


      childrenMap.delete(key);
      futureNodes.push(...nodes); // update the children map

      newChildrenMap.set(key, {
        nodes,
        template: componentTemplate,
        context,
        index
      });
    });
    return {
      newChildrenMap,
      batches,
      futureNodes
    };
  }

  function create$6(node, _ref2) {
    let {
      evaluate,
      condition,
      itemName,
      indexName,
      getKey,
      template
    } = _ref2;
    const placeholder = document.createTextNode('');
    const root = node.cloneNode();
    insertBefore(placeholder, node);
    removeChild(node);
    return Object.assign({}, EachBinding, {
      childrenMap: new Map(),
      node,
      root,
      condition,
      evaluate,
      isTemplateTag: isTemplate(root),
      template: template.createDOM(node),
      getKey,
      indexName,
      itemName,
      placeholder
    });
  }

  /**
   * Binding responsible for the `if` directive
   */

  const IfBinding = {
    // dynamic binding properties
    // node: null,
    // evaluate: null,
    // isTemplateTag: false,
    // placeholder: null,
    // template: null,
    // API methods
    mount(scope, parentScope) {
      return this.update(scope, parentScope);
    },

    update(scope, parentScope) {
      const value = !!this.evaluate(scope);
      const mustMount = !this.value && value;
      const mustUnmount = this.value && !value;

      const mount = () => {
        const pristine = this.node.cloneNode();
        insertBefore(pristine, this.placeholder);
        this.template = this.template.clone();
        this.template.mount(pristine, scope, parentScope);
      };

      switch (true) {
        case mustMount:
          mount();
          break;

        case mustUnmount:
          this.unmount(scope);
          break;

        default:
          if (value) this.template.update(scope, parentScope);
      }

      this.value = value;
      return this;
    },

    unmount(scope, parentScope) {
      this.template.unmount(scope, parentScope, true);
      return this;
    }

  };
  function create$5(node, _ref) {
    let {
      evaluate,
      template
    } = _ref;
    const placeholder = document.createTextNode('');
    insertBefore(placeholder, node);
    removeChild(node);
    return Object.assign({}, IfBinding, {
      node,
      evaluate,
      placeholder,
      template: template.createDOM(node)
    });
  }

  /**
   * Throw an error with a descriptive message
   * @param   { string } message - error message
   * @returns { undefined } hoppla.. at this point the program should stop working
   */

  function panic(message) {
    throw new Error(message);
  }
  /**
   * Returns the memoized (cached) function.
   * // borrowed from https://www.30secondsofcode.org/js/s/memoize
   * @param {Function} fn - function to memoize
   * @returns {Function} memoize function
   */

  function memoize(fn) {
    const cache = new Map();

    const cached = val => {
      return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
    };

    cached.cache = cache;
    return cached;
  }
  /**
   * Evaluate a list of attribute expressions
   * @param   {Array} attributes - attribute expressions generated by the riot compiler
   * @returns {Object} key value pairs with the result of the computation
   */

  function evaluateAttributeExpressions(attributes) {
    return attributes.reduce((acc, attribute) => {
      const {
        value,
        type
      } = attribute;

      switch (true) {
        // spread attribute
        case !attribute.name && type === ATTRIBUTE:
          return Object.assign({}, acc, value);
        // value attribute

        case type === VALUE:
          acc.value = attribute.value;
          break;
        // normal attributes

        default:
          acc[dashToCamelCase(attribute.name)] = attribute.value;
      }

      return acc;
    }, {});
  }

  const REMOVE_ATTRIBUTE = 'removeAttribute';
  const SET_ATTIBUTE = 'setAttribute';
  const ElementProto = typeof Element === 'undefined' ? {} : Element.prototype;
  const isNativeHtmlProperty = memoize(name => ElementProto.hasOwnProperty(name)); // eslint-disable-line

  /**
   * Add all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} attributes - object containing the attributes names and values
   * @returns {undefined} sorry it's a void function :(
   */

  function setAllAttributes(node, attributes) {
    Object.entries(attributes).forEach((_ref) => {
      let [name, value] = _ref;
      return attributeExpression(node, {
        name
      }, value);
    });
  }
  /**
   * Remove all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} newAttributes - object containing all the new attribute names
   * @param   {Object} oldAttributes - object containing all the old attribute names
   * @returns {undefined} sorry it's a void function :(
   */


  function removeAllAttributes(node, newAttributes, oldAttributes) {
    const newKeys = newAttributes ? Object.keys(newAttributes) : [];
    Object.keys(oldAttributes).filter(name => !newKeys.includes(name)).forEach(attribute => node.removeAttribute(attribute));
  }
  /**
   * This methods handles the DOM attributes updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - attribute name
   * @param   {*} value - new expression value
   * @param   {*} oldValue - the old expression cached value
   * @returns {undefined}
   */


  function attributeExpression(node, _ref2, value, oldValue) {
    let {
      name
    } = _ref2;

    // is it a spread operator? {...attributes}
    if (!name) {
      if (oldValue) {
        // remove all the old attributes
        removeAllAttributes(node, value, oldValue);
      } // is the value still truthy?


      if (value) {
        setAllAttributes(node, value);
      }

      return;
    } // handle boolean attributes


    if (!isNativeHtmlProperty(name) && (isBoolean(value) || isObject(value) || isFunction(value))) {
      node[name] = value;
    }

    node[getMethod(value)](name, normalizeValue(name, value));
  }
  /**
   * Get the attribute modifier method
   * @param   {*} value - if truthy we return `setAttribute` othewise `removeAttribute`
   * @returns {string} the node attribute modifier method name
   */

  function getMethod(value) {
    return isNil(value) || value === false || value === '' || isObject(value) || isFunction(value) ? REMOVE_ATTRIBUTE : SET_ATTIBUTE;
  }
  /**
   * Get the value as string
   * @param   {string} name - attribute name
   * @param   {*} value - user input value
   * @returns {string} input value as string
   */


  function normalizeValue(name, value) {
    // be sure that expressions like selected={ true } will be always rendered as selected='selected'
    if (value === true) return name;
    return value;
  }

  const RE_EVENTS_PREFIX = /^on/;

  const getCallbackAndOptions = value => Array.isArray(value) ? value : [value, false]; // see also https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38


  const EventListener = {
    handleEvent(event) {
      this[event.type](event);
    }

  };
  const ListenersWeakMap = new WeakMap();

  const createListener = node => {
    const listener = Object.create(EventListener);
    ListenersWeakMap.set(node, listener);
    return listener;
  };
  /**
   * Set a new event listener
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - event name
   * @param   {*} value - new expression value
   * @returns {value} the callback just received
   */


  function eventExpression(node, _ref, value) {
    let {
      name
    } = _ref;
    const normalizedEventName = name.replace(RE_EVENTS_PREFIX, '');
    const eventListener = ListenersWeakMap.get(node) || createListener(node);
    const [callback, options] = getCallbackAndOptions(value);
    const handler = eventListener[normalizedEventName];
    const mustRemoveEvent = handler && !callback;
    const mustAddEvent = callback && !handler;

    if (mustRemoveEvent) {
      node.removeEventListener(normalizedEventName, eventListener);
    }

    if (mustAddEvent) {
      node.addEventListener(normalizedEventName, eventListener, options);
    }

    eventListener[normalizedEventName] = callback;
  }

  /**
   * Normalize the user value in order to render a empty string in case of falsy values
   * @param   {*} value - user input value
   * @returns {string} hopefully a string
   */

  function normalizeStringValue(value) {
    return isNil(value) ? '' : value;
  }

  /**
   * Get the the target text node to update or create one from of a comment node
   * @param   {HTMLElement} node - any html element containing childNodes
   * @param   {number} childNodeIndex - index of the text node in the childNodes list
   * @returns {HTMLTextNode} the text node to update
   */

  const getTextNode = (node, childNodeIndex) => {
    const target = node.childNodes[childNodeIndex];

    if (target.nodeType === Node.COMMENT_NODE) {
      const textNode = document.createTextNode('');
      node.replaceChild(textNode, target);
      return textNode;
    }

    return target;
  };
  /**
   * This methods handles a simple text expression update
   * @param   {HTMLElement} node - target node
   * @param   {Object} data - expression object
   * @param   {*} value - new expression value
   * @returns {undefined}
   */

  function textExpression(node, data, value) {
    node.data = normalizeStringValue(value);
  }

  /**
   * This methods handles the input fileds value updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {*} value - new expression value
   * @returns {undefined}
   */

  function valueExpression(node, expression, value) {
    node.value = normalizeStringValue(value);
  }

  var expressions = {
    [ATTRIBUTE]: attributeExpression,
    [EVENT]: eventExpression,
    [TEXT]: textExpression,
    [VALUE]: valueExpression
  };

  const Expression = {
    // Static props
    // node: null,
    // value: null,
    // API methods

    /**
     * Mount the expression evaluating its initial value
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    mount(scope) {
      // hopefully a pure function
      this.value = this.evaluate(scope); // IO() DOM updates

      apply(this, this.value);
      return this;
    },

    /**
     * Update the expression if its value changed
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    update(scope) {
      // pure function
      const value = this.evaluate(scope);

      if (this.value !== value) {
        // IO() DOM updates
        apply(this, value);
        this.value = value;
      }

      return this;
    },

    /**
     * Expression teardown method
     * @returns {Expression} self
     */
    unmount() {
      // unmount only the event handling expressions
      if (this.type === EVENT) apply(this, null);
      return this;
    }

  };
  /**
   * IO() function to handle the DOM updates
   * @param {Expression} expression - expression object
   * @param {*} value - current expression value
   * @returns {undefined}
   */

  function apply(expression, value) {
    return expressions[expression.type](expression.node, expression, value, expression.value);
  }

  function create$4(node, data) {
    return Object.assign({}, Expression, data, {
      node: data.type === TEXT ? getTextNode(node, data.childNodeIndex) : node
    });
  }

  /**
   * Create a flat object having as keys a list of methods that if dispatched will propagate
   * on the whole collection
   * @param   {Array} collection - collection to iterate
   * @param   {Array<string>} methods - methods to execute on each item of the collection
   * @param   {*} context - context returned by the new methods created
   * @returns {Object} a new object to simplify the the nested methods dispatching
   */
  function flattenCollectionMethods(collection, methods, context) {
    return methods.reduce((acc, method) => {
      return Object.assign({}, acc, {
        [method]: scope => {
          return collection.map(item => item[method](scope)) && context;
        }
      });
    }, {});
  }

  function create$3(node, _ref) {
    let {
      expressions
    } = _ref;
    return Object.assign({}, flattenCollectionMethods(expressions.map(expression => create$4(node, expression)), ['mount', 'update', 'unmount']));
  }

  function extendParentScope(attributes, scope, parentScope) {
    if (!attributes || !attributes.length) return parentScope;
    const expressions = attributes.map(attr => Object.assign({}, attr, {
      value: attr.evaluate(scope)
    }));
    return Object.assign(Object.create(parentScope || null), evaluateAttributeExpressions(expressions));
  } // this function is only meant to fix an edge case
  // https://github.com/riot/riot/issues/2842


  const getRealParent = (scope, parentScope) => scope[PARENT_KEY_SYMBOL] || parentScope;

  const SlotBinding = {
    // dynamic binding properties
    // node: null,
    // name: null,
    attributes: [],

    // template: null,
    getTemplateScope(scope, parentScope) {
      return extendParentScope(this.attributes, scope, parentScope);
    },

    // API methods
    mount(scope, parentScope) {
      const templateData = scope.slots ? scope.slots.find((_ref) => {
        let {
          id
        } = _ref;
        return id === this.name;
      }) : false;
      const {
        parentNode
      } = this.node;
      const realParent = getRealParent(scope, parentScope);
      this.template = templateData && create$7(templateData.html, templateData.bindings).createDOM(parentNode);

      if (this.template) {
        this.template.mount(this.node, this.getTemplateScope(scope, realParent), realParent);
        this.template.children = Array.from(this.node.childNodes);
        moveSlotInnerContent(this.node);
      }

      removeChild(this.node);
      return this;
    },

    update(scope, parentScope) {
      if (this.template) {
        const realParent = getRealParent(scope, parentScope);
        this.template.update(this.getTemplateScope(scope, realParent), realParent);
      }

      return this;
    },

    unmount(scope, parentScope, mustRemoveRoot) {
      if (this.template) {
        this.template.unmount(this.getTemplateScope(scope, parentScope), null, mustRemoveRoot);
      }

      return this;
    }

  };
  /**
   * Move the inner content of the slots outside of them
   * @param   {HTMLElement} slot - slot node
   * @returns {undefined} it's a void method ¯\_(ツ)_/¯
   */

  function moveSlotInnerContent(slot) {
    const child = slot && slot.firstChild;
    if (!child) return;
    insertBefore(child, slot);
    moveSlotInnerContent(slot);
  }
  /**
   * Create a single slot binding
   * @param   {HTMLElement} node - slot node
   * @param   {string} options.name - slot id
   * @returns {Object} Slot binding object
   */


  function createSlot(node, _ref2) {
    let {
      name,
      attributes
    } = _ref2;
    return Object.assign({}, SlotBinding, {
      attributes,
      node,
      name
    });
  }

  /**
   * Create a new tag object if it was registered before, otherwise fallback to the simple
   * template chunk
   * @param   {Function} component - component factory function
   * @param   {Array<Object>} slots - array containing the slots markup
   * @param   {Array} attributes - dynamic attributes that will be received by the tag element
   * @returns {TagImplementation|TemplateChunk} a tag implementation or a template chunk as fallback
   */

  function getTag(component, slots, attributes) {
    if (slots === void 0) {
      slots = [];
    }

    if (attributes === void 0) {
      attributes = [];
    }

    // if this tag was registered before we will return its implementation
    if (component) {
      return component({
        slots,
        attributes
      });
    } // otherwise we return a template chunk


    return create$7(slotsToMarkup(slots), [...slotBindings(slots), {
      // the attributes should be registered as binding
      // if we fallback to a normal template chunk
      expressions: attributes.map(attr => {
        return Object.assign({
          type: ATTRIBUTE
        }, attr);
      })
    }]);
  }
  /**
   * Merge all the slots bindings into a single array
   * @param   {Array<Object>} slots - slots collection
   * @returns {Array<Bindings>} flatten bindings array
   */


  function slotBindings(slots) {
    return slots.reduce((acc, _ref) => {
      let {
        bindings
      } = _ref;
      return acc.concat(bindings);
    }, []);
  }
  /**
   * Merge all the slots together in a single markup string
   * @param   {Array<Object>} slots - slots collection
   * @returns {string} markup of all the slots in a single string
   */


  function slotsToMarkup(slots) {
    return slots.reduce((acc, slot) => {
      return acc + slot.html;
    }, '');
  }

  const TagBinding = {
    // dynamic binding properties
    // node: null,
    // evaluate: null,
    // name: null,
    // slots: null,
    // tag: null,
    // attributes: null,
    // getComponent: null,
    mount(scope) {
      return this.update(scope);
    },

    update(scope, parentScope) {
      const name = this.evaluate(scope); // simple update

      if (name === this.name) {
        this.tag.update(scope);
      } else {
        // unmount the old tag if it exists
        this.unmount(scope, parentScope, true); // mount the new tag

        this.name = name;
        this.tag = getTag(this.getComponent(name), this.slots, this.attributes);
        this.tag.mount(this.node, scope);
      }

      return this;
    },

    unmount(scope, parentScope, keepRootTag) {
      if (this.tag) {
        // keep the root tag
        this.tag.unmount(keepRootTag);
      }

      return this;
    }

  };
  function create$2(node, _ref2) {
    let {
      evaluate,
      getComponent,
      slots,
      attributes
    } = _ref2;
    return Object.assign({}, TagBinding, {
      node,
      evaluate,
      slots,
      attributes,
      getComponent
    });
  }

  var bindings = {
    [IF]: create$5,
    [SIMPLE]: create$3,
    [EACH]: create$6,
    [TAG]: create$2,
    [SLOT]: createSlot
  };

  /**
   * Text expressions in a template tag will get childNodeIndex value normalized
   * depending on the position of the <template> tag offset
   * @param   {Expression[]} expressions - riot expressions array
   * @param   {number} textExpressionsOffset - offset of the <template> tag
   * @returns {Expression[]} expressions containing the text expressions normalized
   */

  function fixTextExpressionsOffset(expressions, textExpressionsOffset) {
    return expressions.map(e => e.type === TEXT ? Object.assign({}, e, {
      childNodeIndex: e.childNodeIndex + textExpressionsOffset
    }) : e);
  }
  /**
   * Bind a new expression object to a DOM node
   * @param   {HTMLElement} root - DOM node where to bind the expression
   * @param   {Object} binding - binding data
   * @param   {number|null} templateTagOffset - if it's defined we need to fix the text expressions childNodeIndex offset
   * @returns {Binding} Binding object
   */


  function create$1(root, binding, templateTagOffset) {
    const {
      selector,
      type,
      redundantAttribute,
      expressions
    } = binding; // find the node to apply the bindings

    const node = selector ? root.querySelector(selector) : root; // remove eventually additional attributes created only to select this node

    if (redundantAttribute) node.removeAttribute(redundantAttribute);
    const bindingExpressions = expressions || []; // init the binding

    return (bindings[type] || bindings[SIMPLE])(node, Object.assign({}, binding, {
      expressions: templateTagOffset && !selector ? fixTextExpressionsOffset(bindingExpressions, templateTagOffset) : bindingExpressions
    }));
  }

  function createHTMLTree(html, root) {
    const template = isTemplate(root) ? root : document.createElement('template');
    template.innerHTML = html;
    return template.content;
  } // for svg nodes we need a bit more work


  function createSVGTree(html, container) {
    // create the SVGNode
    const svgNode = container.ownerDocument.importNode(new window.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`, 'application/xml').documentElement, true);
    return svgNode;
  }
  /**
   * Create the DOM that will be injected
   * @param {Object} root - DOM node to find out the context where the fragment will be created
   * @param   {string} html - DOM to create as string
   * @returns {HTMLDocumentFragment|HTMLElement} a new html fragment
   */


  function createDOMTree(root, html) {
    if (isSvg(root)) return createSVGTree(html, root);
    return createHTMLTree(html, root);
  }

  /**
   * Inject the DOM tree into a target node
   * @param   {HTMLElement} el - target element
   * @param   {HTMLFragment|SVGElement} dom - dom tree to inject
   * @returns {undefined}
   */

  function injectDOM(el, dom) {
    switch (true) {
      case isSvg(el):
        moveChildren(dom, el);
        break;

      case isTemplate(el):
        el.parentNode.replaceChild(dom, el);
        break;

      default:
        el.appendChild(dom);
    }
  }

  /**
   * Create the Template DOM skeleton
   * @param   {HTMLElement} el - root node where the DOM will be injected
   * @param   {string} html - markup that will be injected into the root node
   * @returns {HTMLFragment} fragment that will be injected into the root node
   */

  function createTemplateDOM(el, html) {
    return html && (typeof html === 'string' ? createDOMTree(el, html) : html);
  }
  /**
   * Template Chunk model
   * @type {Object}
   */


  const TemplateChunk = Object.freeze({
    // Static props
    // bindings: null,
    // bindingsData: null,
    // html: null,
    // isTemplateTag: false,
    // fragment: null,
    // children: null,
    // dom: null,
    // el: null,

    /**
     * Create the template DOM structure that will be cloned on each mount
     * @param   {HTMLElement} el - the root node
     * @returns {TemplateChunk} self
     */
    createDOM(el) {
      // make sure that the DOM gets created before cloning the template
      this.dom = this.dom || createTemplateDOM(el, this.html);
      return this;
    },

    // API methods

    /**
     * Attach the template to a DOM node
     * @param   {HTMLElement} el - target DOM node
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @param   {Object} meta - meta properties needed to handle the <template> tags in loops
     * @returns {TemplateChunk} self
     */
    mount(el, scope, parentScope, meta) {
      if (meta === void 0) {
        meta = {};
      }

      if (!el) throw new Error('Please provide DOM node to mount properly your template');
      if (this.el) this.unmount(scope); // <template> tags require a bit more work
      // the template fragment might be already created via meta outside of this call

      const {
        fragment,
        children,
        avoidDOMInjection
      } = meta; // <template> bindings of course can not have a root element
      // so we check the parent node to set the query selector bindings

      const {
        parentNode
      } = children ? children[0] : el;
      const isTemplateTag = isTemplate(el);
      const templateTagOffset = isTemplateTag ? Math.max(Array.from(parentNode.childNodes).indexOf(el), 0) : null;
      this.isTemplateTag = isTemplateTag; // create the DOM if it wasn't created before

      this.createDOM(el);

      if (this.dom) {
        // create the new template dom fragment if it want already passed in via meta
        this.fragment = fragment || this.dom.cloneNode(true);
      } // store root node
      // notice that for template tags the root note will be the parent tag


      this.el = this.isTemplateTag ? parentNode : el; // create the children array only for the <template> fragments

      this.children = this.isTemplateTag ? children || Array.from(this.fragment.childNodes) : null; // inject the DOM into the el only if a fragment is available

      if (!avoidDOMInjection && this.fragment) injectDOM(el, this.fragment); // create the bindings

      this.bindings = this.bindingsData.map(binding => create$1(this.el, binding, templateTagOffset));
      this.bindings.forEach(b => b.mount(scope, parentScope)); // store the template meta properties

      this.meta = meta;
      return this;
    },

    /**
     * Update the template with fresh data
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @returns {TemplateChunk} self
     */
    update(scope, parentScope) {
      this.bindings.forEach(b => b.update(scope, parentScope));
      return this;
    },

    /**
     * Remove the template from the node where it was initially mounted
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @param   {boolean|null} mustRemoveRoot - if true remove the root element,
     * if false or undefined clean the root tag content, if null don't touch the DOM
     * @returns {TemplateChunk} self
     */
    unmount(scope, parentScope, mustRemoveRoot) {
      if (this.el) {
        this.bindings.forEach(b => b.unmount(scope, parentScope, mustRemoveRoot));

        switch (true) {
          // pure components should handle the DOM unmount updates by themselves
          case this.el[IS_PURE_SYMBOL]:
            break;
          // <template> tags should be treated a bit differently
          // we need to clear their children only if it's explicitly required by the caller
          // via mustRemoveRoot !== null

          case this.children && mustRemoveRoot !== null:
            clearChildren(this.children);
            break;
          // remove the root node only if the mustRemoveRoot === true

          case mustRemoveRoot === true:
            removeChild(this.el);
            break;
          // otherwise we clean the node children

          case mustRemoveRoot !== null:
            cleanNode(this.el);
            break;
        }

        this.el = null;
      }

      return this;
    },

    /**
     * Clone the template chunk
     * @returns {TemplateChunk} a clone of this object resetting the this.el property
     */
    clone() {
      return Object.assign({}, this, {
        meta: {},
        el: null
      });
    }

  });
  /**
   * Create a template chunk wiring also the bindings
   * @param   {string|HTMLElement} html - template string
   * @param   {Array} bindings - bindings collection
   * @returns {TemplateChunk} a new TemplateChunk copy
   */

  function create$7(html, bindings) {
    if (bindings === void 0) {
      bindings = [];
    }

    return Object.assign({}, TemplateChunk, {
      html,
      bindingsData: bindings
    });
  }

  /**
   * Method used to bind expressions to a DOM node
   * @param   {string|HTMLElement} html - your static template html structure
   * @param   {Array} bindings - list of the expressions to bind to update the markup
   * @returns {TemplateChunk} a new TemplateChunk object having the `update`,`mount`, `unmount` and `clone` methods
   *
   * @example
   *
   * riotDOMBindings
   *  .template(
   *   `<div expr0><!----></div><div><p expr1><!----><section expr2></section></p>`,
   *   [
   *     {
   *       selector: '[expr0]',
   *       redundantAttribute: 'expr0',
   *       expressions: [
   *         {
   *           type: expressionTypes.TEXT,
   *           childNodeIndex: 0,
   *           evaluate(scope) {
   *             return scope.time;
   *           },
   *         },
   *       ],
   *     },
   *     {
   *       selector: '[expr1]',
   *       redundantAttribute: 'expr1',
   *       expressions: [
   *         {
   *           type: expressionTypes.TEXT,
   *           childNodeIndex: 0,
   *           evaluate(scope) {
   *             return scope.name;
   *           },
   *         },
   *         {
   *           type: 'attribute',
   *           name: 'style',
   *           evaluate(scope) {
   *             return scope.style;
   *           },
   *         },
   *       ],
   *     },
   *     {
   *       selector: '[expr2]',
   *       redundantAttribute: 'expr2',
   *       type: bindingTypes.IF,
   *       evaluate(scope) {
   *         return scope.isVisible;
   *       },
   *       template: riotDOMBindings.template('hello there'),
   *     },
   *   ]
   * )
   */

  var DOMBindings = /*#__PURE__*/Object.freeze({
    __proto__: null,
    template: create$7,
    createBinding: create$1,
    createExpression: create$4,
    bindingTypes: bindingTypes,
    expressionTypes: expressionTypes
  });

  function noop() {
    return this;
  }
  /**
   * Autobind the methods of a source object to itself
   * @param   {Object} source - probably a riot tag instance
   * @param   {Array<string>} methods - list of the methods to autobind
   * @returns {Object} the original object received
   */

  function autobindMethods(source, methods) {
    methods.forEach(method => {
      source[method] = source[method].bind(source);
    });
    return source;
  }
  /**
   * Call the first argument received only if it's a function otherwise return it as it is
   * @param   {*} source - anything
   * @returns {*} anything
   */

  function callOrAssign(source) {
    return isFunction(source) ? source.prototype && source.prototype.constructor ? new source() : source() : source;
  }

  /**
   * Helper function to set an immutable property
   * @param   {Object} source - object where the new property will be set
   * @param   {string} key - object key where the new property will be stored
   * @param   {*} value - value of the new property
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} - the original object modified
   */
  function defineProperty(source, key, value, options) {
    if (options === void 0) {
      options = {};
    }

    /* eslint-disable fp/no-mutating-methods */
    Object.defineProperty(source, key, Object.assign({
      value,
      enumerable: false,
      writable: false,
      configurable: true
    }, options));
    /* eslint-enable fp/no-mutating-methods */

    return source;
  }
  /**
   * Define multiple properties on a target object
   * @param   {Object} source - object where the new properties will be set
   * @param   {Object} properties - object containing as key pair the key + value properties
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} the original object modified
   */

  function defineProperties(source, properties, options) {
    Object.entries(properties).forEach((_ref) => {
      let [key, value] = _ref;
      defineProperty(source, key, value, options);
    });
    return source;
  }
  /**
   * Define default properties if they don't exist on the source object
   * @param   {Object} source - object that will receive the default properties
   * @param   {Object} defaults - object containing additional optional keys
   * @returns {Object} the original object received enhanced
   */

  function defineDefaults(source, defaults) {
    Object.entries(defaults).forEach((_ref2) => {
      let [key, value] = _ref2;
      if (!source[key]) source[key] = value;
    });
    return source;
  }

  /**
   * Converts any DOM node/s to a loopable array
   * @param   { HTMLElement|NodeList } els - single html element or a node list
   * @returns { Array } always a loopable object
   */
  function domToArray(els) {
    // can this object be already looped?
    if (!Array.isArray(els)) {
      // is it a node list?
      if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(els)) && typeof els.length === 'number') return Array.from(els);else // if it's a single node
        // it will be returned as "array" with one single entry
        return [els];
    } // this object could be looped out of the box


    return els;
  }

  /**
   * Simple helper to find DOM nodes returning them as array like loopable object
   * @param   { string|DOMNodeList } selector - either the query or the DOM nodes to arraify
   * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
   * @returns { Array } DOM nodes found as array
   */

  function $(selector, ctx) {
    return domToArray(typeof selector === 'string' ? (ctx || document).querySelectorAll(selector) : selector);
  }

  /**
   * Normalize the return values, in case of a single value we avoid to return an array
   * @param   { Array } values - list of values we want to return
   * @returns { Array|string|boolean } either the whole list of values or the single one found
   * @private
   */

  const normalize = values => values.length === 1 ? values[0] : values;
  /**
   * Parse all the nodes received to get/remove/check their attributes
   * @param   { HTMLElement|NodeList|Array } els    - DOM node/s to parse
   * @param   { string|Array }               name   - name or list of attributes
   * @param   { string }                     method - method that will be used to parse the attributes
   * @returns { Array|string } result of the parsing in a list or a single value
   * @private
   */


  function parseNodes(els, name, method) {
    const names = typeof name === 'string' ? [name] : name;
    return normalize(domToArray(els).map(el => {
      return normalize(names.map(n => el[method](n)));
    }));
  }
  /**
   * Set any attribute on a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Object }              name  - either the name of the attribute to set
   *                                                 or a list of properties as object key - value
   * @param   { string }                     value - the new value of the attribute (optional)
   * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
   *
   * @example
   *
   * import { set } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * set(img, 'width', 100)
   *
   * // or also
   * set(img, {
   *   width: 300,
   *   height: 300
   * })
   *
   */


  function set$1(els, name, value) {
    const attrs = typeof name === 'object' ? name : {
      [name]: value
    };
    const props = Object.keys(attrs);
    domToArray(els).forEach(el => {
      props.forEach(prop => el.setAttribute(prop, attrs[prop]));
    });
    return els;
  }
  /**
   * Get any attribute from a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Array }               name  - name or list of attributes to get
   * @returns { Array|string } list of the attributes found
   *
   * @example
   *
   * import { get } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * get(img, 'width') // => '200'
   *
   * // or also
   * get(img, ['width', 'height']) // => ['200', '300']
   *
   * // or also
   * get([img1, img2], ['width', 'height']) // => [['200', '300'], ['500', '200']]
   */

  function get$2(els, name) {
    return parseNodes(els, name, 'getAttribute');
  }

  const CSS_BY_NAME = new Map();
  const STYLE_NODE_SELECTOR = 'style[riot]'; // memoized curried function

  const getStyleNode = (style => {
    return () => {
      // lazy evaluation:
      // if this function was already called before
      // we return its cached result
      if (style) return style; // create a new style element or use an existing one
      // and cache it internally

      style = $(STYLE_NODE_SELECTOR)[0] || document.createElement('style');
      set$1(style, 'type', 'text/css');
      /* istanbul ignore next */

      if (!style.parentNode) document.head.appendChild(style);
      return style;
    };
  })();
  /**
   * Object that will be used to inject and manage the css of every tag instance
   */


  var cssManager = {
    CSS_BY_NAME,

    /**
     * Save a tag style to be later injected into DOM
     * @param { string } name - if it's passed we will map the css to a tagname
     * @param { string } css - css string
     * @returns {Object} self
     */
    add(name, css) {
      if (!CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.set(name, css);
        this.inject();
      }

      return this;
    },

    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     * @returns {Object} self
     */
    inject() {
      getStyleNode().innerHTML = [...CSS_BY_NAME.values()].join('\n');
      return this;
    },

    /**
     * Remove a tag style from the DOM
     * @param {string} name a registered tagname
     * @returns {Object} self
     */
    remove(name) {
      if (CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.delete(name);
        this.inject();
      }

      return this;
    }

  };

  /**
   * Function to curry any javascript method
   * @param   {Function}  fn - the target function we want to curry
   * @param   {...[args]} acc - initial arguments
   * @returns {Function|*} it will return a function until the target function
   *                       will receive all of its arguments
   */
  function curry(fn) {
    for (var _len = arguments.length, acc = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      acc[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args = [...acc, ...args];
      return args.length < fn.length ? curry(fn, ...args) : fn(...args);
    };
  }

  /**
   * Get the tag name of any DOM node
   * @param   {HTMLElement} element - DOM node we want to inspect
   * @returns {string} name to identify this dom node in riot
   */

  function getName(element) {
    return get$2(element, IS_DIRECTIVE) || element.tagName.toLowerCase();
  }

  const COMPONENT_CORE_HELPERS = Object.freeze({
    // component helpers
    $(selector) {
      return $(selector, this.root)[0];
    },

    $$(selector) {
      return $(selector, this.root);
    }

  });
  const PURE_COMPONENT_API = Object.freeze({
    [MOUNT_METHOD_KEY]: noop,
    [UPDATE_METHOD_KEY]: noop,
    [UNMOUNT_METHOD_KEY]: noop
  });
  const COMPONENT_LIFECYCLE_METHODS = Object.freeze({
    [SHOULD_UPDATE_KEY]: noop,
    [ON_BEFORE_MOUNT_KEY]: noop,
    [ON_MOUNTED_KEY]: noop,
    [ON_BEFORE_UPDATE_KEY]: noop,
    [ON_UPDATED_KEY]: noop,
    [ON_BEFORE_UNMOUNT_KEY]: noop,
    [ON_UNMOUNTED_KEY]: noop
  });
  const MOCKED_TEMPLATE_INTERFACE = Object.assign({}, PURE_COMPONENT_API, {
    clone: noop,
    createDOM: noop
  });
  /**
   * Performance optimization for the recursive components
   * @param  {RiotComponentShell} componentShell - riot compiler generated object
   * @returns {Object} component like interface
   */

  const memoizedCreateComponent = memoize(createComponent);
  /**
   * Evaluate the component properties either from its real attributes or from its initial user properties
   * @param   {HTMLElement} element - component root
   * @param   {Object}  initialProps - initial props
   * @returns {Object} component props key value pairs
   */

  function evaluateInitialProps(element, initialProps) {
    if (initialProps === void 0) {
      initialProps = {};
    }

    return Object.assign({}, DOMattributesToObject(element), callOrAssign(initialProps));
  }
  /**
   * Bind a DOM node to its component object
   * @param   {HTMLElement} node - html node mounted
   * @param   {Object} component - Riot.js component object
   * @returns {Object} the component object received as second argument
   */


  const bindDOMNodeToComponentObject = (node, component) => node[DOM_COMPONENT_INSTANCE_PROPERTY$1] = component;
  /**
   * Wrap the Riot.js core API methods using a mapping function
   * @param   {Function} mapFunction - lifting function
   * @returns {Object} an object having the { mount, update, unmount } functions
   */


  function createCoreAPIMethods(mapFunction) {
    return [MOUNT_METHOD_KEY, UPDATE_METHOD_KEY, UNMOUNT_METHOD_KEY].reduce((acc, method) => {
      acc[method] = mapFunction(method);
      return acc;
    }, {});
  }
  /**
   * Factory function to create the component templates only once
   * @param   {Function} template - component template creation function
   * @param   {RiotComponentShell} componentShell - riot compiler generated object
   * @returns {TemplateChunk} template chunk object
   */


  function componentTemplateFactory(template, componentShell) {
    const components = createSubcomponents(componentShell.exports ? componentShell.exports.components : {});
    return template(create$7, expressionTypes, bindingTypes, name => {
      // improve support for recursive components
      if (name === componentShell.name) return memoizedCreateComponent(componentShell); // return the registered components

      return components[name] || COMPONENTS_IMPLEMENTATION_MAP$1.get(name);
    });
  }
  /**
   * Create a pure component
   * @param   {Function} pureFactoryFunction - pure component factory function
   * @param   {Array} options.slots - component slots
   * @param   {Array} options.attributes - component attributes
   * @param   {Array} options.template - template factory function
   * @param   {Array} options.template - template factory function
   * @param   {any} options.props - initial component properties
   * @returns {Object} pure component object
   */


  function createPureComponent(pureFactoryFunction, _ref) {
    let {
      slots,
      attributes,
      props,
      css,
      template
    } = _ref;
    if (template) panic('Pure components can not have html');
    if (css) panic('Pure components do not have css');
    const component = defineDefaults(pureFactoryFunction({
      slots,
      attributes,
      props
    }), PURE_COMPONENT_API);
    return createCoreAPIMethods(method => function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // intercept the mount calls to bind the DOM node to the pure object created
      // see also https://github.com/riot/riot/issues/2806
      if (method === MOUNT_METHOD_KEY) {
        const [el] = args; // mark this node as pure element

        el[IS_PURE_SYMBOL] = true;
        bindDOMNodeToComponentObject(el, component);
      }

      component[method](...args);
      return component;
    });
  }
  /**
   * Create the component interface needed for the @riotjs/dom-bindings tag bindings
   * @param   {RiotComponentShell} componentShell - riot compiler generated object
   * @param   {string} componentShell.css - component css
   * @param   {Function} componentShell.template - function that will return the dom-bindings template function
   * @param   {Object} componentShell.exports - component interface
   * @param   {string} componentShell.name - component name
   * @returns {Object} component like interface
   */


  function createComponent(componentShell) {
    const {
      css,
      template,
      exports,
      name
    } = componentShell;
    const templateFn = template ? componentTemplateFactory(template, componentShell) : MOCKED_TEMPLATE_INTERFACE;
    return (_ref2) => {
      let {
        slots,
        attributes,
        props
      } = _ref2;
      // pure components rendering will be managed by the end user
      if (exports && exports[IS_PURE_SYMBOL]) return createPureComponent(exports, {
        slots,
        attributes,
        props,
        css,
        template
      });
      const componentAPI = callOrAssign(exports) || {};
      const component = defineComponent({
        css,
        template: templateFn,
        componentAPI,
        name
      })({
        slots,
        attributes,
        props
      }); // notice that for the components create via tag binding
      // we need to invert the mount (state/parentScope) arguments
      // the template bindings will only forward the parentScope updates
      // and never deal with the component state

      return {
        mount(element, parentScope, state) {
          return component.mount(element, state, parentScope);
        },

        update(parentScope, state) {
          return component.update(state, parentScope);
        },

        unmount(preserveRoot) {
          return component.unmount(preserveRoot);
        }

      };
    };
  }
  /**
   * Component definition function
   * @param   {Object} implementation - the componen implementation will be generated via compiler
   * @param   {Object} component - the component initial properties
   * @returns {Object} a new component implementation object
   */

  function defineComponent(_ref3) {
    let {
      css,
      template,
      componentAPI,
      name
    } = _ref3;
    // add the component css into the DOM
    if (css && name) cssManager.add(name, css);
    return curry(enhanceComponentAPI)(defineProperties( // set the component defaults without overriding the original component API
    defineDefaults(componentAPI, Object.assign({}, COMPONENT_LIFECYCLE_METHODS, {
      [STATE_KEY]: {}
    })), Object.assign({
      // defined during the component creation
      [SLOTS_KEY]: null,
      [ROOT_KEY]: null
    }, COMPONENT_CORE_HELPERS, {
      name,
      css,
      template
    })));
  }
  /**
   * Create the bindings to update the component attributes
   * @param   {HTMLElement} node - node where we will bind the expressions
   * @param   {Array} attributes - list of attribute bindings
   * @returns {TemplateChunk} - template bindings object
   */

  function createAttributeBindings(node, attributes) {
    if (attributes === void 0) {
      attributes = [];
    }

    const expressions = attributes.map(a => create$4(node, a));
    const binding = {};
    return Object.assign(binding, Object.assign({
      expressions
    }, createCoreAPIMethods(method => scope => {
      expressions.forEach(e => e[method](scope));
      return binding;
    })));
  }
  /**
   * Create the subcomponents that can be included inside a tag in runtime
   * @param   {Object} components - components imported in runtime
   * @returns {Object} all the components transformed into Riot.Component factory functions
   */


  function createSubcomponents(components) {
    if (components === void 0) {
      components = {};
    }

    return Object.entries(callOrAssign(components)).reduce((acc, _ref4) => {
      let [key, value] = _ref4;
      acc[camelToDashCase(key)] = createComponent(value);
      return acc;
    }, {});
  }
  /**
   * Run the component instance through all the plugins set by the user
   * @param   {Object} component - component instance
   * @returns {Object} the component enhanced by the plugins
   */


  function runPlugins(component) {
    return [...PLUGINS_SET$1].reduce((c, fn) => fn(c) || c, component);
  }
  /**
   * Compute the component current state merging it with its previous state
   * @param   {Object} oldState - previous state object
   * @param   {Object} newState - new state givent to the `update` call
   * @returns {Object} new object state
   */


  function computeState(oldState, newState) {
    return Object.assign({}, oldState, callOrAssign(newState));
  }
  /**
   * Add eventually the "is" attribute to link this DOM node to its css
   * @param {HTMLElement} element - target root node
   * @param {string} name - name of the component mounted
   * @returns {undefined} it's a void function
   */


  function addCssHook(element, name) {
    if (getName(element) !== name) {
      set$1(element, IS_DIRECTIVE, name);
    }
  }
  /**
   * Component creation factory function that will enhance the user provided API
   * @param   {Object} component - a component implementation previously defined
   * @param   {Array} options.slots - component slots generated via riot compiler
   * @param   {Array} options.attributes - attribute expressions generated via riot compiler
   * @returns {Riot.Component} a riot component instance
   */


  function enhanceComponentAPI(component, _ref5) {
    let {
      slots,
      attributes,
      props
    } = _ref5;
    return autobindMethods(runPlugins(defineProperties(isObject(component) ? Object.create(component) : component, {
      mount(element, state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        this[ATTRIBUTES_KEY_SYMBOL] = createAttributeBindings(element, attributes).mount(parentScope);
        defineProperty(this, PROPS_KEY, Object.freeze(Object.assign({}, evaluateInitialProps(element, props), evaluateAttributeExpressions(this[ATTRIBUTES_KEY_SYMBOL].expressions))));
        this[STATE_KEY] = computeState(this[STATE_KEY], state);
        this[TEMPLATE_KEY_SYMBOL] = this.template.createDOM(element).clone(); // link this object to the DOM node

        bindDOMNodeToComponentObject(element, this); // add eventually the 'is' attribute

        component.name && addCssHook(element, component.name); // define the root element

        defineProperty(this, ROOT_KEY, element); // define the slots array

        defineProperty(this, SLOTS_KEY, slots); // before mount lifecycle event

        this[ON_BEFORE_MOUNT_KEY](this[PROPS_KEY], this[STATE_KEY]);
        this[PARENT_KEY_SYMBOL] = parentScope; // mount the template

        this[TEMPLATE_KEY_SYMBOL].mount(element, this, parentScope);
        this[ON_MOUNTED_KEY](this[PROPS_KEY], this[STATE_KEY]);
        return this;
      },

      update(state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        if (parentScope) {
          this[PARENT_KEY_SYMBOL] = parentScope;
          this[ATTRIBUTES_KEY_SYMBOL].update(parentScope);
        }

        const newProps = evaluateAttributeExpressions(this[ATTRIBUTES_KEY_SYMBOL].expressions);
        if (this[SHOULD_UPDATE_KEY](newProps, this[PROPS_KEY]) === false) return;
        defineProperty(this, PROPS_KEY, Object.freeze(Object.assign({}, this[PROPS_KEY], newProps)));
        this[STATE_KEY] = computeState(this[STATE_KEY], state);
        this[ON_BEFORE_UPDATE_KEY](this[PROPS_KEY], this[STATE_KEY]); // avoiding recursive updates
        // see also https://github.com/riot/riot/issues/2895

        if (!this[IS_COMPONENT_UPDATING]) {
          this[IS_COMPONENT_UPDATING] = true;
          this[TEMPLATE_KEY_SYMBOL].update(this, this[PARENT_KEY_SYMBOL]);
        }

        this[ON_UPDATED_KEY](this[PROPS_KEY], this[STATE_KEY]);
        this[IS_COMPONENT_UPDATING] = false;
        return this;
      },

      unmount(preserveRoot) {
        this[ON_BEFORE_UNMOUNT_KEY](this[PROPS_KEY], this[STATE_KEY]);
        this[ATTRIBUTES_KEY_SYMBOL].unmount(); // if the preserveRoot is null the template html will be left untouched
        // in that case the DOM cleanup will happen differently from a parent node

        this[TEMPLATE_KEY_SYMBOL].unmount(this, this[PARENT_KEY_SYMBOL], preserveRoot === null ? null : !preserveRoot);
        this[ON_UNMOUNTED_KEY](this[PROPS_KEY], this[STATE_KEY]);
        return this;
      }

    })), Object.keys(component).filter(prop => isFunction(component[prop])));
  }
  /**
   * Component initialization function starting from a DOM node
   * @param   {HTMLElement} element - element to upgrade
   * @param   {Object} initialProps - initial component properties
   * @param   {string} componentName - component id
   * @returns {Object} a new component instance bound to a DOM node
   */

  function mountComponent(element, initialProps, componentName) {
    const name = componentName || getName(element);
    if (!COMPONENTS_IMPLEMENTATION_MAP$1.has(name)) panic(`The component named "${name}" was never registered`);
    const component = COMPONENTS_IMPLEMENTATION_MAP$1.get(name)({
      props: initialProps
    });
    return component.mount(element);
  }

  /**
   * Similar to compose but performs from left-to-right function composition.<br/>
   * {@link https://30secondsofcode.org/function#composeright see also}
   * @param   {...[function]} fns) - list of unary function
   * @returns {*} result of the computation
   */
  /**
   * Performs right-to-left function composition.<br/>
   * Use Array.prototype.reduce() to perform right-to-left function composition.<br/>
   * The last (rightmost) function can accept one or more arguments; the remaining functions must be unary.<br/>
   * {@link https://30secondsofcode.org/function#compose original source code}
   * @param   {...[function]} fns) - list of unary function
   * @returns {*} result of the computation
   */

  function compose() {
    for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }

    return fns.reduce((f, g) => function () {
      return f(g(...arguments));
    });
  }

  const {
    DOM_COMPONENT_INSTANCE_PROPERTY,
    COMPONENTS_IMPLEMENTATION_MAP,
    PLUGINS_SET
  } = globals;
  /**
   * Riot public api
   */

  /**
   * Register a custom tag by name
   * @param   {string} name - component name
   * @param   {Object} implementation - tag implementation
   * @returns {Map} map containing all the components implementations
   */

  function register(name, _ref) {
    let {
      css,
      template,
      exports
    } = _ref;
    if (COMPONENTS_IMPLEMENTATION_MAP.has(name)) panic(`The component "${name}" was already registered`);
    COMPONENTS_IMPLEMENTATION_MAP.set(name, createComponent({
      name,
      css,
      template,
      exports
    }));
    return COMPONENTS_IMPLEMENTATION_MAP;
  }
  /**
   * Mounting function that will work only for the components that were globally registered
   * @param   {string|HTMLElement} selector - query for the selection or a DOM element
   * @param   {Object} initialProps - the initial component properties
   * @param   {string} name - optional component name
   * @returns {Array} list of nodes upgraded
   */

  function mount(selector, initialProps, name) {
    return $(selector).map(element => mountComponent(element, initialProps, name));
  }
  /**
   * Helper method to create component without relying on the registered ones
   * @param   {Object} implementation - component implementation
   * @returns {Function} function that will allow you to mount a riot component on a DOM node
   */

  function component(implementation) {
    return function (el, props, _temp) {
      let {
        slots,
        attributes,
        parentScope
      } = _temp === void 0 ? {} : _temp;
      return compose(c => c.mount(el, parentScope), c => c({
        props,
        slots,
        attributes
      }), createComponent)(implementation);
    };
  }
  /**
   * Lift a riot component Interface into a pure riot object
   * @param   {Function} func - RiotPureComponent factory function
   * @returns {Function} the lifted original function received as argument
   */

  function pure(func) {
    if (!isFunction(func)) panic('riot.pure accepts only arguments of type "function"');
    func[IS_PURE_SYMBOL] = true;
    return func;
  }

  const __ = {
    cssManager,
    DOMBindings,
    createComponent,
    defineComponent,
    globals
  };

  var loadingBar = document.body.appendChild(document.createElement("div"));
  var loadingBarContainer = document.body.appendChild(document.createElement("div"));
  loadingBarContainer.setAttribute("style", "position: fixed; top: 0; left: 0; right: 0; height: 4px; z-index: 999999; background: rgba(250, 120, 30, .5); display: none;");
  loadingBar = loadingBarContainer.appendChild(document.createElement("div"));
  loadingBar.setAttribute("style", "height: 100%; width: 100%; background: rgb(250, 120, 30) none repeat scroll 0% 0%; transform-origin: center left;");
  var actualClaimedBy = null;
  var nextFrame = -1;
  var loadingProgress = 0;
  var loadingDone = false;
  var progressVel = function (progress) {
      return (8192 - (1.08 * progress * progress)) / 819.2;
  };
  var visibilityTime = 300;
  var doneTime = visibilityTime;
  var claimedWhenVisible = 0;
  function dispatchRouterLoad() {
      document.dispatchEvent(new Event("routerload", { bubbles: true, cancelable: false }));
  }
  function startLoading() {
      if (nextFrame) {
          cancelAnimationFrame(nextFrame);
      }
      var lastTime;
      var eventDispatched = false;
      var step = function () {
          nextFrame = -1;
          if (loadingDone && loadingProgress === 5 && claimedWhenVisible === 5) {
              loadingProgress = 100;
              loadingBarContainer.style.display = "none";
              dispatchRouterLoad();
              return;
          }
          var last = lastTime;
          var delta = ((lastTime = Date.now()) - last);
          if (loadingProgress >= 100) {
              if (!eventDispatched) {
                  dispatchRouterLoad();
                  eventDispatched = true;
              }
              if ((doneTime -= delta) <= 0) {
                  doneTime = visibilityTime;
                  loadingBarContainer.style.display = "none";
              }
              else {
                  requestAnimationFrame(step);
              }
              return;
          }
          if (loadingDone) {
              loadingProgress += delta / 2;
          }
          else {
              loadingProgress += delta * progressVel(loadingProgress) / 100;
          }
          loadingBar.style.transform = "scaleX(" + (loadingProgress / 100) + ")";
          nextFrame = requestAnimationFrame(step);
      };
      loadingBarContainer.style.display = "block";
      lastTime = Date.now();
      step();
  }
  function claim(claimer) {
      if (claimer == null) {
          return;
      }
      actualClaimedBy = claimer;
      claimedWhenVisible = loadingBarContainer.style.display === "block" ? loadingProgress : 5;
      loadingProgress = 5;
      loadingDone = false;
      startLoading();
  }
  function claimedBy(claimer) {
      return claimer != null && claimer === actualClaimedBy;
  }
  var claimed = claimedBy;
  function release(claimer) {
      if (claimer == null || actualClaimedBy !== claimer) {
          return;
      }
      loadingDone = true;
  }
  var rgbRegex = /^\s*rgb\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)\s*$/;
  var shortHexRegex = /^\s*#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\s*$/;
  var hexRegex = /^\s*#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})\s*$/;
  function applyColor(r, g, b) {
      loadingBar.style.background = "rgb(" + r + "," + g + "," + b + ")";
      loadingBarContainer.style.background = "rgb(" + r + "," + g + "," + b + ",0.5)";
  }
  function setColor(color) {
      if (typeof color !== "string") {
          throw new TypeError("color must be string");
      }
      var match = color.match(rgbRegex);
      if (match != null) {
          var r = parseFloat(match[1]);
          var g = parseFloat(match[2]);
          var b = parseFloat(match[3]);
          if (r > 255 || g > 255 || b > 255) {
              throw new TypeError("invalid color rgb arguments");
          }
          applyColor(r, g, b);
          return;
      }
      match = color.match(shortHexRegex);
      if (match != null) {
          color = "#" + match[1].repeat(2) + match[2].repeat(2) + match[3].repeat(2);
      }
      match = color.match(hexRegex);
      if (match != null) {
          var r = parseInt(match[1], 16);
          var g = parseInt(match[2], 16);
          var b = parseInt(match[3], 16);
          applyColor(r, g, b);
          return;
      }
      throw new TypeError("invalid color format");
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  /**
   * Tokenize input string.
   */
  function lexer(str) {
      var tokens = [];
      var i = 0;
      while (i < str.length) {
          var char = str[i];
          if (char === "*" || char === "+" || char === "?") {
              tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
              continue;
          }
          if (char === "\\") {
              tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
              continue;
          }
          if (char === "{") {
              tokens.push({ type: "OPEN", index: i, value: str[i++] });
              continue;
          }
          if (char === "}") {
              tokens.push({ type: "CLOSE", index: i, value: str[i++] });
              continue;
          }
          if (char === ":") {
              var name = "";
              var j = i + 1;
              while (j < str.length) {
                  var code = str.charCodeAt(j);
                  if (
                  // `0-9`
                  (code >= 48 && code <= 57) ||
                      // `A-Z`
                      (code >= 65 && code <= 90) ||
                      // `a-z`
                      (code >= 97 && code <= 122) ||
                      // `_`
                      code === 95) {
                      name += str[j++];
                      continue;
                  }
                  break;
              }
              if (!name)
                  throw new TypeError("Missing parameter name at " + i);
              tokens.push({ type: "NAME", index: i, value: name });
              i = j;
              continue;
          }
          if (char === "(") {
              var count = 1;
              var pattern = "";
              var j = i + 1;
              if (str[j] === "?") {
                  throw new TypeError("Pattern cannot start with \"?\" at " + j);
              }
              while (j < str.length) {
                  if (str[j] === "\\") {
                      pattern += str[j++] + str[j++];
                      continue;
                  }
                  if (str[j] === ")") {
                      count--;
                      if (count === 0) {
                          j++;
                          break;
                      }
                  }
                  else if (str[j] === "(") {
                      count++;
                      if (str[j + 1] !== "?") {
                          throw new TypeError("Capturing groups are not allowed at " + j);
                      }
                  }
                  pattern += str[j++];
              }
              if (count)
                  throw new TypeError("Unbalanced pattern at " + i);
              if (!pattern)
                  throw new TypeError("Missing pattern at " + i);
              tokens.push({ type: "PATTERN", index: i, value: pattern });
              i = j;
              continue;
          }
          tokens.push({ type: "CHAR", index: i, value: str[i++] });
      }
      tokens.push({ type: "END", index: i, value: "" });
      return tokens;
  }
  /**
   * Parse a string for the raw tokens.
   */
  function parse(str, options) {
      if (options === void 0) { options = {}; }
      var tokens = lexer(str);
      var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
      var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
      var result = [];
      var key = 0;
      var i = 0;
      var path = "";
      var tryConsume = function (type) {
          if (i < tokens.length && tokens[i].type === type)
              return tokens[i++].value;
      };
      var mustConsume = function (type) {
          var value = tryConsume(type);
          if (value !== undefined)
              return value;
          var _a = tokens[i], nextType = _a.type, index = _a.index;
          throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
      };
      var consumeText = function () {
          var result = "";
          var value;
          // tslint:disable-next-line
          while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
              result += value;
          }
          return result;
      };
      while (i < tokens.length) {
          var char = tryConsume("CHAR");
          var name = tryConsume("NAME");
          var pattern = tryConsume("PATTERN");
          if (name || pattern) {
              var prefix = char || "";
              if (prefixes.indexOf(prefix) === -1) {
                  path += prefix;
                  prefix = "";
              }
              if (path) {
                  result.push(path);
                  path = "";
              }
              result.push({
                  name: name || key++,
                  prefix: prefix,
                  suffix: "",
                  pattern: pattern || defaultPattern,
                  modifier: tryConsume("MODIFIER") || ""
              });
              continue;
          }
          var value = char || tryConsume("ESCAPED_CHAR");
          if (value) {
              path += value;
              continue;
          }
          if (path) {
              result.push(path);
              path = "";
          }
          var open = tryConsume("OPEN");
          if (open) {
              var prefix = consumeText();
              var name_1 = tryConsume("NAME") || "";
              var pattern_1 = tryConsume("PATTERN") || "";
              var suffix = consumeText();
              mustConsume("CLOSE");
              result.push({
                  name: name_1 || (pattern_1 ? key++ : ""),
                  pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                  prefix: prefix,
                  suffix: suffix,
                  modifier: tryConsume("MODIFIER") || ""
              });
              continue;
          }
          mustConsume("END");
      }
      return result;
  }
  /**
   * Escape a regular expression string.
   */
  function escapeString(str) {
      return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  /**
   * Get the flags for a regexp from the options.
   */
  function flags(options) {
      return options && options.sensitive ? "" : "i";
  }
  /**
   * Pull out keys from a regexp.
   */
  function regexpToRegexp(path, keys) {
      if (!keys)
          return path;
      var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
      var index = 0;
      var execResult = groupsRegex.exec(path.source);
      while (execResult) {
          keys.push({
              // Use parenthesized substring match if available, index otherwise
              name: execResult[1] || index++,
              prefix: "",
              suffix: "",
              modifier: "",
              pattern: ""
          });
          execResult = groupsRegex.exec(path.source);
      }
      return path;
  }
  /**
   * Transform an array into a regexp.
   */
  function arrayToRegexp(paths, keys, options) {
      var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
      return new RegExp("(?:" + parts.join("|") + ")", flags(options));
  }
  /**
   * Create a path regexp from string input.
   */
  function stringToRegexp(path, keys, options) {
      return tokensToRegexp(parse(path, options), keys, options);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   */
  function tokensToRegexp(tokens, keys, options) {
      if (options === void 0) { options = {}; }
      var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
      var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
      var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
      var route = start ? "^" : "";
      // Iterate over the tokens and create our regexp string.
      for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
          var token = tokens_1[_i];
          if (typeof token === "string") {
              route += escapeString(encode(token));
          }
          else {
              var prefix = escapeString(encode(token.prefix));
              var suffix = escapeString(encode(token.suffix));
              if (token.pattern) {
                  if (keys)
                      keys.push(token);
                  if (prefix || suffix) {
                      if (token.modifier === "+" || token.modifier === "*") {
                          var mod = token.modifier === "*" ? "?" : "";
                          route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                      }
                      else {
                          route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                      }
                  }
                  else {
                      route += "(" + token.pattern + ")" + token.modifier;
                  }
              }
              else {
                  route += "(?:" + prefix + suffix + ")" + token.modifier;
              }
          }
      }
      if (end) {
          if (!strict)
              route += delimiter + "?";
          route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
      }
      else {
          var endToken = tokens[tokens.length - 1];
          var isEndDelimited = typeof endToken === "string"
              ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
              : // tslint:disable-next-line
                  endToken === undefined;
          if (!strict) {
              route += "(?:" + delimiter + "(?=" + endsWith + "))?";
          }
          if (!isEndDelimited) {
              route += "(?=" + delimiter + "|" + endsWith + ")";
          }
      }
      return new RegExp(route, flags(options));
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   */
  function pathToRegexp(path, keys, options) {
      if (path instanceof RegExp)
          return regexpToRegexp(path, keys);
      if (Array.isArray(path))
          return arrayToRegexp(path, keys, options);
      return stringToRegexp(path, keys, options);
  }

  var LEADING_DELIMITER = /^[\\\/]+/;
  var TRAILING_DELIMITER = /[\\\/]+$/;
  var DELIMITER_NOT_IN_PARENTHESES = /[\\\/]+(?![^(]*[)])/g;
  function prepare(path) {
      return path.replace(LEADING_DELIMITER, "").replace(TRAILING_DELIMITER, "").replace(DELIMITER_NOT_IN_PARENTHESES, "/");
  }
  function generate(path, keys) {
      if (Array.isArray(path)) {
          path.map(function (value) {
              if (typeof value === "string") {
                  return prepare(value);
              }
              return value;
          });
      }
      if (typeof path === "string") {
          path = prepare(path);
      }
      return pathToRegexp(path, keys);
  }

  var ContextManager = (function () {
      function ContextManager() {
          this._contexts = new Map();
          this._hrefs = [];
          this._index = -1;
          this._length = 0;
      }
      ContextManager.prototype.clean = function () {
          if (this._index < this._length - 1) {
              var index_1 = this._index;
              var newHREFs_1 = [];
              this._hrefs.some(function (c_hrefs) {
                  var newCHrefs = [];
                  var result = c_hrefs[1].some(function (href) {
                      if (index_1-- >= 0) {
                          newCHrefs.push(href);
                          return false;
                      }
                      return true;
                  });
                  if (newCHrefs.length) {
                      newHREFs_1.push([c_hrefs[0], newCHrefs]);
                  }
                  return result;
              });
              this._hrefs = newHREFs_1;
              this._length = this._index + 1;
          }
      };
      ContextManager.prototype.currentContext = function () {
          if (this._hrefs.length === 0) {
              return null;
          }
          var index = this._index;
          var context;
          if (this._hrefs.some(function (_a) {
              var _b = __read(_a, 2), c = _b[0], hrefs = _b[1];
              context = c;
              index -= hrefs.length;
              return index < 0;
          })) {
              return context;
          }
          return null;
      };
      ContextManager.prototype.contextOf = function (href, skipFallback) {
          var e_1, _a;
          if (skipFallback === void 0) { skipFallback = true; }
          var foundContext = null;
          href = href.split("#")[0].split("?")[0];
          try {
              for (var _b = __values(this._contexts.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var _d = __read(_c.value, 2), context = _d[0], _e = __read(_d[1], 1), hrefs = _e[0];
                  if (hrefs.some(function (c_href) {
                      if (c_href.fallback && skipFallback) {
                          return false;
                      }
                      return c_href.path.test(href);
                  })) {
                      foundContext = context;
                      break;
                  }
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
          return foundContext;
      };
      ContextManager.prototype.insert = function (href, replace) {
          if (replace === void 0) { replace = false; }
          this.clean();
          var foundContext = this.contextOf(href, this._length > 0);
          var previousContext = this._hrefs.length > 0 ? this._hrefs[this._hrefs.length - 1] : null;
          if (foundContext == null) {
              if (this._hrefs.length > 0) {
                  this._hrefs[this._hrefs.length - 1][1].push(href);
                  this._length++;
                  this._index++;
              }
          }
          else {
              var i_1 = -1;
              if (this._hrefs.some(function (c_hrefs, index) {
                  if (c_hrefs[0] === foundContext) {
                      i_1 = index;
                      return true;
                  }
                  return false;
              })) {
                  var c_hrefs = this._hrefs.splice(i_1, 1)[0];
                  if (href !== c_hrefs[1][c_hrefs[1].length - 1]) {
                      c_hrefs[1].push(href);
                      this._length++;
                      this._index++;
                  }
                  this._hrefs.push(c_hrefs);
              }
              else {
                  this._hrefs.push([foundContext, [href]]);
                  this._length++;
                  this._index++;
              }
          }
          if (replace && this._hrefs.length > 0) {
              var lastContext = this._hrefs[this._hrefs.length - 1];
              if (lastContext === previousContext) {
                  if (lastContext[1].length > 1) {
                      do {
                          lastContext[1].splice(-2, 1);
                          this._length--;
                          this._index--;
                      } while (lastContext[1].length > 1 &&
                          lastContext[1][lastContext[1].length - 2] === href);
                  }
              }
              else if (previousContext != null) {
                  previousContext[1].splice(-1, 1);
                  this._length--;
                  this._index--;
              }
          }
      };
      ContextManager.prototype.goBackward = function () {
          this._index = Math.max(--this._index, 0);
          return this.get();
      };
      ContextManager.prototype.goForward = function () {
          this._index = Math.min(++this._index, this._length - 1);
          return this.get();
      };
      ContextManager.prototype.get = function (index) {
          if (index === void 0) { index = this._index; }
          var href;
          if (this._hrefs.some(function (_a) {
              var _b = __read(_a, 2); _b[0]; var hrefs = _b[1];
              var length = hrefs.length;
              if (index >= length) {
                  index -= length;
                  return false;
              }
              href = hrefs[index];
              return true;
          })) {
              return href;
          }
          return null;
      };
      ContextManager.prototype.index = function (value) {
          if (value === void 0) {
              return this._index;
          }
          value = parseInt(value, 10);
          if (isNaN(value)) {
              throw new Error("value must be a number");
          }
          this._index = value;
      };
      ContextManager.prototype.length = function () {
          return this._length;
      };
      ContextManager.prototype.getContextNames = function () {
          return Array.from(this._contexts.keys());
      };
      ContextManager.prototype.getDefaultOf = function (context) {
          var c = this._contexts.get(context);
          if (!c) {
              return null;
          }
          var href = c[1];
          if (href == null) {
              return null;
          }
          return href;
      };
      ContextManager.prototype.restore = function (context) {
          var _this = this;
          var tmpHREFs = this._hrefs;
          this.clean();
          if (this._hrefs.length) {
              var lastContext = this._hrefs[this._hrefs.length - 1];
              if (lastContext[0] === context) {
                  var path = this._contexts.get(context)[1] || lastContext[1][0];
                  var numPages = lastContext[1].splice(1).length;
                  this._length -= numPages;
                  this._index -= numPages;
                  lastContext[1][0] = path;
                  return true;
              }
          }
          if (!this._hrefs.some(function (c, i) {
              if (c[0] === context) {
                  if (i < _this._hrefs.length - 1) {
                      _this._hrefs.push(_this._hrefs.splice(i, 1)[0]);
                  }
                  return true;
              }
              return false;
          })) {
              var c = this._contexts.get(context);
              if (c == null) {
                  this._hrefs = tmpHREFs;
                  return false;
              }
              var href = c[1];
              if (href != null) {
                  this.insert(href);
                  return true;
              }
              return false;
          }
          return true;
      };
      ContextManager.prototype.addContextPath = function (context_name, path, fallback) {
          if (fallback === void 0) { fallback = false; }
          var pathRegexp = generate(path);
          var context = this._contexts.get(context_name);
          if (context == null) {
              this._contexts.set(context_name, context = [[], null]);
          }
          context[0].push({
              path: pathRegexp,
              fallback: fallback
          });
          return pathRegexp;
      };
      ContextManager.prototype.setContextDefaultHref = function (context_name, href) {
          var context = this._contexts.get(context_name);
          if (context == null) {
              this._contexts.set(context_name, context = [[], null]);
          }
          context[1] = href;
      };
      ContextManager.prototype.setContext = function (context) {
          var _this = this;
          context.paths.forEach(function (path) {
              _this.addContextPath(context.name, path.path, path.fallback);
          });
          if (context.default !== undefined) {
              this.setContextDefaultHref(context.name, context.default);
          }
      };
      ContextManager.prototype.hrefs = function () {
          var hrefs = [];
          this._hrefs.forEach(function (_a) {
              var _b = __read(_a, 2); _b[0]; var c_hrefs = _b[1];
              hrefs.push.apply(hrefs, c_hrefs);
          });
          return hrefs;
      };
      return ContextManager;
  }());

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

  var token = '%[a-f0-9]{2}';
  var singleMatcher = new RegExp(token, 'gi');
  var multiMatcher = new RegExp('(' + token + ')+', 'gi');

  function decodeComponents(components, split) {
  	try {
  		// Try to decode the entire string first
  		return decodeURIComponent(components.join(''));
  	} catch (err) {
  		// Do nothing
  	}

  	if (components.length === 1) {
  		return components;
  	}

  	split = split || 1;

  	// Split the array in 2 parts
  	var left = components.slice(0, split);
  	var right = components.slice(split);

  	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }

  function decode(input) {
  	try {
  		return decodeURIComponent(input);
  	} catch (err) {
  		var tokens = input.match(singleMatcher);

  		for (var i = 1; i < tokens.length; i++) {
  			input = decodeComponents(tokens, i).join('');

  			tokens = input.match(singleMatcher);
  		}

  		return input;
  	}
  }

  function customDecodeURIComponent(input) {
  	// Keep track of all the replacements and prefill the map with the `BOM`
  	var replaceMap = {
  		'%FE%FF': '\uFFFD\uFFFD',
  		'%FF%FE': '\uFFFD\uFFFD'
  	};

  	var match = multiMatcher.exec(input);
  	while (match) {
  		try {
  			// Decode as big chunks as possible
  			replaceMap[match[0]] = decodeURIComponent(match[0]);
  		} catch (err) {
  			var result = decode(match[0]);

  			if (result !== match[0]) {
  				replaceMap[match[0]] = result;
  			}
  		}

  		match = multiMatcher.exec(input);
  	}

  	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
  	replaceMap['%C2'] = '\uFFFD';

  	var entries = Object.keys(replaceMap);

  	for (var i = 0; i < entries.length; i++) {
  		// Replace all decoded components
  		var key = entries[i];
  		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  	}

  	return input;
  }

  var decodeUriComponent = function (encodedURI) {
  	if (typeof encodedURI !== 'string') {
  		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
  	}

  	try {
  		encodedURI = encodedURI.replace(/\+/g, ' ');

  		// Try the built in decoder first
  		return decodeURIComponent(encodedURI);
  	} catch (err) {
  		// Fallback to a more advanced decoder
  		return customDecodeURIComponent(encodedURI);
  	}
  };

  var splitOnFirst = (string, separator) => {
  	if (!(typeof string === 'string' && typeof separator === 'string')) {
  		throw new TypeError('Expected the arguments to be of type `string`');
  	}

  	if (separator === '') {
  		return [string];
  	}

  	const separatorIndex = string.indexOf(separator);

  	if (separatorIndex === -1) {
  		return [string];
  	}

  	return [
  		string.slice(0, separatorIndex),
  		string.slice(separatorIndex + separator.length)
  	];
  };

  var filterObj = function (obj, predicate) {
  	var ret = {};
  	var keys = Object.keys(obj);
  	var isArr = Array.isArray(predicate);

  	for (var i = 0; i < keys.length; i++) {
  		var key = keys[i];
  		var val = obj[key];

  		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
  			ret[key] = val;
  		}
  	}

  	return ret;
  };

  var queryString = createCommonjsModule(function (module, exports) {





  const isNullOrUndefined = value => value === null || value === undefined;

  function encoderForArrayFormat(options) {
  	switch (options.arrayFormat) {
  		case 'index':
  			return key => (result, value) => {
  				const index = result.length;

  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[', index, ']'].join('')];
  				}

  				return [
  					...result,
  					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
  				];
  			};

  		case 'bracket':
  			return key => (result, value) => {
  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, [encode(key, options), '[]'].join('')];
  				}

  				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
  			};

  		case 'comma':
  		case 'separator':
  			return key => (result, value) => {
  				if (value === null || value === undefined || value.length === 0) {
  					return result;
  				}

  				if (result.length === 0) {
  					return [[encode(key, options), '=', encode(value, options)].join('')];
  				}

  				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
  			};

  		default:
  			return key => (result, value) => {
  				if (
  					value === undefined ||
  					(options.skipNull && value === null) ||
  					(options.skipEmptyString && value === '')
  				) {
  					return result;
  				}

  				if (value === null) {
  					return [...result, encode(key, options)];
  				}

  				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
  			};
  	}
  }

  function parserForArrayFormat(options) {
  	let result;

  	switch (options.arrayFormat) {
  		case 'index':
  			return (key, value, accumulator) => {
  				result = /\[(\d*)\]$/.exec(key);

  				key = key.replace(/\[\d*\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}

  				accumulator[key][result[1]] = value;
  			};

  		case 'bracket':
  			return (key, value, accumulator) => {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');

  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}

  				if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};

  		case 'comma':
  		case 'separator':
  			return (key, value, accumulator) => {
  				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
  				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
  				value = isEncodedArray ? decode(value, options) : value;
  				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
  				accumulator[key] = newValue;
  			};

  		default:
  			return (key, value, accumulator) => {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}

  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }

  function validateArrayFormatSeparator(value) {
  	if (typeof value !== 'string' || value.length !== 1) {
  		throw new TypeError('arrayFormatSeparator must be single character string');
  	}
  }

  function encode(value, options) {
  	if (options.encode) {
  		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  	}

  	return value;
  }

  function decode(value, options) {
  	if (options.decode) {
  		return decodeUriComponent(value);
  	}

  	return value;
  }

  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	}

  	if (typeof input === 'object') {
  		return keysSorter(Object.keys(input))
  			.sort((a, b) => Number(a) - Number(b))
  			.map(key => input[key]);
  	}

  	return input;
  }

  function removeHash(input) {
  	const hashStart = input.indexOf('#');
  	if (hashStart !== -1) {
  		input = input.slice(0, hashStart);
  	}

  	return input;
  }

  function getHash(url) {
  	let hash = '';
  	const hashStart = url.indexOf('#');
  	if (hashStart !== -1) {
  		hash = url.slice(hashStart);
  	}

  	return hash;
  }

  function extract(input) {
  	input = removeHash(input);
  	const queryStart = input.indexOf('?');
  	if (queryStart === -1) {
  		return '';
  	}

  	return input.slice(queryStart + 1);
  }

  function parseValue(value, options) {
  	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
  		value = Number(value);
  	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
  		value = value.toLowerCase() === 'true';
  	}

  	return value;
  }

  function parse(query, options) {
  	options = Object.assign({
  		decode: true,
  		sort: true,
  		arrayFormat: 'none',
  		arrayFormatSeparator: ',',
  		parseNumbers: false,
  		parseBooleans: false
  	}, options);

  	validateArrayFormatSeparator(options.arrayFormatSeparator);

  	const formatter = parserForArrayFormat(options);

  	// Create an object with no prototype
  	const ret = Object.create(null);

  	if (typeof query !== 'string') {
  		return ret;
  	}

  	query = query.trim().replace(/^[?#&]/, '');

  	if (!query) {
  		return ret;
  	}

  	for (const param of query.split('&')) {
  		if (param === '') {
  			continue;
  		}

  		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

  		// Missing `=` should be `null`:
  		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
  		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
  		formatter(decode(key, options), value, ret);
  	}

  	for (const key of Object.keys(ret)) {
  		const value = ret[key];
  		if (typeof value === 'object' && value !== null) {
  			for (const k of Object.keys(value)) {
  				value[k] = parseValue(value[k], options);
  			}
  		} else {
  			ret[key] = parseValue(value, options);
  		}
  	}

  	if (options.sort === false) {
  		return ret;
  	}

  	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
  		const value = ret[key];
  		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
  			// Sort object keys, not values
  			result[key] = keysSorter(value);
  		} else {
  			result[key] = value;
  		}

  		return result;
  	}, Object.create(null));
  }

  exports.extract = extract;
  exports.parse = parse;

  exports.stringify = (object, options) => {
  	if (!object) {
  		return '';
  	}

  	options = Object.assign({
  		encode: true,
  		strict: true,
  		arrayFormat: 'none',
  		arrayFormatSeparator: ','
  	}, options);

  	validateArrayFormatSeparator(options.arrayFormatSeparator);

  	const shouldFilter = key => (
  		(options.skipNull && isNullOrUndefined(object[key])) ||
  		(options.skipEmptyString && object[key] === '')
  	);

  	const formatter = encoderForArrayFormat(options);

  	const objectCopy = {};

  	for (const key of Object.keys(object)) {
  		if (!shouldFilter(key)) {
  			objectCopy[key] = object[key];
  		}
  	}

  	const keys = Object.keys(objectCopy);

  	if (options.sort !== false) {
  		keys.sort(options.sort);
  	}

  	return keys.map(key => {
  		const value = object[key];

  		if (value === undefined) {
  			return '';
  		}

  		if (value === null) {
  			return encode(key, options);
  		}

  		if (Array.isArray(value)) {
  			return value
  				.reduce(formatter(key), [])
  				.join('&');
  		}

  		return encode(key, options) + '=' + encode(value, options);
  	}).filter(x => x.length > 0).join('&');
  };

  exports.parseUrl = (url, options) => {
  	options = Object.assign({
  		decode: true
  	}, options);

  	const [url_, hash] = splitOnFirst(url, '#');

  	return Object.assign(
  		{
  			url: url_.split('?')[0] || '',
  			query: parse(extract(url), options)
  		},
  		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
  	);
  };

  exports.stringifyUrl = (object, options) => {
  	options = Object.assign({
  		encode: true,
  		strict: true
  	}, options);

  	const url = removeHash(object.url).split('?')[0] || '';
  	const queryFromUrl = exports.extract(object.url);
  	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

  	const query = Object.assign(parsedQueryFromUrl, object.query);
  	let queryString = exports.stringify(query, options);
  	if (queryString) {
  		queryString = `?${queryString}`;
  	}

  	let hash = getHash(object.url);
  	if (object.fragmentIdentifier) {
  		hash = `#${encode(object.fragmentIdentifier, options)}`;
  	}

  	return `${url}${queryString}${hash}`;
  };

  exports.pick = (input, filter, options) => {
  	options = Object.assign({
  		parseFragmentIdentifier: true
  	}, options);

  	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
  	return exports.stringifyUrl({
  		url,
  		query: filterObj(query, filter),
  		fragmentIdentifier
  	}, options);
  };

  exports.exclude = (input, filter, options) => {
  	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

  	return exports.pick(input, exclusionFilter, options);
  };
  });

  var DIVIDER = "#R!:";
  var catchPopState$2 = null;
  window.addEventListener("popstate", function (event) {
      if (catchPopState$2 == null) {
          return;
      }
      event.stopImmediatePropagation();
      event.stopPropagation();
      catchPopState$2();
  }, true);
  function onCatchPopState$2(onCatchPopState, once) {
      if (once === void 0) { once = false; }
      if (once) {
          var tmpOnCatchPopState_1 = onCatchPopState;
          onCatchPopState = function () {
              catchPopState$2 = null;
              tmpOnCatchPopState_1();
          };
      }
      catchPopState$2 = onCatchPopState;
  }
  function goTo$1(href, replace) {
      if (replace === void 0) { replace = false; }
      return new Promise(function (resolve) {
          if (href === window.location.href) {
              return resolve();
          }
          onCatchPopState$2(resolve, true);
          if (replace) {
              window.location.replace(href);
          }
          else {
              window.location.assign(href);
          }
      });
  }
  function splitHref(href) {
      if (href === void 0) { href = window.location.href; }
      var splitted = href.split(DIVIDER);
      if (splitted.length > 2) {
          return [
              splitted.slice(0, splitted.length - 1).join(DIVIDER),
              splitted[splitted.length - 1]
          ];
      }
      return [splitted[0], splitted[1] || ""];
  }
  function optsToStr(opts) {
      var filteredOpts = {};
      Object.entries(opts).forEach(function (_a) {
          var _b = __read(_a, 2), key = _b[0], value = _b[1];
          if (value !== undefined) {
              filteredOpts[key] = value;
          }
      });
      return queryString.stringify(filteredOpts);
  }
  function get$1() {
      return queryString.parse(splitHref()[1]);
  }
  function set(opts) {
      var newHref = splitHref()[0] + DIVIDER + optsToStr(opts);
      return goTo$1(newHref, true);
  }
  function goWith(href, opts, replace) {
      if (replace === void 0) { replace = false; }
      var newHref = splitHref(href)[0] + DIVIDER + optsToStr(opts);
      return goTo$1(newHref, replace);
  }
  function clearHref() {
      return splitHref()[0];
  }
  if (Object.keys(get$1()).length > 0) {
      set({});
  }

  var BASE = window.location.href.split("#")[0] + "#";
  function base(value) {
      if (value != null) {
          BASE = value;
      }
      return BASE;
  }
  function get() {
      return prepare(clearHref().split(BASE).slice(1).join(BASE));
  }
  function construct(href) {
      switch (href[0]) {
          case "?": {
              href = get().split("?")[0] + href;
              break;
          }
          case "#": {
              href = get().split("#")[0] + href;
              break;
          }
      }
      return BASE + href;
  }

  var started = false;
  var historyManaged = null;
  function setAutoManagement(value) {
      if (started) {
          throw new Error("HistoryManager already started");
      }
      historyManaged = !!value;
  }
  function getAutoManagement() {
      return historyManaged || false;
  }
  var works = [];
  var onworkfinished = [];
  function onWorkFinished(callback, context) {
      if (works.length === 0) {
          callback.call(context || null);
          return;
      }
      onworkfinished.push([callback, context || null]);
  }
  function createWork(locking) {
      if (locking === void 0) { locking = false; }
      var finished = false;
      var finishing = false;
      var work = {
          get locking() {
              return locking;
          },
          get finished() {
              return finished;
          },
          get finishing() {
              return finishing;
          },
          finish: function () {
              if (finished) {
                  return;
              }
              finished = true;
              finishing = false;
              var i = works.length - 1;
              for (; i >= 0; i--) {
                  if (works[i] === work) {
                      works.splice(i, 1);
                      break;
                  }
              }
              if (i >= 0 && works.length === 0) {
                  while (onworkfinished.length > 0 && works.length === 0) {
                      var _a = __read(onworkfinished.shift(), 2), callback = _a[0], context = _a[1];
                      callback.call(context || window);
                  }
              }
          },
          beginFinish: function () {
              finishing = true;
          },
          askFinish: function () {
              return false;
          }
      };
      works.push(work);
      return work;
  }
  function acquire() {
      var lock = createWork(true);
      return lock;
  }
  function isLocked$1() {
      return works.some(function (w) { return w.locking; });
  }
  var catchPopState$1 = null;
  window.addEventListener("popstate", function (event) {
      if (!started || isLocked$1()) {
          return;
      }
      if (catchPopState$1 == null) {
          handlePopState$1();
          return;
      }
      event.stopImmediatePropagation();
      catchPopState$1();
  }, true);
  function onCatchPopState$1(onCatchPopState, once) {
      if (once === void 0) { once = false; }
      if (once) {
          var tmpOnCatchPopState_1 = onCatchPopState;
          onCatchPopState = function () {
              catchPopState$1 = null;
              tmpOnCatchPopState_1();
          };
      }
      catchPopState$1 = onCatchPopState;
  }
  function goTo(href, replace) {
      if (replace === void 0) { replace = false; }
      href = construct(href);
      if (window.location.href === href) {
          window.dispatchEvent(new Event("popstate"));
          return;
      }
      if (replace) {
          window.location.replace(href);
      }
      else {
          window.location.assign(href);
      }
  }
  function addFront(frontHref) {
      if (frontHref === void 0) { frontHref = "next"; }
      var href = get();
      var work = createWork();
      return new Promise(function (resolve) {
          goWith(construct(frontHref), { back: undefined, front: null })
              .then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              window.history.go(-1);
          }); })
              .then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              goTo(href, true);
          }); })
              .then(function () {
              work.finish();
              resolve();
          });
      });
  }
  function addBack(backHref) {
      if (backHref === void 0) { backHref = ""; }
      var href = get();
      var work = createWork();
      return new Promise(function (resolve) {
          (new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              window.history.go(-1);
          }))
              .then(function () { return new Promise(function (resolve) {
              if (backHref) {
                  onCatchPopState$1(resolve, true);
                  goTo(backHref, true);
              }
              else {
                  resolve();
              }
          }); })
              .then(function () { return set({ back: null, front: undefined }); })
              .then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              goTo(href);
          }); })
              .then(function () {
              work.finish();
              resolve();
          });
      });
  }
  var hasBack = false;
  var contextManager = new ContextManager();
  function index$1() {
      return contextManager.index();
  }
  function getHREFAt(index) {
      return contextManager.get(index);
  }
  function setContext$1(context) {
      if (historyManaged === null) {
          historyManaged = true;
      }
      return contextManager.setContext(context);
  }
  function addContextPath$1(context, href, isFallback) {
      if (isFallback === void 0) { isFallback = false; }
      if (historyManaged === null) {
          historyManaged = true;
      }
      return contextManager.addContextPath(context, href, isFallback);
  }
  function setContextDefaultHref$1(context, href) {
      if (historyManaged === null) {
          historyManaged = true;
      }
      return contextManager.setContextDefaultHref(context, href);
  }
  function getContextDefaultOf$1(context) {
      return contextManager.getDefaultOf(context);
  }
  function getContext$1(href) {
      if (href === void 0) { href = null; }
      if (href == null) {
          return contextManager.currentContext();
      }
      return contextManager.contextOf(href);
  }
  function getHREFs() {
      if (!historyManaged) {
          throw new Error("can't keep track of hrefs without history management");
      }
      return contextManager.hrefs();
  }
  function tryUnlock() {
      var locksAsked = 0;
      for (var i = works.length - 1; i >= 0; i--) {
          var work = works[i];
          if (work.locking && !work.finishing) {
              if (!work.askFinish()) {
                  return -1;
              }
              locksAsked++;
          }
      }
      return locksAsked;
  }
  var workToRelease = null;
  function restore(context) {
      if (!historyManaged) {
          throw new Error("can't restore a context without history management");
      }
      var locksFinished = tryUnlock();
      if (locksFinished === -1) {
          return new Promise(function (_, reject) { reject(); });
      }
      var promiseResolve;
      var promise = new Promise(function (resolve) { promiseResolve = resolve; });
      onWorkFinished(function () {
          var previousIndex = contextManager.index();
          if (contextManager.restore(context)) {
              var replace_1 = previousIndex >= contextManager.index();
              workToRelease = createWork();
              onWorkFinished(promiseResolve);
              var href_1 = contextManager.get();
              var hadBack_1 = hasBack;
              (new Promise(function (resolve) {
                  if (!replace_1 && !hasBack) {
                      onCatchPopState$1(resolve, true);
                      goTo(href_1);
                  }
                  else {
                      resolve();
                  }
              }))
                  .then(function () { return new Promise(function (resolve) {
                  var index = contextManager.index() - 1;
                  if (replace_1 && !hasBack) {
                      resolve();
                  }
                  else {
                      addBack(contextManager.get(index))
                          .then(function () {
                          hasBack = true;
                          resolve();
                      });
                  }
              }); })
                  .then(function () { return new Promise(function (resolve) {
                  if (hadBack_1 || replace_1) {
                      onCatchPopState$1(resolve, true);
                      goTo(href_1, true);
                  }
                  else {
                      resolve();
                  }
              }); })
                  .then(onlanded);
          }
          else {
              promiseResolve();
          }
      });
      return promise;
  }
  function assign(href) {
      var locksFinished = tryUnlock();
      if (locksFinished === -1) {
          return new Promise(function (_, reject) { reject(); });
      }
      var promiseResolve;
      var promise = new Promise(function (resolve) { promiseResolve = resolve; });
      onWorkFinished(function () {
          workToRelease = createWork();
          onWorkFinished(promiseResolve);
          goTo(href);
      });
      return promise;
  }
  var replacing = false;
  function replace(href) {
      var locksFinished = tryUnlock();
      if (locksFinished === -1) {
          return new Promise(function (_, reject) { reject(); });
      }
      var promiseResolve;
      var promise = new Promise(function (resolve) { promiseResolve = resolve; });
      onWorkFinished(function () {
          workToRelease = createWork();
          onWorkFinished(promiseResolve);
          goTo(href, replacing = true);
      });
      return promise;
  }
  function go$1(direction) {
      var locksFinished = tryUnlock();
      if (locksFinished === -1) {
          return new Promise(function (resolve, reject) {
              reject();
          });
      }
      if (direction === 0) {
          return Promise.resolve();
      }
      direction = parseInt(direction, 10) + locksFinished;
      if (isNaN(direction)) {
          throw new Error("direction must be a number");
      }
      if (direction === 0) {
          return Promise.resolve();
      }
      var promiseResolve;
      var promise = new Promise(function (resolve, reject) { promiseResolve = resolve; });
      onWorkFinished(function () {
          if (historyManaged === false) {
              window.history.go(direction);
              promiseResolve();
              return;
          }
          var contextIndex = contextManager.index();
          var index = Math.max(0, Math.min(contextManager.length() - 1, contextIndex + direction));
          if (contextIndex === index) {
              onlanded();
              promiseResolve();
              return;
          }
          workToRelease = createWork();
          onWorkFinished(promiseResolve);
          if (direction > 0) {
              contextManager.index(index - 1);
              window.history.go(1);
          }
          else {
              contextManager.index(index + 1);
              window.history.go(-1);
          }
      });
      return promise;
  }
  function start$1(fallbackContext) {
      if (historyManaged === null) {
          historyManaged = false;
      }
      fallbackContext = historyManaged ?
          (fallbackContext === void 0 ? contextManager.getContextNames()[0] : fallbackContext)
          : null;
      var href = get();
      var promiseResolve;
      var promiseReject;
      var promise = new Promise(function (resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
      });
      if (historyManaged) {
          var context = contextManager.contextOf(href, false);
          if (context == null) {
              if (!fallbackContext) {
                  throw new Error("must define a fallback context");
              }
              var defaultHREF = contextManager.getDefaultOf(fallbackContext);
              if (defaultHREF == null) {
                  throw new Error("must define a default href for the fallback context");
              }
              started = true;
              href = defaultHREF;
              workToRelease = createWork();
              onCatchPopState$1(function () { onlanded(); promiseResolve(); }, true);
              goTo(defaultHREF, true);
          }
          contextManager.insert(href);
          if (context == null) {
              promiseReject();
              return promise;
          }
      }
      started = true;
      onlanded();
      promiseResolve();
      return promise;
  }
  function onlanded() {
      window.dispatchEvent(new Event("historylanded"));
      if (workToRelease != null) {
          var work = workToRelease;
          workToRelease = null;
          work.finish();
      }
  }
  function handlePopState$1() {
      var options = __assign(__assign({}, get$1()), (historyManaged ? {} : { front: undefined, back: undefined }));
      if (options.locked) {
          onCatchPopState$1(function () {
              if (get$1().locked) {
                  handlePopState$1();
              }
          }, true);
          window.history.go(-1);
          return;
      }
      if (options.front !== undefined) {
          var frontEvent = new Event("historyforward", { cancelable: true });
          window.dispatchEvent(frontEvent);
          if (frontEvent.defaultPrevented) {
              onCatchPopState$1(function () { return; }, true);
              window.history.go(-1);
              return;
          }
          var backHref = contextManager.get();
          var href_2 = contextManager.goForward();
          (new Promise(function (resolve) {
              if (hasBack) {
                  onCatchPopState$1(resolve, true);
                  window.history.go(-1);
              }
              else {
                  resolve();
              }
          }))
              .then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              goTo(href_2, true);
          }); })
              .then(addBack.bind(null, backHref))
              .then(function () { return new Promise(function (resolve) {
              if (contextManager.index() < contextManager.length() - 1) {
                  onCatchPopState$1(resolve, true);
                  addFront(contextManager.get(contextManager.index() + 1)).then(resolve);
              }
              else {
                  resolve();
              }
          }); })
              .then(function () {
              hasBack = true;
              onlanded();
          });
      }
      else if (options.back !== undefined) {
          var backEvent = new Event("historybackward", { cancelable: true });
          window.dispatchEvent(backEvent);
          if (backEvent.defaultPrevented) {
              onCatchPopState$1(function () { return; }, true);
              window.history.go(+1);
              return;
          }
          var frontHref = contextManager.get();
          var href_3 = contextManager.goBackward();
          (new Promise(function (resolve) {
              if (contextManager.index() > 0) {
                  onCatchPopState$1(resolve, true);
                  window.history.go(1);
              }
              else {
                  resolve();
              }
          })).then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              goTo(href_3, true);
          }); })
              .then(addFront.bind(null, frontHref))
              .then(function () {
              hasBack = contextManager.index() > 0;
              onlanded();
          });
      }
      else {
          var href_4 = get();
          var backHref_1 = contextManager.get();
          if (href_4 === backHref_1 || !historyManaged) {
              return onlanded();
          }
          var replaced_1 = replacing;
          replacing = false;
          var willHaveBack_1 = hasBack || !replaced_1;
          contextManager.insert(href_4, replaced_1);
          (new Promise(function (resolve) {
              if (hasBack && !replaced_1) {
                  onCatchPopState$1(resolve, true);
                  window.history.go(-1);
              }
              else {
                  resolve();
              }
          }))
              .then(function () {
              if (replaced_1) {
                  return Promise.resolve();
              }
              return addBack(backHref_1);
          })
              .then(function () { return new Promise(function (resolve) {
              onCatchPopState$1(resolve, true);
              goTo(href_4, true);
          }); })
              .then(function () {
              hasBack = willHaveBack_1;
              onlanded();
          });
      }
  }

  var HistoryManager = /*#__PURE__*/Object.freeze({
      __proto__: null,
      setAutoManagement: setAutoManagement,
      getAutoManagement: getAutoManagement,
      onWorkFinished: onWorkFinished,
      acquire: acquire,
      addFront: addFront,
      addBack: addBack,
      index: index$1,
      getHREFAt: getHREFAt,
      setContext: setContext$1,
      addContextPath: addContextPath$1,
      setContextDefaultHref: setContextDefaultHref$1,
      getContextDefaultOf: getContextDefaultOf$1,
      getContext: getContext$1,
      getHREFs: getHREFs,
      restore: restore,
      assign: assign,
      replace: replace,
      go: go$1,
      start: start$1
  });

  var locks$1 = [];
  var catchPopState = null;
  window.addEventListener("popstate", function (event) {
      if (catchPopState == null) {
          return handlePopState();
      }
      event.stopImmediatePropagation();
      catchPopState();
  }, true);
  function onCatchPopState(onCatchPopState, once) {
      if (once === void 0) { once = false; }
      if (once) {
          var tmpOnCatchPopState_1 = onCatchPopState;
          onCatchPopState = function () {
              catchPopState = null;
              tmpOnCatchPopState_1();
          };
      }
      catchPopState = onCatchPopState;
  }
  function lock$2() {
      var delegate = new EventTarget();
      var id = Date.now();
      var historyLock;
      var promiseResolve;
      var isPromiseResolved = false;
      var promise = new Promise(function (resolve) {
          promiseResolve = function (lock) {
              resolve(lock);
              isPromiseResolved = true;
          };
      });
      onWorkFinished(function () {
          historyLock = acquire();
          var lock = {
              lock: {
                  get id() {
                      return id;
                  },
                  listen: function (listener) {
                      delegate.addEventListener("navigation", listener);
                  },
                  unlisten: function (listener) {
                      delegate.removeEventListener("navigation", listener);
                  },
                  unlock: function () {
                      if (!locks$1.length || historyLock.finishing) {
                          return;
                      }
                      var fn = function () {
                          if (locks$1[locks$1.length - 1].lock.id === id) {
                              unlock$1();
                          }
                          else {
                              locks$1.some(function (lock, index) {
                                  if (lock.lock.id === id) {
                                      locks$1.splice(index, 1)[0].release();
                                  }
                                  return false;
                              });
                          }
                      };
                      if (isPromiseResolved) {
                          fn();
                      }
                      else {
                          promise.then(fn);
                      }
                  }
              },
              fire: function () {
                  var e = new Event("navigation", { cancelable: true });
                  delegate.dispatchEvent(e);
                  return e.defaultPrevented;
              },
              release: function () {
                  historyLock.finish();
              },
              beginRelease: function (start_fn) {
                  historyLock.beginFinish();
                  if (isPromiseResolved) {
                      start_fn();
                  }
                  else {
                      promise.then(function () { return start_fn(); });
                  }
              }
          };
          historyLock.askFinish = function () {
              if (!lock.fire()) {
                  return false;
              }
              lock.lock.unlock();
              return true;
          };
          locks$1.push(lock);
          goWith(clearHref(), __assign(__assign({}, get$1()), { locked: lock.lock.id })).then(function () {
              promiseResolve(lock.lock);
          });
      });
      return promise;
  }
  function unlock$1(force) {
      if (force === void 0) { force = true; }
      var wrapper = locks$1.splice(locks$1.length - 1, 1)[0];
      if (wrapper == null) {
          return true;
      }
      if (!force && !wrapper.fire()) {
          return false;
      }
      wrapper.beginRelease(function () {
          onCatchPopState(function () {
              wrapper.release();
          }, true);
          window.history.go(-1);
      });
      return true;
  }
  function locked$1() {
      return locks$1.length > 0;
  }
  var shouldUnlock = false;
  function handlePopState() {
      if (locks$1.length === 0) {
          return;
      }
      var lockId = parseInt(get$1().locked, 10);
      if (isNaN(lockId)) {
          shouldUnlock = true;
          window.history.go(1);
      }
      else {
          var lock_1 = locks$1[locks$1.length - 1];
          if (lockId === lock_1.lock.id) {
              if (shouldUnlock && lock_1.fire()) {
                  unlock$1();
              }
              shouldUnlock = false;
              return;
          }
          else if (lockId > lock_1.lock.id) {
              window.history.go(-1);
          }
          else {
              shouldUnlock = true;
              window.history.go(1);
          }
      }
  }

  var NavigationLock = /*#__PURE__*/Object.freeze({
      __proto__: null,
      lock: lock$2,
      unlock: unlock$1,
      locked: locked$1
  });

  var _a, _b, _c;
  var ROUTES = Symbol("routes");
  var REDIRECTIONS = Symbol("redirections");
  var DESTROYED = Symbol("destroyed");
  function KeyMapFrom(keys, values) {
      var map = new Map();
      keys.forEach(function (key, index) {
          map.set(key.name.toString(), values[index]);
      });
      return map;
  }
  var routers = [];
  function getLocation(href) {
      if (href === void 0) { href = get(); }
      var pathname = "";
      var hash = "";
      var query = "";
      var cachedQuery = null;
      {
          var split = href.split("#");
          pathname = split.shift();
          hash = split.join("#");
          hash = hash ? "#" + hash : "";
      }
      {
          var split = pathname.split("?");
          pathname = split.shift();
          query = split.join("?");
          query = query ? "?" + query : "";
      }
      pathname = prepare(pathname);
      return {
          hrefIf: function (go) {
              var oldP = pathname;
              var oldH = hash;
              var oldQ = query;
              this.href = go;
              var hrefIf = this.href;
              pathname = oldP;
              hash = oldH;
              query = oldQ;
              return hrefIf;
          },
          get href() {
              return pathname + query + hash;
          },
          set href(value) {
              if (typeof value !== "string") {
                  throw new Error("href should be a string");
              }
              if (!value) {
                  return;
              }
              var match = value.match(/^([\/\\]{2,})|([\/\\]{1})|([#])|([\?])/);
              if (match) {
                  switch (match[0]) {
                      case "?": {
                          query = "?" + encodeURI(value.substr(1)).replace("#", "%23").replace("?", "%3F");
                          break;
                      }
                      case "#": {
                          hash = value;
                          break;
                      }
                      case "/": {
                          pathname = prepare(value);
                          hash = "";
                          query = "";
                          break;
                      }
                      default: {
                          return;
                      }
                  }
              }
              else {
                  var path = pathname.split("/");
                  path.pop();
                  path.push(prepare(value));
                  pathname = path.join("/");
                  hash = "";
                  query = "";
              }
          },
          get pathname() {
              return pathname;
          },
          set pathname(value) {
              if (typeof value !== "string") {
                  throw new Error("pathname should be a string");
              }
              pathname = prepare(value);
          },
          get hash() {
              return hash;
          },
          set hash(value) {
              if (typeof value !== "string") {
                  throw new Error("hash should be a string");
              }
              if (!value) {
                  hash = "";
                  return;
              }
              if (value.indexOf("#") !== 0) {
                  value = "#" + value;
              }
              hash = value;
          },
          get query() {
              return query;
          },
          set query(value) {
              if (typeof value !== "string") {
                  throw new Error("query should be a string");
              }
              cachedQuery = null;
              if (!value) {
                  query = "";
                  return;
              }
              if (value.indexOf("?") !== 0) {
                  value = "?" + value;
              }
              query = encodeURI(value).replace("#", "%23");
          },
          get parsedQuery() {
              if (!query) {
                  return {};
              }
              if (!cachedQuery) {
                  cachedQuery = queryString.parse(query.replace(/^\?/, ""));
              }
              return cachedQuery;
          },
          hasQueryParam: function (param) {
              if (!query) {
                  return false;
              }
              return this.parsedQuery[param] !== undefined;
          },
          getQueryParam: function (param) {
              if (!query) {
                  return undefined;
              }
              return this.parsedQuery[param];
          },
          addQueryParam: function (param, value) {
              var _d;
              if (value === void 0) { value = null; }
              var newQuery = __assign(__assign({}, this.parsedQuery), (_d = {}, _d[param] = value, _d));
              cachedQuery = null;
              query = queryString.stringify(newQuery);
              if (query) {
                  query = "?" + query;
              }
          },
          removeQueryParam: function (param) {
              if (!query) {
                  return;
              }
              var parsedQuery = this.parsedQuery;
              delete parsedQuery[param];
              this.query = queryString.stringify(parsedQuery);
          }
      };
  }
  function emitSingle(router, location) {
      var path;
      if (location) {
          path = location.pathname;
      }
      else {
          location = getLocation();
          path = location.pathname;
      }
      var redirection = null;
      router[REDIRECTIONS].some(function (redirectionRoute) {
          var exec = redirectionRoute.regex.exec(path);
          if (exec) {
              redirection = { location: location, keymap: KeyMapFrom(redirectionRoute.keys, exec.slice(1)) };
              location = getLocation(redirectionRoute.redirection);
              path = location.pathname;
              return false;
          }
          return false;
      });
      router[ROUTES].some(function (route) {
          var exec = route.regex.exec(path);
          if (exec) {
              route.callback(location, KeyMapFrom(route.keys, exec.slice(1)), redirection);
              return true;
          }
          return false;
      });
  }
  function _emit() {
      var location = getLocation();
      routers.forEach(function (router) {
          emitSingle(router, location);
      });
  }
  var emitRoute = true;
  function onland() {
      if (emitRoute) {
          _emit();
      }
      else {
          emitRoute = true;
      }
  }
  window.addEventListener("historylanded", onland);
  function _go(path, replace$1, emit) {
      if (replace$1 === void 0) { replace$1 = false; }
      if (emit === void 0) { emit = true; }
      var lastEmitRoute = emitRoute;
      emitRoute = emit;
      return (replace$1 ? replace(path) : assign(path)).catch(function () {
          emitRoute = lastEmitRoute;
      });
  }
  function _throwIfDestroyed(router) {
      if (router[DESTROYED]) {
          throw new Error("Router destroyed");
      }
  }
  var GenericRouter = (function () {
      function GenericRouter() {
          this[_a] = [];
          this[_b] = [];
          this[_c] = false;
          routers.push(this);
      }
      GenericRouter.prototype.destroy = function () {
          if (this[DESTROYED]) {
              return;
          }
          var index = routers.indexOf(this);
          if (index > -1) {
              routers.splice(index, 1);
          }
          this[DESTROYED] = true;
      };
      GenericRouter.prototype.redirect = function (path, redirection) {
          _throwIfDestroyed(this);
          var keys = [];
          var regex = generate(path, keys);
          this[REDIRECTIONS].push({ regex: regex, keys: keys, redirection: prepare(redirection) });
          return regex;
      };
      GenericRouter.prototype.unredirect = function (path) {
          _throwIfDestroyed(this);
          var keys = [];
          var regex = generate(path, keys);
          var rIndex = -1;
          this[ROUTES].some(function (route, index) {
              var xSource = (regex.ignoreCase ? regex.source.toLowerCase() : regex.source);
              var ySource = (route.regex.ignoreCase ? route.regex.source.toLowerCase() : route.regex.source);
              if ((xSource === ySource) && (regex.global === route.regex.global) &&
                  (regex.ignoreCase === route.regex.ignoreCase) && (regex.multiline === route.regex.multiline)) {
                  rIndex = index;
                  return true;
              }
              return false;
          });
          if (rIndex > -1) {
              this[ROUTES].splice(rIndex, 1);
          }
      };
      GenericRouter.prototype.route = function (path, callback) {
          _throwIfDestroyed(this);
          var keys = [];
          var regex = generate(path, keys);
          this[ROUTES].push({ regex: regex, keys: keys, callback: callback });
          return regex;
      };
      GenericRouter.prototype.unroute = function (path) {
          _throwIfDestroyed(this);
          var keys = [];
          var regex = generate(path, keys);
          var rIndex = -1;
          this[ROUTES].some(function (route, index) {
              var xSource = (regex.ignoreCase ? regex.source.toLowerCase() : regex.source);
              var ySource = (route.regex.ignoreCase ? route.regex.source.toLowerCase() : route.regex.source);
              if ((xSource === ySource) && (regex.global === route.regex.global) &&
                  (regex.ignoreCase === route.regex.ignoreCase) && (regex.multiline === route.regex.multiline)) {
                  rIndex = index;
                  return true;
              }
              return false;
          });
          if (rIndex > -1) {
              this[ROUTES].splice(rIndex, 1);
          }
      };
      GenericRouter.prototype.emit = function () {
          emitSingle(this);
      };
      return GenericRouter;
  }());
  _a = ROUTES, _b = REDIRECTIONS, _c = DESTROYED;
  var main = new GenericRouter();
  function redirect(path, redirection) {
      return main.redirect(path, redirection);
  }
  function unredirect(path) {
      return main.unredirect(path);
  }
  function route(path, callback) {
      return main.route(path, callback);
  }
  function unroute(path) {
      return main.unroute(path);
  }
  function start(startingContext) {
      return start$1(startingContext);
  }
  function index() {
      return index$1();
  }
  function getLocationAt(index) {
      var href = getHREFAt(index);
      if (href == null) {
          return null;
      }
      return getLocation(href);
  }
  function addContextPath(context, href, isFallback) {
      if (isFallback === void 0) { isFallback = false; }
      return addContextPath$1(context, href, isFallback);
  }
  function setContextDefaultHref(context, href) {
      return setContextDefaultHref$1(context, href);
  }
  function setContext(context) {
      return setContext$1(context);
  }
  function getContext(href) {
      return getContext$1(href);
  }
  function restoreContext(context, defaultHref) {
      return restore(context);
  }
  function getContextDefaultOf(context) {
      return getContextDefaultOf$1(context);
  }
  function emit(single) {
      if (single === void 0) { single = false; }
      if (single) {
          return emitSingle(main);
      }
      return _emit();
  }
  function create() {
      return new GenericRouter();
  }
  function go(path_index, options) {
      var path_index_type = typeof path_index;
      if (path_index_type !== "string" && path_index_type !== "number") {
          throw new Error("router.go should receive an url string or a number");
      }
      options = __assign({}, options);
      return new Promise(function (promiseResolve, promiseReject) {
          var goingEvent = new CustomEvent("router:going", {
              detail: __assign({ direction: path_index }, options),
              cancelable: true
          });
          window.dispatchEvent(goingEvent);
          if (goingEvent.defaultPrevented) {
              promiseReject();
              return;
          }
          if (path_index_type === "string") {
              _go(path_index, (options && options.replace) || false, (options == null || options.emit == null) ? true : options.emit).then(promiseResolve);
          }
          else {
              var lastEmitRoute_1 = emitRoute;
              emitRoute = options.emit == null ? true : options.emit;
              go$1(path_index).then(promiseResolve, function () {
                  emitRoute = lastEmitRoute_1;
              });
          }
      });
  }
  function setQueryParam(param, value, options) {
      var promiseResolve;
      var promise = new Promise(function (resolve) { promiseResolve = resolve; });
      onWorkFinished(function () {
          var location = getLocation();
          if (value === undefined) {
              location.removeQueryParam(param);
          }
          else {
              location.addQueryParam(param, value);
          }
          go(location.href, options).then(promiseResolve);
      });
      return promise;
  }
  function lock$1() {
      return lock$2();
  }
  function unlock(force) {
      if (force === void 0) { force = true; }
      return unlock$1(force);
  }
  function destroy() {
      throw new Error("cannot destroy main Router");
  }
  function getBase() {
      return base();
  }
  function setBase(newBase) {
      base(newBase.replace(/[\/]+$/, ""));
      _emit();
  }
  function isLocked() {
      return locked$1();
  }

  var Router = /*#__PURE__*/Object.freeze({
      __proto__: null,
      getLocation: getLocation,
      redirect: redirect,
      unredirect: unredirect,
      route: route,
      unroute: unroute,
      start: start,
      index: index,
      getLocationAt: getLocationAt,
      addContextPath: addContextPath,
      setContextDefaultHref: setContextDefaultHref,
      setContext: setContext,
      getContext: getContext,
      restoreContext: restoreContext,
      getContextDefaultOf: getContextDefaultOf,
      emit: emit,
      create: create,
      go: go,
      setQueryParam: setQueryParam,
      lock: lock$1,
      unlock: unlock,
      destroy: destroy,
      getBase: getBase,
      setBase: setBase,
      isLocked: isLocked,
      NavigationLock: NavigationLock
  });

  var ROUTER = Symbol("router");
  var IS_ROUTER = Symbol("is-router");
  var UNROUTE_METHOD = Symbol("unroute");
  var LAST_ROUTED = Symbol("last-routed");
  var ROUTE_PLACEHOLDER = Symbol("route-placeholder");

  var RouterComponent = {
    'css': null,

    'exports': {
      getSelfSlotProp() {
          return { [ROUTER]: this };
      },

      onBeforeMount() {
          this.root[IS_ROUTER] = true;
          this[UNROUTE_METHOD] = () => {};
          this[ROUTER] = Router.create();
      },

      onMounted() {
          this[ROUTER].route("(.*)", () => {
              claim(this); release(this);
              this[LAST_ROUTED] = null;
              this[UNROUTE_METHOD]();
              this[UNROUTE_METHOD] = () => {};
          });
      },

      onUnmounted() {
          delete this.root[IS_ROUTER];
      },

      [LAST_ROUTED]: null
    },

    'template': function(
      template,
      expressionTypes,
      bindingTypes,
      getComponent
    ) {
      return template(
        '<slot expr22="expr22"></slot>',
        [
          {
            'type': bindingTypes.SLOT,

            'attributes': [
              {
                'type': expressionTypes.ATTRIBUTE,
                'name': null,

                'evaluate': function(
                  scope
                ) {
                  return scope.getSelfSlotProp();
                }
              }
            ],

            'name': 'default',
            'redundantAttribute': 'expr22',
            'selector': '[expr22]'
          }
        ]
      );
    },

    'name': 'router'
  };

  var ONBEFOREROUTE = Symbol("onbeforeroute");
  var ONUNROUTE = Symbol("onunroute");
  var ONROUTE = Symbol("onroute");
  var HTMLElementAddEventListener = HTMLElement.prototype.addEventListener;
  HTMLElement.prototype.addEventListener = function (type, listener, options) {
      if (options === void 0) { options = false; }
      switch (type) {
          case "beforeroute": {
              var onbeforeroute = this[ONBEFOREROUTE] = this[ONBEFOREROUTE] || [];
              var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
              onbeforeroute.push({ listener: listener, useCapture: useCapture });
              break;
          }
          case "unroute": {
              var onunroute = this[ONUNROUTE] = this[ONUNROUTE] || [];
              var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
              onunroute.push({ listener: listener, useCapture: useCapture });
              break;
          }
          case "route": {
              var onroute = this[ONROUTE] = this[ONROUTE] || [];
              var useCapture = typeof options === "boolean" ? options : options ? options.capture != null : false;
              onroute.push({ listener: listener, useCapture: useCapture });
              break;
          }
          default: {
              return HTMLElementAddEventListener.call(this, type, listener, options);
          }
      }
  };
  var HTMLElementRemoveEventListener = HTMLElement.prototype.removeEventListener;
  HTMLElement.prototype.removeEventListener = function (type, listener, options) {
      switch (type) {
          case "beforeroute": {
              var onbeforeroute = this[ONBEFOREROUTE];
              if (!onbeforeroute) {
                  return;
              }
              var useCapture_1 = typeof options === "boolean" ? options : options ? options.capture != null : false;
              var index_1 = -1;
              if (!onbeforeroute.some(function (l, i) {
                  if (l.listener === listener && l.useCapture === useCapture_1) {
                      index_1 = i;
                      return true;
                  }
                  return false;
              })) {
                  return;
              }
              onbeforeroute.slice(index_1, 1);
              break;
          }
          case "unroute": {
              var onunroute = this[ONUNROUTE];
              if (!onunroute) {
                  return;
              }
              var useCapture_2 = typeof options === "boolean" ? options : options ? options.capture != null : false;
              var index_2 = -1;
              if (!onunroute.some(function (l, i) {
                  if (l.listener === listener && l.useCapture === useCapture_2) {
                      index_2 = i;
                      return true;
                  }
                  return false;
              })) {
                  return;
              }
              onunroute.slice(index_2, 1);
              break;
          }
          case "route": {
              var onroute = this[ONROUTE];
              if (!onroute) {
                  return;
              }
              var useCapture_3 = typeof options === "boolean" ? options : options ? options.capture != null : false;
              var index_3 = -1;
              if (!onroute.some(function (l, i) {
                  if (l.listener === listener && l.useCapture === useCapture_3) {
                      index_3 = i;
                      return true;
                  }
                  return false;
              })) {
                  return;
              }
              onroute.slice(index_3, 1);
              break;
          }
          default: {
              return HTMLElementRemoveEventListener.call(this, type, listener, options);
          }
      }
  };
  function getRouter(element) {
      var tag = parent[__.globals.DOM_COMPONENT_INSTANCE_PROPERTY];
      if (tag && tag.name === "router") {
          return tag;
      }
      return null;
  }
  function dispatchEventOver(children, event, collectLoaders, collectRouter) {
      var stop = false;
      var immediateStop = false;
      event.stopImmediatePropagation = function () {
          stop = true;
          immediateStop = true;
      };
      event.stopPropagation = function () {
          stop = true;
      };
      function propagateEvent(child) {
          var routerTag = getRouter();
          if (routerTag) {
              if (collectRouter != null) {
                  collectRouter.push(routerTag);
              }
              return false;
          }
          var listeners;
          switch (event.type) {
              case "beforeroute": {
                  listeners = child[ONBEFOREROUTE];
                  break;
              }
              case "unroute": {
                  listeners = child[ONUNROUTE];
                  break;
              }
              case "route": {
                  listeners = child[ONROUTE];
                  break;
              }
              default: return true;
          }
          var isLoader = collectLoaders != null && child.matches("[need-loading]:not([need-loading='false'])");
          if (isLoader) {
              child.addEventListener("load", function load() {
                  child.removeEventListener("load", load);
                  isLoader = false;
              });
          }
          if (listeners) {
              listeners.some(function (listener) {
                  if (listener.useCapture) {
                      listener.listener.call(child, event);
                      return immediateStop;
                  }
              });
          }
          if (!stop) {
              if (!Array.prototype.some.call(child.children, propagateEvent) && listeners) {
                  listeners.some(function (listener) {
                      if (!listener.useCapture) {
                          listener.listener.call(child, event);
                          return immediateStop;
                      }
                  });
              }
          }
          if (isLoader) {
              collectLoaders.push(child);
          }
          return stop;
      }
      Array.prototype.some.call(children, propagateEvent);
      delete event.stopImmediatePropagation;
      delete event.stopPropagation;
  }

  function onunroute(routeComponent, currentMount, route, router, shouldFireEvent, shouldResetUnroute) {
      const currentEl = currentMount.el;
      {
          if (shouldFireEvent) {
              const unrouteEvent = new CustomEvent("unroute", { cancelable: false, detail: { ...route } });
              dispatchEventOver(routeComponent.root.children, unrouteEvent, null, []);
          }
          const scope = Object.create(routeComponent[__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } });
          currentMount.unmount( scope, routeComponent[__.globals.PARENT_KEY_SYMBOL] );
      }
      {
          const placeholder = routeComponent[ROUTE_PLACEHOLDER];
          placeholder.parentElement.removeChild(currentEl);
          // if want to keep some route for faster loading, just `display: none` the element
          // currentEl.style.display = "none";
      }
      if (shouldResetUnroute) {
          router[UNROUTE_METHOD] = () => {};
      }
  }

  function onloadingcomplete(routeComponent, currentMount, route, router, claimer) {
      if (router[LAST_ROUTED] !== routeComponent) {
          onunroute(routeComponent, currentMount, route, router, false, false);
          return;
      }
      const currentEl = currentMount.el;
      if (claimed(claimer)) {
          release(claimer);
      }
      const routerUNROUTE = router[UNROUTE_METHOD];
      let reachedRouterLoad = false;
      const thisUNROUTE = () => {
          onunroute(routeComponent, currentMount, route, router, reachedRouterLoad, reachedRouterLoad);
      };
      router[UNROUTE_METHOD] = () => {
          window.removeEventListener("routerload", onrouterload, true);
          routerUNROUTE();
          thisUNROUTE();
      };

      window.addEventListener("routerload", onrouterload, true);

      function onrouterload() {
          window.removeEventListener("routerload", onrouterload, true);
          reachedRouterLoad = true;
          routerUNROUTE();
          router[UNROUTE_METHOD] = thisUNROUTE;
          currentEl.style.display = "block";
          {
              const routeEvent = new CustomEvent("route", { cancelable: false, detail: { ...route } });
              dispatchEventOver(currentEl.children, routeEvent, null, []);
          }
      }
  }

  function onroute(routeComponent) { return (function (location, keymap, redirection) {
      const route = { location, keymap, redirection };

      const claimer = Object.create(null);
      claim(claimer);

      const router = this[ROUTER];
      router[LAST_ROUTED] = this;

      const slot = this.slots[0];
      const currentEl = document.createElement("div");
      const placeholder = this[ROUTE_PLACEHOLDER];
      placeholder.parentElement.insertBefore(currentEl, placeholder);
      const currentMount = __.DOMBindings.template(slot.html, slot.bindings).mount(
          currentEl,
          Object.create(this[__.globals.PARENT_KEY_SYMBOL], { route: { value: { ...route } } }),
          this[__.globals.PARENT_KEY_SYMBOL]
      );
      currentEl.style.display = "none";
      
      const needLoading = [];
      const routerChildren = [];
      {
          const beforeRouteEvent = new CustomEvent("beforeroute", { cancelable: false, detail: { ...route } });
          dispatchEventOver(currentEl.children, beforeRouteEvent, needLoading, routerChildren);
      }
      if (needLoading.length > 0) {
          let loaded = 0;
          const onrequestvisibility = () => {
              currentEl.style.display = "block";
          };
          needLoading.forEach(el => {
              loaded++;
              const onload = el => {
                  const fn = () => {
                      currentEl.style.display = "none";
                      el.removeEventListener("requestvisibility", onrequestvisibility);
                      el.removeEventListener("load", fn);
                      Array.prototype.forEach.call(
                          currentEl.querySelectorAll("[need-loading]:not([need-loading='false'])"),
                          el => {
                              if (needLoading.some(other => other === el)) { return; }
                              needLoading.push(el);
                              loaded++;
                              el.addEventListener("load", onload(el));
                              el.addEventListener("requestvisibility", onrequestvisibility);
                          }
                      );
                      if (--loaded <= 0) {
                          onloadingcomplete(routeComponent, currentMount, route, router, claimer);
                      }
                  };
                  return fn;
              };
              el.addEventListener("requestvisibility", onrequestvisibility);
              el.addEventListener("load", onload(el));
          });
      } else {
          onloadingcomplete(routeComponent, currentMount, route, router, claimer);
      }
  }).bind(routeComponent); }

  var RouteComponent = {
    'css': null,

    'exports': {
      _valid: false,
      _onroute: null,
      _path: null,

      onMounted() {
          const placeholder = this[ROUTE_PLACEHOLDER] = document.createComment("");
          this.root.replaceWith(placeholder);
          const router = this[__.globals.PARENT_KEY_SYMBOL][ROUTER];
          if (router == null) {
              return;
          }
          this._valid = true;
          this[ROUTER] = router;
          
          if (this.props.redirect) {
              router[ROUTER].redirect(this.props.path, this.props.redirect);
          } else {
              router[ROUTER].route(this._path = this.props.path, this._onroute = onroute(this));
          }
      },

      onUnmounted() {
          if (this._onroute == null) {
              return;
          }
          this[__.globlas.PARENT_KEY_SYMBOL].router[ROUTER].unroute(this._path, this._onroute);
      }
    },

    'template': null,
    'name': 'route'
  };

  var NavigateComponent = {
    'css': `navigate a[ref=-navigate-a],[is="navigate"] a[ref=-navigate-a]{ color: inherit; text-decoration: none; outline: none; }`,

    'exports': {
      onMounted() {
          this.root.style.cursor = "pointer";
          if (this.root.style.display === "") {
              this.root.style.display = "inline";
          }

          this.root.setAttribute("route-listener", "true");
          this.root.addEventListener("route", () => {
              this.update();
          });
          
          this.root.firstElementChild.addEventListener("click", event => {
              event.preventDefault();
              let href = this.href(false);
              if (href != null) {
                  Router.go(href, { replace: this.replace() });
              } else {
                  let context = this.context();
                  if (context) {
                      Router.restoreContext(context);
                  }
              }
              return false;
          });
      },

      onBeforeUpdate() {
          this._href = null;
      },

      replace() {
          if (typeof this.props.replace !== "boolean") {
              return (this.props.replace != null && this.props.replace !== "false") || this.props.replace === "";
          }
          return this.props.replace;
      },

      href(toA = true) {
          if (typeof this.props.href !== "string") {
              if (toA) {
                  const context = this.context();
                  return context != null ? Router.getContextDefaultOf(context) : null;
              }
              return null;
          }
          if (this._href == null) {
              this._href = Router.getLocation().hrefIf(this.props.href);
              // console.log("got href", this._href, "from", this.props.href, "and", Router.location.href, this.root);
          }
          return this._href; // (toA ? Router.base : "") + this._href;
      },

      context() {
          if (typeof this.props.context !== "string") {
              return null;
          }
          return this.props.context;
      }
    },

    'template': function(
      template,
      expressionTypes,
      bindingTypes,
      getComponent
    ) {
      return template(
        '<a expr20="expr20" ref="-navigate-a"><slot expr21="expr21"></slot></a>',
        [
          {
            'redundantAttribute': 'expr20',
            'selector': '[expr20]',

            'expressions': [
              {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'href',

                'evaluate': function(
                  scope
                ) {
                  return "#" + scope.href();
                }
              },
              {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'style',

                'evaluate': function(
                  scope
                ) {
                  return [
                    'display: ',
                    scope.root.style.display,
                    '; width: 100%; height: 100%;'
                  ].join(
                    ''
                  );
                }
              }
            ]
          },
          {
            'type': bindingTypes.SLOT,
            'attributes': [],
            'name': 'default',
            'redundantAttribute': 'expr21',
            'selector': '[expr21]'
          }
        ]
      );
    },

    'name': 'navigate'
  };

  register("router", RouterComponent);
  register("route", RouteComponent);
  register("navigate", NavigateComponent);

  // this object will contain all the components implementations lazy loaded
  const cache = new WeakMap();

  // expose the cache as static property
  lazy.cache = cache;

  // static attribute in case we want to just export a lazy riot component
  lazy.export = function lazyExport(Loader, Component) {
    // it could be that the user don't want to use a loader for whatever reason
    const hasLoader = Loader && Component;
    const LazyComponent = hasLoader ? Component : Loader;
    const load = () => typeof LazyComponent === 'function' ? LazyComponent() : Promise.resolve(LazyComponent);
    const cachedComponent = cache.get(LazyComponent);

    return pure(({ slots, attributes, props }) => ({
      mount(el, parentScope) {
        this.el = el;
        this.isMounted = true;
        const mount = () => {
          this.mountLazyComponent(parentScope);
          this.el.dispatchEvent(new Event('load'));
        };

        if (cachedComponent) {
          mount();
        } else {
          if (hasLoader) this.createManagedComponent(Loader, parentScope);

          load().then(data => {
            cache.set(LazyComponent, data.default || data);
            mount();
          });
        }
      },
      createManagedComponent(Child, parentScope) {
        this.component = component(Child)(this.el, props, {
          attributes, slots, parentScope
        });
      },
      mountLazyComponent(parentScope) {
        // if this component was unmounted just return here
        if (!this.isMounted) return

        // unmount the loader if it was previously created
        // notice the true flat to keep the root node
        if (this.component) this.component.unmount(true);

        // replace the old component instance with the new lazy loaded component
        this.createManagedComponent(cache.get(LazyComponent), parentScope);
      },
      update(parentScope) {
        if (this.isMounted && this.component) this.component.update({}, parentScope);
      },
      unmount(...args) {
        this.isMounted = false;

        if (this.component) this.component.unmount(...args);
      }
    }))
  };

  function lazy(Loader, Component) {
    return {
      name: 'lazy',
      exports: lazy.export(Loader, Component)
    }
  }

  window.Router = Router;
  window.HistoryManager = HistoryManager;

  Router.setContext({
      name: "home",
      paths: [
          { path: "home" },
          { path: "me" },
          { path: "accedi", fallback: true },
          { path: "users/:id", fallback: true }
      ],
      default: "home"
  });

  var TestComponent = {
    'css': null,

    'exports': {
      _lastContext: null,
      _lastPath: null,

      onMounted() {
          Router.create().route("(.*)", (location) => {
              let context = Router.getContext();
              this._lastContext = context;
              this._lastPath = location.pathname;
              this.update({ context, path: this._lastPath });
          });
          Router.start("home").then(() => console.log("started"));
      },

      components: {
          homepage: lazy(() => new Promise(function (resolve, reject) { require(['./homepage-8e84a6a6'], resolve, reject) })),
          "replace-test": lazy(() => new Promise(function (resolve, reject) { require(['./replace-test-38c84d9b'], resolve, reject) }))
      }
    },

    'template': function(
      template,
      expressionTypes,
      bindingTypes,
      getComponent
    ) {
      return template(
        '<div style="height: 64px; background: #000; color: #fff; font-size: 24px; padding: 8px 16px; box-sizing: border-box;"><div style="display: inline-block; width: 1px; margin-right: -1px; height: 100%; vertical-align: middle;"></div><navigate expr6="expr6" href="home"></navigate>&nbsp;\r\n        <navigate expr8="expr8" href="me"></navigate></div><template expr10="expr10" is="router"></template>',
        [
          {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(
              scope
            ) {
              return 'navigate';
            },

            'slots': [
              {
                'id': 'default',
                'html': '<span expr7="expr7">Home</span>',

                'bindings': [
                  {
                    'redundantAttribute': 'expr7',
                    'selector': '[expr7]',

                    'expressions': [
                      {
                        'type': expressionTypes.ATTRIBUTE,
                        'name': 'style',

                        'evaluate': function(
                          scope
                        ) {
                          return scope.state.path === "home" || scope.state.path === "" ? "text-decoration: underline;": "";
                        }
                      }
                    ]
                  }
                ]
              }
            ],

            'attributes': [],
            'redundantAttribute': 'expr6',
            'selector': '[expr6]'
          },
          {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(
              scope
            ) {
              return 'navigate';
            },

            'slots': [
              {
                'id': 'default',
                'html': '<span expr9="expr9">Profile</span>',

                'bindings': [
                  {
                    'redundantAttribute': 'expr9',
                    'selector': '[expr9]',

                    'expressions': [
                      {
                        'type': expressionTypes.ATTRIBUTE,
                        'name': 'style',

                        'evaluate': function(
                          scope
                        ) {
                          return scope.state.path === "me" ? "text-decoration: underline;": "";
                        }
                      }
                    ]
                  }
                ]
              }
            ],

            'attributes': [],
            'redundantAttribute': 'expr8',
            'selector': '[expr8]'
          },
          {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(
              scope
            ) {
              return 'router';
            },

            'slots': [
              {
                'id': 'default',
                'html': '<route expr11="expr11" path redirect="home"></route><route expr12="expr12" path="home"></route><route expr14="expr14" path="me"></route><route expr19="expr19" path="users/:id"></route>',

                'bindings': [
                  {
                    'type': bindingTypes.TAG,
                    'getComponent': getComponent,

                    'evaluate': function(
                      scope
                    ) {
                      return 'route';
                    },

                    'slots': [],
                    'attributes': [],
                    'redundantAttribute': 'expr11',
                    'selector': '[expr11]'
                  },
                  {
                    'type': bindingTypes.TAG,
                    'getComponent': getComponent,

                    'evaluate': function(
                      scope
                    ) {
                      return 'route';
                    },

                    'slots': [
                      {
                        'id': 'default',
                        'html': '<homepage expr13="expr13" need-loading></homepage>',

                        'bindings': [
                          {
                            'type': bindingTypes.TAG,
                            'getComponent': getComponent,

                            'evaluate': function(
                              scope
                            ) {
                              return 'homepage';
                            },

                            'slots': [],
                            'attributes': [],
                            'redundantAttribute': 'expr13',
                            'selector': '[expr13]'
                          }
                        ]
                      }
                    ],

                    'attributes': [],
                    'redundantAttribute': 'expr12',
                    'selector': '[expr12]'
                  },
                  {
                    'type': bindingTypes.TAG,
                    'getComponent': getComponent,

                    'evaluate': function(
                      scope
                    ) {
                      return 'route';
                    },

                    'slots': [
                      {
                        'id': 'default',
                        'html': '<replace-test expr15="expr15" need-loading></replace-test><div>Friends:</div><div style="padding-left: 1em;"><navigate expr16="expr16" href="users/2"></navigate><br/><navigate expr17="expr17" href="users/3"></navigate><br/><navigate expr18="expr18" href="users/4"></navigate></div>',

                        'bindings': [
                          {
                            'type': bindingTypes.TAG,
                            'getComponent': getComponent,

                            'evaluate': function(
                              scope
                            ) {
                              return 'replace-test';
                            },

                            'slots': [],
                            'attributes': [],
                            'redundantAttribute': 'expr15',
                            'selector': '[expr15]'
                          },
                          {
                            'type': bindingTypes.TAG,
                            'getComponent': getComponent,

                            'evaluate': function(
                              scope
                            ) {
                              return 'navigate';
                            },

                            'slots': [
                              {
                                'id': 'default',
                                'html': 'Tizio',
                                'bindings': []
                              }
                            ],

                            'attributes': [],
                            'redundantAttribute': 'expr16',
                            'selector': '[expr16]'
                          },
                          {
                            'type': bindingTypes.TAG,
                            'getComponent': getComponent,

                            'evaluate': function(
                              scope
                            ) {
                              return 'navigate';
                            },

                            'slots': [
                              {
                                'id': 'default',
                                'html': 'Caio',
                                'bindings': []
                              }
                            ],

                            'attributes': [],
                            'redundantAttribute': 'expr17',
                            'selector': '[expr17]'
                          },
                          {
                            'type': bindingTypes.TAG,
                            'getComponent': getComponent,

                            'evaluate': function(
                              scope
                            ) {
                              return 'navigate';
                            },

                            'slots': [
                              {
                                'id': 'default',
                                'html': 'Sempronio',
                                'bindings': []
                              }
                            ],

                            'attributes': [],
                            'redundantAttribute': 'expr18',
                            'selector': '[expr18]'
                          }
                        ]
                      }
                    ],

                    'attributes': [],
                    'redundantAttribute': 'expr14',
                    'selector': '[expr14]'
                  },
                  {
                    'type': bindingTypes.TAG,
                    'getComponent': getComponent,

                    'evaluate': function(
                      scope
                    ) {
                      return 'route';
                    },

                    'slots': [
                      {
                        'id': 'default',
                        'html': ' ',

                        'bindings': [
                          {
                            'expressions': [
                              {
                                'type': expressionTypes.TEXT,
                                'childNodeIndex': 0,

                                'evaluate': function(
                                  scope
                                ) {
                                  return scope.route.location.href;
                                }
                              }
                            ]
                          }
                        ]
                      }
                    ],

                    'attributes': [],
                    'redundantAttribute': 'expr19',
                    'selector': '[expr19]'
                  }
                ]
              }
            ],

            'attributes': [],
            'redundantAttribute': 'expr10',
            'selector': '[expr10]'
          }
        ]
      );
    },

    'name': 'test'
  };

  setColor("#fff");

  register("test", TestComponent);
  mount("test");

});
