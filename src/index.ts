/* eslint  no-var: "error" */

// @gratico/judge
// =====
// Pluggable test runner.

// Install and use
// ---------------
// To use run `npm install -g @gratico/judge`
//
//     import {createTest} from "@gratico/judge"
//     const test = createTest()
//     test('foo', t => {
//       t.pass();
//     });
//
//     test('bar', async t => {
//       const bar = Promise.resolve('bar');
//       t.is(await bar, 'bar');
//     });
//

export * from "./types";
export * from "./runners/index";
export * from "./utils/index";
