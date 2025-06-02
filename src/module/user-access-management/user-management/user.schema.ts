import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType({ description: 'A user in the system' })
export class UserInput {
  @Field(() => ID, { description: 'Unique identifier of the user' })
  @IsUUID(4, { message: 'Please provide a valid UUID' })
  @IsNotEmpty({ message: 'ID is required' })
  id: string;
}

@ObjectType('user', { description: 'A user in the system' })
export class UserPayload {
  @Field(() => ID, { description: 'Unique identifier of the user' })
  @IsUUID(4, { message: 'Please provide a valid UUID' })
  @IsNotEmpty({ message: 'ID is required' })
  id: string;

  @Field({ description: 'First name of the user', nullable: true })
  @MinLength(1, { message: 'First name must be at least 1 character long' })
  @MaxLength(100, { message: 'First name cannot exceed 100 characters' })
  firstName?: string;

  @Field({ description: 'Last name of the user', nullable: true })
  @MinLength(1, { message: 'Last name must be at least 1 character long' })
  @MaxLength(100, { message: 'Last name cannot exceed 100 characters' })
  lastName?: string;

  @Field({ description: 'Email address of the user', nullable: true })
  @MinLength(1, { message: 'Email must be at least 1 character long' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email?: string;

  @Field({ description: 'Phone number of the user', nullable: true })
  @MinLength(1, { message: 'Phone number must be at least 1 character long' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phoneNumber?: string;

  @Field({ description: 'Whether the user is active or not', nullable: true })
  @IsBoolean({ message: 'Please provide a valid boolean value' })
  isActive?: boolean;

  @Field({
    description: 'Whether the user has verified their email address or not',
    nullable: true,
  })
  @IsBoolean({ message: 'Please provide a valid boolean value' })
  isEmailVerified?: boolean;

  @Field({ description: "Timestamp of the user's last login", nullable: true })
  @IsDate({ message: 'Please provide a valid date' })
  lastLoginAt?: Date;

  @Field({
    description: 'Timestamp of when the user was created',
    nullable: true,
  })
  @IsDate({ message: 'Please provide a valid date' })
  createdAt?: Date;

  @Field({
    description: 'Timestamp of when the user was last updated',
    nullable: true,
  })
  @IsDate({ message: 'Please provide a valid date' })
  updatedAt?: Date;
}
