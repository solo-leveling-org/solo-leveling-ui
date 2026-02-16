/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DayStreak } from './DayStreak';
import type { UserLocale } from './UserLocale';
import type { UserRole } from './UserRole';
export type UserAdditionalInfoResponse = {
    photoUrl?: string;
    dayStreak: DayStreak;
    locale: UserLocale;
    roles: Array<UserRole>;
};

