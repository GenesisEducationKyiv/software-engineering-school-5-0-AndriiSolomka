import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsInt()
  @IsNotEmpty()
  subscriptionId: number;
}

export class TokenResponseDto {
  token: string;
}

export class GetTokenEntityDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
