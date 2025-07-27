/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtTokenType } from './JwtTokenType';
export type JwtToken = {
    /**
     * JWT token string
     */
    token: string;
    /**
     * Expiration time of the token
     */
    expiration: string;
    type: JwtTokenType;
};

