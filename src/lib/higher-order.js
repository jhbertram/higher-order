/**
 * Simple higher-order chainable operations on iterables. The idea is to
 * provide Array.prototype.* methods such as `reduce`, `map`, and `filter` for
 * iterable objects. Think of C#.NET's IEnumberable interface.
 */
class Higher {
	constructor(iterable) {
		if (!iterable[Symbol.iterator]) {
			throw new TypeError("Higher must be constructed from an iterable");
		}
		this.iterable = iterable;
	}

	first() {
		return this[Symbol.iterator]().next().value;
	}

	reduce (reducer, initialValue) {
		let idx = 0;
		let iter = this[Symbol.iterator]();
		let finalVal;
		let prev;
		if (initialValue === undefined) {
			prev = iter.next();
			idx++;
			if (!prev || prev.done) return prev.value;
			else prev = prev.value;
		}
		else {
			// Given an initial value
			prev = initialValue;
		}
		for (let nex of iter) {
			prev = reducer(prev, nex, idx++);
		}
		finalVal = prev;
		return finalVal;
	}

	count(predicate) {
		let c = 0;
		if (predicate) {
			for (let x of this) {
				if (predicate(x)) c++;
			}
		}
		else {
			c = [...this].length;
		}

		return c;
	}

	*[Symbol.iterator]() {
		for (let x of this.iterable) {
			yield x;
		}
	}


	/* The following methods simply return new iterables */
	take (n) {
		return (new HigherTake(this, n));
	}

	skip (n) {
		return (new HigherSkip(this, n));
	}

	filter (predicate) {
		return (new HigherFilter(this, predicate));
	}

	map (mapper) {
		return (new HigherMap(this, mapper));
	}
}

class HigherFilter extends Higher {
	constructor(iterable, predicate) {
		super(iterable);
		this.predicate = predicate;
	}
	* [Symbol.iterator]() {
		let it = this.iterable[Symbol.iterator]();
		let n = it.next();
		while (!n.done) {
			if (this.predicate(n.value))
				yield n.value;
			n = it.next();
		}
		return;
	}
}

class HigherTake extends Higher {
	constructor(iterable, limit) {
		super(iterable);
		this.limit = limit;
	}
	* [Symbol.iterator]() {
		let it = this.iterable[Symbol.iterator]();
		let n = it.next();
		let i = 0;
		while (!n.done && i < this.limit) {
			yield n.value;
			n = it.next();
			i++;
		}
		return;
	}
}

class HigherSkip extends Higher {
	constructor(iterable, offset) {
		super(iterable);
		this.offset = offset;
	}
	* [Symbol.iterator]() {
		let it = this.iterable[Symbol.iterator]();
		let n = it.next();
		let i = 0;
		while (!n.done && i < this.offset) {
			n = it.next();
			i++;
		}
		while (!n.done) {
			yield n.value;
			n = it.next();
		}
		return;
	}
}

class HigherMap extends Higher {
	constructor(iterable, mapper) {
		super(iterable);
		this.mapper = mapper;
	}
	* [Symbol.iterator]() {
		let it = this.iterable[Symbol.iterator]();
		let n = it.next();
		while (!n.done) {
			yield this.mapper(n.value);
			n = it.next();
		}
		return;
	}
}

let high = function (iterable) {
	return new HigherOrder.Higher(iterable);
};

var HigherOrder = {
	Higher,
	high
};

export default HigherOrder;
