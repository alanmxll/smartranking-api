import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;
}
