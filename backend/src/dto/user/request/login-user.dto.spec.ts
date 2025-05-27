import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { findErrorByField } from 'src/helper/tests';
import {
  IDENTIFIER_NOT_A_STRING,
  IDENTIFIER_NOT_EMPTY,
  PASSWORD_NOT_A_STRING,
  PASSWORD_NOT_EMPTY,
} from 'src/helper/constants/user-constant-exception';

describe('LoginUserDto', () => {
  let dto: LoginUserDto;

  beforeEach(() => {
    dto = new LoginUserDto();
    dto.identifier = 'b.976@gmail.com';
    dto.password = 'Complex9*4a#';
  });

  it('should pass validation with valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with empty identifier', async () => {
    dto.identifier = '';
    const errors = await validate(dto);

    expect(errors.length).toBe(1);

    const identifier_error = findErrorByField(errors, 'identifier');
    expect(identifier_error).toBeDefined();
    expect(identifier_error?.constraints?.isNotEmpty).toBe(IDENTIFIER_NOT_EMPTY);
  });

  it('should fail with empty password', async () => {
    dto.password = '';
    const errors = await validate(dto);

    expect(errors.length).toBe(1);

    const password_error = findErrorByField(errors, 'password');
    expect(password_error).toBeDefined();
    expect(password_error?.constraints?.isNotEmpty).toBe(PASSWORD_NOT_EMPTY);
  });

  it('should fail with wrong value type in identifier', async () => {
    // @ts-expect-error: Intentional type mismatch for testing
    dto.identifier = true;

    const errors = await validate(dto);
    console.log(errors);

    expect(errors.length).toBe(1);

    const identifier_error = findErrorByField(errors, 'identifier');
    expect(identifier_error).toBeDefined();
    expect(identifier_error?.constraints?.isString).toBe(IDENTIFIER_NOT_A_STRING);
  });

  it('should fail with wrong value type in password', async () => {
    // @ts-expect-error: Intentional type mismatch for testing
    dto.password = 123456;

    const errors = await validate(dto);
    console.log(errors);

    expect(errors.length).toBe(1);

    const password_error = findErrorByField(errors, 'password');
    expect(password_error).toBeDefined();
    expect(password_error?.constraints?.isString).toBe(PASSWORD_NOT_A_STRING);
  });
});
