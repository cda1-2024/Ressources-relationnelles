import { plainToInstance } from 'class-transformer';
import { ToBoolean } from './helper-validator.decorator';

class TestClass {
  @ToBoolean()
  value;
}

describe('ToBoolean', () => {
  it('should transform "true" string to boolean true', () => {
    const input = { value: 'true' };
    const result = plainToInstance(TestClass, input);
    expect(result.value).toBe(true);
  });

  it('should transform "false" string to boolean false', () => {
    const input = { value: 'false' };
    const result = plainToInstance(TestClass, input);
    expect(result.value).toBe(false);
  });

  it('should transform "random" string to boolean false', () => {
    const input = { value: 'random' };
    const result = plainToInstance(TestClass, input);
    expect(result.value).toBe(false);
  });

  it('should transform empty string to boolean false', () => {
    const input = { value: '' };
    const result = plainToInstance(TestClass, input);
    expect(result.value).toBe(false);
  });
});
