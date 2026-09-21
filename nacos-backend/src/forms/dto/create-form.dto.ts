import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FormFieldDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsIn([
    'text',
    'email',
    'number',
    'date',
    'textarea',
    'select',
    'radio',
    'checkbox',
    'file',
  ])
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'file';

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[]; // for select / radio / checkbox

  @IsOptional()
  @IsString()
  accept?: string; // for file (e.g. ".pdf,.jpg")

  @IsOptional()
  @IsNumber()
  maxFileSizeMb?: number; // for file fields
}

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string; // auto-generated from title if omitted

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];

  @IsOptional()
  @IsIn(['draft', 'published', 'closed'])
  status?: 'draft' | 'published' | 'closed';
}

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields?: FormFieldDto[];

  @IsOptional()
  @IsIn(['draft', 'published', 'closed'])
  status?: 'draft' | 'published' | 'closed';
}

