/** Types generated for queries found in "packages/server/postgres/queries/src/getSharedIntegrationProvidersQuery.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type IntegrationProviderAuthStrategyEnum = 'oauth1' | 'oauth2' | 'pat' | 'webhook';

export type IntegrationProviderScopeEnum = 'global' | 'org' | 'team';

export type IntegrationProviderServiceEnum = 'gitlab' | 'jiraServer' | 'mattermost';

/** 'GetSharedIntegrationProvidersQuery' parameters type */
export interface IGetSharedIntegrationProvidersQueryParams {
  orgIds: readonly (string | null | void)[];
  teamIds: readonly (string | null | void)[];
  service: IntegrationProviderServiceEnum | null | void;
}

/** 'GetSharedIntegrationProvidersQuery' return type */
export interface IGetSharedIntegrationProvidersQueryResult {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  service: IntegrationProviderServiceEnum;
  authStrategy: IntegrationProviderAuthStrategyEnum;
  scope: IntegrationProviderScopeEnum;
  scopeGlobal: boolean;
  teamId: string | null;
  isActive: boolean;
  clientId: string | null;
  clientSecret: string | null;
  serverBaseUrl: string | null;
  webhookUrl: string | null;
  consumerKey: string | null;
  consumerSecret: string | null;
  orgId: string | null;
}

/** 'GetSharedIntegrationProvidersQuery' query type */
export interface IGetSharedIntegrationProvidersQueryQuery {
  params: IGetSharedIntegrationProvidersQueryParams;
  result: IGetSharedIntegrationProvidersQueryResult;
}

const getSharedIntegrationProvidersQueryIR: any = {"name":"getSharedIntegrationProvidersQuery","params":[{"name":"orgIds","codeRefs":{"defined":{"a":53,"b":58,"line":3,"col":8},"used":[{"a":268,"b":273,"line":10,"col":37}]},"transform":{"type":"array_spread"}},{"name":"teamIds","codeRefs":{"defined":{"a":77,"b":83,"line":4,"col":8},"used":[{"a":222,"b":228,"line":9,"col":39}]},"transform":{"type":"array_spread"}},{"name":"service","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":153,"b":159,"line":7,"col":19}]}}],"usedParamSet":{"service":true,"teamIds":true,"orgIds":true},"statement":{"body":"SELECT * FROM \"IntegrationProvider\"\nWHERE \"service\" = :service\nAND \"isActive\" = TRUE\nAND (\"scope\" != 'team' OR \"teamId\" in :teamIds)\nAND (\"scope\" != 'org' OR \"orgId\" in :orgIds)","loc":{"a":98,"b":274,"line":6,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "IntegrationProvider"
 * WHERE "service" = :service
 * AND "isActive" = TRUE
 * AND ("scope" != 'team' OR "teamId" in :teamIds)
 * AND ("scope" != 'org' OR "orgId" in :orgIds)
 * ```
 */
export const getSharedIntegrationProvidersQuery = new PreparedQuery<IGetSharedIntegrationProvidersQueryParams,IGetSharedIntegrationProvidersQueryResult>(getSharedIntegrationProvidersQueryIR);


