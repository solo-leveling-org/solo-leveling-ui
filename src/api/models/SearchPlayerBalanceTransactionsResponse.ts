/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerBalanceTransaction } from './PlayerBalanceTransaction';
import type { SearchEntitiesResponse } from './SearchEntitiesResponse';
export type SearchPlayerBalanceTransactionsResponse = (SearchEntitiesResponse & {
    transactions: Array<PlayerBalanceTransaction>;
});

