import {Client} from 'pg'
import getPgConfig from '../getPgConfig'
import {r} from 'rethinkdb-ts'
import insertIntegrationProvider from '../queries/insertIntegrationProvider'

interface MattermostAuth {
  createdAt: Date
  updatedAt: Date
  isActive: true
  webhookUrl: string
  userId: string
  teamId: string
}

const connectRethinkDB = async () => {
  const {hostname: host, port, pathname} = new URL(process.env.RETHINKDB_URL)
  await r.connectPool({
    host,
    port: parseInt(port, 10),
    db: pathname.split('/')[1]
  })
}

export async function up() {
  await connectRethinkDB()
  const client = new Client(getPgConfig())
  await client.connect()

  const mattermostAuths: MattermostAuth[] = (
    await client.query(`SELECT * FROM "MattermostAuth" WHERE "isActive" = TRUE;`)
  ).rows

  const teamOrgIdRows = await r
    .table('Team')
    .getAll(r.args(mattermostAuths.map(({teamId}) => teamId)), {index: 'id'})
    .pluck('id', 'orgId')
    .merge((row) => ({teamId: row('id')}))
    .without('id')
    .run()

  const orgIdsByTeamId = teamOrgIdRows.reduce((acc, {teamId, orgId}) => {
    acc[teamId] = orgId
    return acc
  }, {} as {[teamId: string]: string})

  const mattermostAuthsToInsert = mattermostAuths.map((mattermostAuth) => {
    return insertIntegrationProvider({
      type: 'mattermost',
      tokenType: 'webhook',
      scope: 'team',
      name: 'mattermost',
      providerMetadata: {
        serverBaseUri: mattermostAuth.webhookUrl
      },
      orgId: orgIdsByTeamId[mattermostAuth.teamId],
      teamId: mattermostAuth.teamId
    })
  })
  await Promise.all(mattermostAuthsToInsert)
  await client.query(`DROP TABLE "MattermostAuth";`)

  await client.end()
  await r.getPoolMaster().drain()
}

export async function down() {
  await connectRethinkDB()
  const client = new Client(getPgConfig())
  await client.connect()

  const mattermostTokensWithProvider = await client.query(`
    SELECT * FROM "IntegrationProvider"
    WHERE "type" = 'mattermost' AND "isActive" = TRUE;
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS "MattermostAuth" (
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
      "isActive" BOOLEAN DEFAULT TRUE NOT NULL,
      "webhookUrl" VARCHAR(2083) NOT NULL,
      "userId" VARCHAR(100) NOT NULL,
      "teamId" VARCHAR(100) NOT NULL,
      PRIMARY KEY ("userId", "teamId")
    );
    CREATE INDEX IF NOT EXISTS "idx_MattermostAuth_teamId" ON "MattermostAuth"("teamId");
  `)

  if (mattermostTokensWithProvider.rows.length > 0) {
    const mattermostAuthsToInsert = mattermostTokensWithProvider.rows.map((row) =>
      client.query(
        `
        INSERT INTO "MattermostAuth" ("createdAt", "updatedAt", "isActive", "webhookUrl", "userId", "teamId")
        VALUES ($1, $2, $3, $4, $5, $6)
      `,

        [
          row.createdAt,
          row.updatedAt,
          row.isActive,
          row.provider.serverBaseUri,
          row.userId,
          row.teamId
        ]
      )
    )
    await Promise.all(mattermostAuthsToInsert)
    await client.query(
      `
      DELETE FROM "IntegrationProvider" WHERE "id" = ANY($1::int[]);
    `,
      [mattermostTokensWithProvider.rows.map((row) => row.provider.id)]
    )
  }
  await client.end()
  await r.getPoolMaster().drain()
}