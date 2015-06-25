/*jshint expr: true*/
/*global describe, it, before, beforeEach, after, afterEach */
import {expect} from 'chai';
import higher from '../lib/higher-order';

describe('Higher Order iterables', function() {
	describe('Higher supertype', function () {

		// Constructor
		it('should construct from an iterable (array)', function () {
			var arr = [];
			var h;
			expect( () => h = new higher.Higher(arr) ).not.to.throw();
			expect(h.iterable).to.equal(arr);
		});
		it('should construct from an iterable (string)', function () {
			var arr = [];
			var h;
			expect( () => h = new higher.Higher('asdf') ).not.to.throw();
		});
		it('should construct from an iterable (object w/ [Symbol.iterator])', function () {
			var arr = [];
			var h;
			expect( () => h = new higher.Higher({[Symbol.iterator]: ()=>false }) ).not.to.throw();
		});
		it('should throw when not constructed from an iterable', function () {
			var arr = [];
			var h;
			expect( () => h = new higher.Higher({}) ).to.throw();
		});
		it('should have a factory method high()', function () {
			let ex = higher.high([1,2,3]);
			expect(ex instanceof higher.Higher).to.be.true;
		});

		// Ensure the base Higher acts as an iterable
		it('should act as an iterable, mimicing the underlying iterable', function () {
			let arr = [1 , 2, 3];
			let h = new higher.Higher(arr);
			let res = [...h];
			expect(res).not.to.equal(arr);
			expect(res).to.deep.equal(arr);
		});

		// Take
		describe('take()', function () {
			let numArr, strArr;
			let numHigher, strHigher;
			beforeEach(function () {
				numArr = [1, 2, 3, 7, 3, 1, 7, 100, 50, 2];
				strArr = ['foo', 'bar', 'baz', 'cruft', 'iojs'];

				numHigher = new higher.Higher(numArr);
				strHigher = new higher.Higher(strArr);
			});
			it('should take (return) the first 3 items when take(3) called', function() {
				let resArr = [...numHigher.take(3)];
				expect(resArr).to.have.length(3);
			});
		});

		// Skip
		describe('skip()', function () {
			it('should skip designated number of entries before emitting', function () {
				let arr = [1,2,3,4,5,6];
				expect([...higher.high(arr).skip(3).take(3)]).to.deep.equal([4,5,6]);
			});
			it('should skip nothing when 0 is given', function () {
				let arr = [1,2,3,4,5,6];
				expect([...higher.high(arr).skip(0).take(3)]).to.deep.equal([1,2,3]);
			});
		});

		// Filter
		describe('filter()', function () {
			let numArr, strArr;
			let numHigher, strHigher;
			beforeEach(function () {
				numArr = [1, 2, 3, 7, 3, 1, 7, 100, 50, 2];
				strArr = ['foo', 'bar', 'baz', 'cruft', 'iojs'];

				numHigher = new higher.Higher(numArr);
				strHigher = new higher.Higher(strArr);
			});
			it('should filter elements by the predicate expression given', function() {
				let predicate = x => x.length <= 3;
				let res = [...strHigher.filter(predicate)];
				expect(res).to.deep.equal(strArr.filter(predicate));
			});
			it('should terminate at the end of an iterator with if there are no results', function () {
				let predicate = x => x > 1000;
				let res = [...numHigher.filter(predicate)];
				expect(res).to.have.length(0);
			});
		});

		// Map
		describe('map()', function () {
			let str;
			beforeEach(function () {
				str = "abcdefghijklmnop";
			});

			it('should perform the mapping function on every iteration', function () {
				var mapper = (t) => t.toUpperCase(str);
				expect(mapper('x')).to.equal('X');
				expect([...higher.high(str).map(mapper)]).to.deep.equal([...str.toUpperCase()]);
			});
		});

		// Chaining
		describe('Chaining', function () {
			it('should allow chaining of filter() and map()', function () {
				let arr = [1, 2, 3, 5, 4, 6, 7, 0, 1, 4];
				var p = x => x % 2 === 0;
				var m = x => x*-1;
				expect([...higher.high(arr).filter(p).map(m)]).to.deep.equal(arr.filter(p).map(m));
			});
			
			it ('should allow chaining filters', function () {
				let arr = [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1];
				let h = higher.high(arr).filter(x => x > 7).filter(x => x < 7);
				expect([...h]).to.deep.equal(arr.filter(x => x > 7).filter(x => x < 7));
			});
		});

		// Count
		describe('count()', function () {
			let str;
			beforeEach(function () {
				str = "hello, world";
			});
			it('should count the number of elements in the iterator', function () {
				let h = higher.high(str);
				expect(h.count()).to.equal(12);
			});
			it('should count the number of elements in the iterator matching the predicate', function () {
				let h = higher.high(str);
				expect(h.count(x => x === 'l' || x === 'o' )).to.equal(5);
			});
		});

		// Reduce
		// As per docs on http://mdn.io/Array.prototype.reduce:
		// The first time the callback is called, previousValue and
		// currentValue can be one of two values. If initialValue is provided in the call
		// to reduce, then previousValue will be equal to initialValue and currentValue
		// will be equal to the first value in the array. If no initialValue was provided,
		// then previousValue will be equal to the first value in the array and
		// currentValue will be equal to the second.
		describe('reduce()', () => {
			it('should provide the reduce callback with expected values every call when an initial value is NOT specified', () => {
				let currentIteration = 0;
				let arr = ['cat', 'dog', 'foo', 'bar'];
				let reducer = (prev, cur, idx) => {
					expect(prev).to.equal(arr[currentIteration]);
					expect(cur).to.equal(arr[currentIteration+1]);
					expect(idx).to.equal(currentIteration+1);
					currentIteration++;
					return cur;
				};
				let h = higher.high(arr);
				h.reduce(reducer);
				//currentIteration = 0;
				//let r = arr.reduce(reducer);
			});
			it('should provide the reduce callback with expected values every call when an initial value IS specified', () => {
				// Start at 1 because without supplying an initialValue, the
				// 'prev' gets set to the first iteration's value.
				let currentIteration = 0;
				let arr = ['cat', 'dog', 'foo', 'bar'];
				let reducer = (prev, cur, idx) => {
					if (idx === 0) {
						expect(prev).to.equal('baz');
					}
					else {
						expect(prev).to.equal(arr[currentIteration-1]);
					}
					expect(cur).to.equal(arr[currentIteration]);
					expect(idx).to.equal(currentIteration);
					currentIteration++;
					return cur;
				};
				//let h = higher.high(arr);
				//h.reduce(reducer);
				currentIteration = 0;
				let r = arr.reduce(reducer, 'baz');
			});
			it('should perform a simple summation', () => {
				let arr = [5, 10, 7, 2, 3]; // sum: 27
				let reducer = (prev, cur, idx) => {
					return prev + cur;
				};
				let h = higher.high(arr);
				let sum = h.reduce(reducer);
				//let sum = arr.reduce(reducer);
				expect(sum).to.equal(27);
			});
		});
	});
});
