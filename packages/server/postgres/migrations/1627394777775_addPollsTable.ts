import {MigrationBuilder, ColumnDefinitions} from 'node-pg-migrate'
import {Client} from 'pg'

import getPgConfig from '../getPgConfig'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  const client = new Client(getPgConfig())
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS "Poll" (
      "id" VARCHAR(100) PRIMARY KEY NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "deletedAt" TIMESTAMP WITH TIME ZONE DEFAULT NULL, 
      "endedAt" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
      "createdById" VARCHAR(100) NOT NULL REFERENCES "User"("id"),
      "discussionId" VARCHAR(100) NOT NULL REFERENCES "Discussion"("id"),
      "title" VARCHAR(300)
    );
    CREATE INDEX IF NOT EXISTS "idx_Poll_discussionId" ON "Poll"("discussionId");

    CREATE TABLE IF NOT EXISTS "PollOption" (
      "id" VARCHAR(100) PRIMARY KEY NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "pollId" VARCHAR(100) NOT NULL REFERENCES "Poll"("id") ON DELETE CASCADE,
      "voteUserIds" VARCHAR(100)[] NOT NULL DEFAULT array[]::VARCHAR[],
      "title" VARCHAR(100)
    );
    CREATE INDEX IF NOT EXISTS "idx_PollOption_pollId" ON "PollOption"("pollId");
  `)

  await client.end()
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  await pgm.db.query(`
    DROP TABLE IF EXISTS "PollOption", "Poll";
  `)
}
