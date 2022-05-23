import { TestInterface } from '@cm/types';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TestDto implements TestInterface {
  @IsOptional()
  id?: string;

  @IsOptional()
  created?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(250)
  message: string;

  @IsOptional()
  @IsNumber()
  likes: number;
}
