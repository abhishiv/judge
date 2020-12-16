import { creatTest } from "../types";
import { runTests } from "../utils/index";
describe("Test Runner", () => {
  // todo make it work with
  beforeAll(async () => {});
  test("work with sync", async () => {
    const tester = creatTest();

    tester.ensure("foo", (t) => {
      t.pass();
    });

    tester.ensure("foo2", (t) => {
      t.pass();
    });

    tester.ensure("bar", async (t) => {
      const bar = "bar";
      t.is(bar, "bar");
    });
    await runTests(tester);
    console.log(tester.context);
  }, 5000);
});
