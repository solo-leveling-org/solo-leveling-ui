/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TgUserData } from './TgUserData';
export type TgWebAppData = {
    auth_date: string;
    chat_type?: string;
    chat_instance?: string;
    /**
     * Signature hash of the data
     */
    hash: string;
    signature?: string;
    user: TgUserData;
};

