import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(35)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @Length(8, 16)
  @IsNotEmpty()
  readonly password: string;
}
