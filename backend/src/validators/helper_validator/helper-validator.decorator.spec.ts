import { plainToInstance } from 'class-transformer';
import { ToBoolean } from './helper-validator.decorator';

describe('ToBoolean', () => {
  class TestClass {
    @ToBoolean()
    value: any;
  }

  it('should transform "true" string (case insensitive) to boolean true', () => {
    const input1 = { value: 'true' };
    const input2 = { value: 'TRUE' };
    const input3 = { value: 'True' };

    const result1 = plainToInstance(TestClass, input1);
    const result2 = plainToInstance(TestClass, input2);
    const result3 = plainToInstance(TestClass, input3);

    expect(result1.value).toBe(true);
    expect(result2.value).toBe(true);
    expect(result3.value).toBe(true);
  });

  it('should transform any other string to boolean false', () => {
    const inputs = [{ value: 'false' }, { value: 'random' }, { value: '' }, { value: ' ' }];

    inputs.forEach((input) => {
      const result = plainToInstance(TestClass, input);
      expect(result.value).toBe(false);
    });
  });

  it('should handle non-string values correctly', () => {
    const testCases = [
      { input: true, expected: false },
      { input: false, expected: false },
      { input: 1, expected: false },
      { input: 0, expected: false },
      { input: null, expected: false },
      { input: undefined, expected: false },
      { input: {}, expected: false },
      { input: [], expected: false },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = plainToInstance(TestClass, { value: input });
      expect(result.value).toBe(expected);
    });
  });
});
