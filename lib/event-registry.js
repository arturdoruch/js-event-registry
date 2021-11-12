/*
 * (c) Artur Doruch <arturdoruch@interia.pl>
 */

import $ from 'jquery';

let _events = {};
let registryMethod = 'on';

/**
 * @todo Remove using jQuery.
 */
export default {
    /**
     * Attaches listener for the one or more events to the HTML element or elements.
     *
     * @param {string} events The event name or names separated by a coma.
     * @param {jQuery|HTMLElement|string} element The jQuery object, HTMLElement object, or CSS selector.
     * @param {function} listener The event listener function. Listener is called with arguments:
     *                            [{object} event, arguments provided by "listenerArgs" argument]
     * @param {[]}       [listenerArgs = []]
     * @param {object}   [listenerContext = window]
     * @param {boolean}  [preventDefault = true]
     *
     * @return {int|null} The event id or null when the specified "element" does not exist.
     */
    on(events, element, listener, listenerArgs, listenerContext, preventDefault) {
        let event = prepareEvent(events, element, listener, listenerArgs, listenerContext, preventDefault);

        if (!event) {
            return null;
        }

        event.$element[registryMethod](event.names, event.listener);
        registryMethod = 'on';

        const id = Math.floor(Date.now() * Math.random() * 1000);
        _events[id] = event;

        return id;
    },

    /**
     * Attaches listener for one or more events to the HTML element or elements.
     * The listener is executed at most once per element per event type.
     *
     * @param {string} events The event or events name separated by a coma.
     * @param {jQuery|HTMLElement|string} element The jQuery object, HTMLElement object, or CSS selector.
     * @param {function} listener The event listener function. Listener is calling with arguments:
     *                            [{object} event, arguments provided by "listenerArgs" argument]
     * @param {[]}       [listenerArgs = []]
     * @param {object}   [listenerContext = window]
     * @param {boolean}  [preventDefault = true]
     *
     * @return {int|null} The event id.
     */
    one(events, element, listener, listenerArgs, listenerContext, preventDefault) {
        registryMethod = 'one';

        return this.on(events, element, listener, listenerArgs, listenerContext, preventDefault);
    },

    /**
     * Removes event listener for an event with id.
     *
     * @param {int} eventId The event id.
     */
    off(eventId) {
        let event = getEvent(eventId);

        if (event) {
            delete _events[eventId];
            event.$element.off(event.names, event.listener);
        }
    },

    /**
     * @param {int} eventId The event id.
     */
    trigger(eventId) {
        let event = getEvent(eventId);

        if (event) {
            event.$element.trigger(event.names);
        }
    },

    /**
     * Gets registered events.
     *
     * @returns {{}}
     */
    getEvents: function () {
        return _events;
    }
};

/**
 * Prepares event object.
 *
 * @return {_Event|null}
 */
function prepareEvent(events, element, listener, listenerArgs, listenerContext, preventDefault) {
    if (typeof listener !== 'function') {
        throw new TypeError(`Invalid type "${typeof listener}" of the "listener" argument. The function is required.`);
    }

    let $element = $(element);

    if ($element.length === 0) {
        return null;
    }

    let event = new _Event(events, $element, function (e) {
        if (preventDefault !== false) {
            e.preventDefault();
        }

        listener.apply(listenerContext || window, [e].concat(listenerArgs || []));
    });

    event.$element.off(event.names, event.listener);

    return event;
}

function getEvent(id) {
    return _events[id] || null;
}

/**
 * @param {string} names The event names.
 * @param {jQuery} $element
 * @param {function} listener
 */
function _Event(names, $element, listener) {
    this.names = names;
    this.$element = $element;
    this.listener = listener;
}
