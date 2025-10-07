/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserResponse } from '../models/GetUserResponse';
import type { UpdateUserLocaleRequest } from '../models/UpdateUserLocaleRequest';
import type { UserLocaleResponse } from '../models/UserLocaleResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get user by ID
     * @param userId
     * @returns GetUserResponse User data
     * @throws ApiError
     */
    public static getUser(
        userId: number,
    ): CancelablePromise<GetUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * Get current user (from JWT)
     * @returns GetUserResponse Current user data
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<GetUserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/me',
        });
    }
    /**
     * Get current user's locale (from JWT)
     * @returns UserLocaleResponse Current user locale
     * @throws ApiError
     */
    public static getUserLocale(): CancelablePromise<UserLocaleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/locale',
        });
    }
    /**
     * Manual update current user's locale (from JWT)
     * @param requestBody
     * @returns UserLocaleResponse Current user locale
     * @throws ApiError
     */
    public static updateUserLocale(
        requestBody: UpdateUserLocaleRequest,
    ): CancelablePromise<UserLocaleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user/locale',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
