# Event registry

DOM element events registry.

## Install

```sh
yarn add @arturdoruch/event-registry
```

## Usage

```js
import eventRegistry from '@arturdoruch/event-registry';

// Register event listener to the DOM element.
const eventId = eventRegistry.on('click', 'h1', consoleListener, ['firstArgument', 'secondArgument']);

function consoleListener(e, firstArgument, secondArgument) {
    console.log(firstArgument);
    console.log(secondArgument);
}

// Trigger event manually.
eventRegistry.trigger(eventId);

// Remove event listener.
eventRegistry.off(eventId);

// Register event listener to the DOM element, which will be called only once.
eventRegistry.one();
```