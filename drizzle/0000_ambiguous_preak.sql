CREATE TABLE "weather" (
	"id" serial PRIMARY KEY NOT NULL,
	"lat" double precision NOT NULL,
	"lon" double precision NOT NULL,
	"city" text,
	"temperature" integer NOT NULL,
	"condition" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_location" UNIQUE("lat","lon")
);
