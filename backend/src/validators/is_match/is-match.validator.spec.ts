import { MatchConstraint } from './is-match.validator';
import { ValidationArguments } from 'class-validator';

function createValidationArguments(): ValidationArguments {
  return {
    value: 'defaultValue',
    constraints: ['password'],
    targetName: 'DefaultDto',
    object: { password: 'password123' },
    property: 'defaultProperty',
  };
}

describe('IsMatchConstraint', () => {
  let isMatch: MatchConstraint;
  let args: ValidationArguments;

  beforeEach(() => {
    isMatch = new MatchConstraint();
    args = createValidationArguments();
  });

  describe('validate', () => {
    it('should return true if the values are the same', () => {
      const result = isMatch.validate('password123', args);
      expect(result).toBe(true);
    });

    it('should return false if the values are different', () => {
      const result = isMatch.validate('differentPassword', args);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default error message', () => {
      const message = isMatch.defaultMessage(args);
      expect(message).toBe("defaultProperty n'est pas égal à password");
    });
  });
});
