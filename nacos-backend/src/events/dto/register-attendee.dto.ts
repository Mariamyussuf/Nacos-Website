import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterAttendeeDto {
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName: string;

  @IsString()
  @Matches(/^[0-9]{2,4}\/[0-9]{3,6}$/, {
    message: 'Matriculation number must be in format YYYY/XXXXX (e.g. 2022/12345) or YY/XXXX (e.g. 21/1000)',
  })
  matricNumber: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150, { message: 'Email address cannot exceed 150 characters' })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\s()#-]{7,20}$/, { message: 'Please provide a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Department name cannot exceed 100 characters' })
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Level cannot exceed 50 characters' })
  level?: string;

  @IsOptional()
  @IsString()
  eventTitle?: string;

  @IsOptional()
  @IsString()
  captchaToken?: string;

  @IsOptional()
  @IsString()
  captchaAnswer?: string;
}

