import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { RegisterInterface } from '@cm/types';

export class RegisterDto implements RegisterInterface {
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ValidateIf(/* istanbul ignore next */ (_object, value) => value !== null)
  username: string | null;

  // Password validation:
  // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,50}$/, {
    message: 'password to weak',
  })
  password: string;
}
