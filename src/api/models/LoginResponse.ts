/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtToken } from './JwtToken';
/**
 * Response containing JWT tokens after successful authentication
 */
export type LoginResponse = {
    accessToken: JwtToken;
    refreshToken: JwtToken;
};

