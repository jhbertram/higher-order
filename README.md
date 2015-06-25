Higher-Order Iterables
=======================

A project written in javascript, making use of ECMAScript 6 iterables. So far
it has proven to be a great learning experience for the new features in es6.

Goal
-----

To provide [Array.prototype][array] methods for [ES6 Iterables][iterables],
such as `map`, `reduce`, and `filter`.

Another goal is to provide additional methods for iterables inspired by things
like C#'s IEnumerable interface, so that common filtering, collecting, and
mapping operations can be performed on large or infinite data sources.

[array]: http://mdn.io/Array
[iterables]: http://mdn.io/Iterable

Usage
------

```javascript
	import higher from 'higher-order';

	let someVeryLargeArray = [0, 1, 500, 1, 99, 6, 105 /*, ... */ ];

	// Create an iterable with higher-order operations:
	let highIterable = higher.high(someVeryLargeArray);

	// fetch the first 100 numbers greater than 100 from this iterable
	let numbersHigherThan100 = highIterable.filter(x => x > 100).take(100);

	// output.
	console.log('Numbers higher than 100: ', ...numbersHigherThan100);
```

Want to test?

```bash
	npm test
```

Want to convert to es5?

```bash
	gulp
```

And see the `dist/` folder

Documentation
--------------

### higher.high( iterable ) ###

Returns an iterable object (of class `Higher`) which has methods documented
below.

- `iterable` is an iterable object; that is, an object which has a
  `[Symbol.iterator]` function defined.

### Higher.first() ###

Returns the first value in the iterator. Ends any chaining.

### Higher.reduce(reducer, initialValue) ###

Much like [Array.prototype.reduce](http://mdn.io/reduce). Ends any chaining.
Returns the computed value of `reducer` at its last invocation, when the
iterator is completed.

- `reducer(prev, cur, idx)` is a callback taking the following parameters, and
  is expected to return the value to use in subsequent iterations
	+ `prev` is the value previously returned by the last invocation of
	  `reducer`, or `initialValue` if supplied
	+ `cur` is the value currently being processed in the iterator
	+ `idx` is like the index value in Array.prototype.reduce, but since
	  iterators might not have a notion of index, it acts as a counter which
	  increments at every iteration.
- `initialValue` an optional value to use as the first argument to the first
  call of the reducer callback.

### Higher.count( predicate ) ###

If `predicate` is not supplied, returns the number of elements found in the
iterator.

If `predicate` is supplied as a function, then `count` will call the predicate
function for each element in the iterator, counting the number of times that
`predicate` returns a truthy value.

This method ends the chain by working until the iterator is done.

### Higher.take( n ) ###

Returns a higher iterable which will iterate at most `n` times, yielding the
element found at each iteration.

### Higher.skip( n ) ###

Returns a higher iterable which will iterate `n` times, discarding the yielded
values. When `n` iterations have occured, `skip` will begin yielding the
elements that come in subsequent iterations. Consider the use case of
pagination, combining `skip` with `take`.

### Higher.filter( predicate ) ###

Returns a higher iterable which yields all the values of the underlying
iterator for which the `predicate` returns a truthy value.

### Higher.map( mapper ) ###

Returns a higher iterable which yields the result of applying the given
`mapper` function on all elements encountered.




