import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AddNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  note_text: string;
}