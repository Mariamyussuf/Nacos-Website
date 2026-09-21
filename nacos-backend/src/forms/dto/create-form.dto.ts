export class FormFieldDto {
  id: string;
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
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select / radio / checkbox
  accept?: string; // for file (e.g. ".pdf,.jpg")
  maxFileSizeMb?: number; // for file fields
}

export class CreateFormDto {
  title: string;
  slug?: string; // auto-generated from title if omitted
  description?: string;
  fields: FormFieldDto[];
  status?: 'draft' | 'published' | 'closed';
}

export class UpdateFormDto {
  title?: string;
  slug?: string;
  description?: string;
  fields?: FormFieldDto[];
  status?: 'draft' | 'published' | 'closed';
}
