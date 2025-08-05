/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Player } from './Player';
import type { UserRole } from './UserRole';
export type User = {
    id?: number;
    version?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    locale?: string;
    roles?: Array<UserRole>;
    player?: Player;
};

