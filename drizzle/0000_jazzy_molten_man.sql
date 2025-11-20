CREATE TABLE "weather" (
	"id" serial PRIMARY KEY NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"city" text NOT NULL,
	"temperature" double precision NOT NULL,
	"weather_code" integer NOT NULL,
	"is_day" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location" UNIQUE("latitude","longitude")
);
