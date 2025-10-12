/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TgUserData } from './TgUserData';
import type { TgWebAppChat } from './TgWebAppChat';
export type TgWebAppData = {
    query_id?: string;
    user: TgUserData;
    receiver?: TgUserData;
    chat?: TgWebAppChat;
    chat_type?: string;
    chat_instance?: string;
    start_param?: string;
    can_send_after?: number;
    auth_date: string;
    /**
     * Signature hash of the data
     */
    hash: string;
    signature?: string;
};

