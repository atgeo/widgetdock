ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE no action;