import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  authorRole?: string;

  @IsOptional()
  @IsString()
  readTime?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
