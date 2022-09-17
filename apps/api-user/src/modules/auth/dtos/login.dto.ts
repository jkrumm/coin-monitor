import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginInterface } from '@cm/types';

export class LoginDto implements LoginInterface {
  @IsEmail()
  @MaxLength(50)
  email: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(20)
  // username: string;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  password: string;
}
