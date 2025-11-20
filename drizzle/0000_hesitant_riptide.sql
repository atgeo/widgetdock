CREATE TABLE "weather" (
	"city" text PRIMARY KEY NOT NULL,
	"temperature" integer NOT NULL,
	"condition" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
