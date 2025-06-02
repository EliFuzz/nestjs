import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ description: 'Email address of the user' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MinLength(1, { message: 'Email must be at least 1 characters long' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email: string;

  @Field({ description: 'Password of the user' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(255, { message: 'Password cannot exceed 255 characters' })
  password: string;
}

@ObjectType({ description: 'A user in the system' })
export class LoginPayload {
  @Field({ description: 'Authentication token' })
  token: string;
}
