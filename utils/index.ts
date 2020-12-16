import {
  createTestAssertor,
  ITest,
  ITestContext,
  ITestResult,
  ITestExecutorFunction,
} from "../types";

export function getTestResults(ids: string[]) {
  const results: ITestResult[] = [];
  const promises = ids.map((id) => {
    return new Promise(function (resolve, reject) {
      const testResult = {
        id,
        resolve,
        reject,
        logs: [],
      };
      results.push(testResult);
    });
  });
  return results;
}
export async function runTests(tester: ITest) {
  console.log("tester", tester);
  const testCases = Object.keys(tester.context.testExecutors).reduce<
    { id: string; executor: ITestExecutorFunction }[]
  >((state, testId) => {
    const testExecutor = tester.context.testExecutors[testId];
    if (testExecutor) {
      state.push({
        id: testId,
        executor: testExecutor,
      });
    }
    return state;
  }, []);
  console.log(testCases);
  const testResults = getTestResults(testCases.map((el) => el.id));
  for await (const testCase of testCases) {
    const assertor = createTestAssertor(tester, testCase.id, testResults);
    const executor = testCase.executor;
    const value = executor(assertor);
    try {
      await Promise.resolve(value);
    } catch (e) {
      console.log(e);
      break;
    }
    console.log("done", testResults);
  }
}
