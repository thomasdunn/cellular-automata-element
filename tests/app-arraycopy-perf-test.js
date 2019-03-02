import {Perf} from '../perf.js';

const perf = new Perf();

const runs = 60 * 60; // 1 minute of 60fps
const length = 1000 * 1000; // 1000x1000 grid

function test1() {
    const uint8Array1 = new Uint8Array(length);
    const uint8Array2 = new Uint8Array(length);

    init(uint8Array1);

    perf.reset();
    uint8Array2.set(uint8Array1);
    return perf.elapsed;
}

function test2() {
    const buffer1 = new ArrayBuffer(length);
    const buffer2 = new ArrayBuffer(length);
    const uint8Array1 = new Uint8Array(buffer1);
    const uint8Array2 = new Uint8Array(buffer2);

    init(uint8Array1);

    perf.reset();
    uint8Array2.set(uint8Array1);
    return perf.elapsed;
}

function test3() {
    const buffer = new ArrayBuffer(length * 2);
    const uint8Array1 = new Uint8Array(buffer, 0, length);
    const uint8Array2 = new Uint8Array(buffer, length, length);

    init(uint8Array1);

    perf.reset();
    uint8Array2.set(uint8Array1);
    return perf.elapsed;
}

const test1Results = [];
const test2Results = [];
const test3Results = [];

for(let i = 0; i < runs; i++) {
    test1Results.push(test1());
}

for(let i = 0; i < runs; i++) {
    test2Results.push(test2());
}

for(let i = 0; i < runs; i++) {
    test3Results.push(test3());
}

const sum = (accum, current) => accum + current;
console.log('1: avg per run: ' + (test1Results.reduce(sum, 0) / runs));
console.log('2: avg per run: ' + (test2Results.reduce(sum, 0) / runs));
console.log('3: avg per run: ' + (test3Results.reduce(sum, 0) / runs));

function init(arr) {
    initConsecutive(arr);
}

function initRandom(arr) {
    for (let i = 0; i < length; i++) {
        arr[i] = Math.floor(Math.random() * 255);
    }
}

function initConsecutive(arr) {
    for (let i = 0; i < length; i++) {
        arr[i] = i;
    }
}
