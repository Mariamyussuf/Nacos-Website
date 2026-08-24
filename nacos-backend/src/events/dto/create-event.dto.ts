import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  flier?: string;

  @IsOptional()
  @IsString()
  commentary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];
}
