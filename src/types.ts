import v4 from "shortid";
export interface ITestCreatorOptions {}
export interface ITestCreator {
  (opts: ITestCreatorOptions): ITest;
}

export interface ITestExecutorOptions {
  [key: string]: any;
}

export interface ITestExecutorAssertor {
  pass: () => void;
  fail: () => void;
  log: (...args: any) => void;
  is: (left: any, right: any) => boolean;
  truthy: (left: any, right: any) => boolean;
}
export interface ITestExecutorFunction {
  (t: ITestExecutorAssertor): Promise<any> | any;
}
export type ITestMetadata = Record<any, any>;
export interface ITest {
  context: ITestContext;
  ensure: (
    name: string,
    executor: ITestExecutorFunction,
    metadata?: ITestMetadata
  ) => void;
  skip: (
    name: string,
    executor: ITestExecutorFunction,
    metadata?: ITestMetadata
  ) => void;
}
export interface ITestContext {
  id: string;
  tests: Record<any, any>;
  testExecutors: Record<any, ITestExecutorFunction>;
}
export interface ITestResult {
  resolve: Function;
  reject: Function;
  logs: any[];
  id: string;
  isPassed?: boolean;
}
export const rejectTest = (
  tester: ITest,
  testId: string,
  testResults: ITestResult[]
) => {
  const handler = getTestHandler(testId, testResults);
  if (handler) {
    handler.isPassed = false;
    if (handler?.reject) handler.reject();
  }
};
export const acceptTest = (
  tester: ITest,
  testId: string,
  testResults: ITestResult[]
) => {
  const handler = getTestHandler(testId, testResults);
  if (handler) {
    handler.isPassed = true;
    if (handler?.resolve) handler.resolve();
  }
};
export function getTestHandler(testId: string, testResults: ITestResult[]) {
  return testResults.find((el) => el.id == testId);
}
export function createTestAssertor(
  tester: ITest,
  testId: string,
  testResults: ITestResult[]
) {
  const handler = getTestHandler(testId, testResults);
  const assertor: ITestExecutorAssertor = {
    log: (...args: any[]) => {
      if (handler) handler.logs.push({ args, type: "log" });
    },
    pass: () => {
      acceptTest(tester, testId, testResults);
    },
    fail: () => {
      rejectTest(tester, testId, testResults);
    },
    is: (left: any, right: any) => {
      console.log(left, right);
      const result = left === right;
      if (handler) handler.logs.push({ left, right, type: "is", result });
      if (result) {
        return true;
      } else {
        //        rejectTest(tester, testId, testResults);
        return false;
      }
    },
    truthy: (value: any) => {
      const result = !!value;
      if (!result) {
        //        rejectTest(tester, testId, testResults);
      }
      return result;
    },
  };
  return assertor;
}

export function creatTest() {
  const id = v4();
  const context: ITestContext = {
    id,
    tests: {},
    testExecutors: {},
  };
  const testCaseCreator = (
    context: ITestContext,
    testOptions: Record<any, any>,
    name: string,
    executor: ITestExecutorFunction,
    testMeta?: ITestMetadata
  ) => {
    const testId = v4();
    context.testExecutors[testId] = executor;
    context.tests[testId] = { id: testId, ...testOptions, name };
  };
  const test: ITest = {
    context,
    ensure: testCaseCreator.bind(null, context, {}),
    skip: testCaseCreator.bind(null, context, { skip: true }),
  };
  return test;
}
