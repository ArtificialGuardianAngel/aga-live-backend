export class SubmittionDto {
  question_answers: Record<string, Record<string, string>>;
  demographic_answers: Record<string, string>;
}
