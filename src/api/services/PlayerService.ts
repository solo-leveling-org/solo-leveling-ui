/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteTaskRequest } from '../models/CompleteTaskRequest';
import type { CompleteTaskResponse } from '../models/CompleteTaskResponse';
import type { GetActiveTasksResponse } from '../models/GetActiveTasksResponse';
import type { GetPlayerTopicsResponse } from '../models/GetPlayerTopicsResponse';
import type { SavePlayerTopicsRequest } from '../models/SavePlayerTopicsRequest';
import type { SkipTaskRequest } from '../models/SkipTaskRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlayerService {
    /**
     * Get player's topics with levels by player ID
     * @param playerId
     * @returns GetPlayerTopicsResponse Player's topic levels
     * @throws ApiError
     */
    public static getPlayerTopics(
        playerId: number,
    ): CancelablePromise<GetPlayerTopicsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/player/{playerId}/topics',
            path: {
                'playerId': playerId,
            },
        });
    }
    /**
     * Get current player's topics with levels
     * @returns GetPlayerTopicsResponse Current player's topic levels
     * @throws ApiError
     */
    public static getCurrentPlayerTopics(): CancelablePromise<GetPlayerTopicsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/player/topics',
        });
    }
    /**
     * Save current player's preferred topics
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static savePlayerTopics(
        requestBody: SavePlayerTopicsRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/topics',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get active tasks for current player
     * @returns GetActiveTasksResponse List of active tasks for current player
     * @throws ApiError
     */
    public static getActiveTasks(): CancelablePromise<GetActiveTasksResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/player/tasks/active',
        });
    }
    /**
     * Generate new tasks for current player
     * @returns void
     * @throws ApiError
     */
    public static generateTasks(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/generate',
        });
    }
    /**
     * Complete a task
     * @param requestBody
     * @returns CompleteTaskResponse Task completed successfully
     * @throws ApiError
     */
    public static completeTask(
        requestBody: CompleteTaskRequest,
    ): CancelablePromise<CompleteTaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/complete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Skip a task
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static skipTask(
        requestBody: SkipTaskRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/skip',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
