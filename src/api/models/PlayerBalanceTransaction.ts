/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
import type { PlayerBalanceTransactionCause } from './PlayerBalanceTransactionCause';
import type { PlayerBalanceTransactionType } from './PlayerBalanceTransactionType';
export type PlayerBalanceTransaction = {
    id: string;
    amount: Money;
    type: PlayerBalanceTransactionType;
    cause: PlayerBalanceTransactionCause;
    createdAt: string;
};

