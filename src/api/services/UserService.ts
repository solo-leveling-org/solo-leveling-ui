/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserLeaderboardResponse } from '../models/GetUserLeaderboardResponse';
import type { GetUserResponse } from '../models/GetUserResponse';
import type { GetUsersLeaderboardRequest } from '../models/GetUsersLeaderboardRequest';
import type { GetUsersLeaderboardResponse } from '../models/GetUsersLeaderboardResponse';
import type { LeaderboardType } from '../models/LeaderboardType';
import type { UpdateUserLocaleRequest } from '../models/UpdateUserLocaleRequest';
import type { UserAdditionalInfoResponse } from '../models/UserAdditionalInfoResponse';
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
     * Manual update current user's locale (from JWT)
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserLocale(
        requestBody: UpdateUserLocaleRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user/locale',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get additional user info (from JWT)
     * @returns UserAdditionalInfoResponse Additional user info
     * @throws ApiError
     */
    public static getUserAdditionalInfo(): CancelablePromise<UserAdditionalInfoResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/additional-info',
        });
    }
    /**
     * Get leaderboard for users
     * @param type
     * @param requestBody
     * @param page
     * @param pageSize
     * @returns GetUsersLeaderboardResponse Users leaderboard
     * @throws ApiError
     */
    public static getUsersLeaderboard(
        type: LeaderboardType,
        requestBody: GetUsersLeaderboardRequest,
        page?: number,
        pageSize: number = 20,
    ): CancelablePromise<GetUsersLeaderboardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user/leaderboard/{type}',
            path: {
                'type': type,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get leaderboard for current user
     * @param type
     * @param requestBody
     * @returns GetUserLeaderboardResponse User leaderboard
     * @throws ApiError
     */
    public static getUserLeaderboard(
        type: LeaderboardType,
        requestBody: GetUsersLeaderboardRequest,
    ): CancelablePromise<GetUserLeaderboardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user/leaderboard/{type}/me',
            path: {
                'type': type,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
