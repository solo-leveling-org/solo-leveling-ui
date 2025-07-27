/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtResponse } from '../models/JwtResponse';
import type { JwtToken } from '../models/JwtToken';
import type { TgAuthData } from '../models/TgAuthData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JwtService {
    /**
     * Authenticate using Telegram Web App data
     * Authenticates the user using Telegram Web App data and returns JWT tokens
     * @param requestBody
     * @returns JwtResponse Successful authentication
     * @throws ApiError
     */
    public static login(
        requestBody: TgAuthData,
    ): CancelablePromise<JwtResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Invalid Telegram data or signature`,
            },
        });
    }
    /**
     * Refresh access token using refresh token
     * Generates a new access token using a valid refresh token
     * @param requestBody
     * @returns JwtToken New access token generated
     * @throws ApiError
     */
    public static refresh(
        requestBody: {
            /**
             * The refresh token to use for generating a new access token
             */
            refreshToken: string;
        },
    ): CancelablePromise<JwtToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Invalid or expired refresh token`,
            },
        });
    }
}
