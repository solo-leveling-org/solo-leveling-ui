/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteTaskResponse } from '../models/CompleteTaskResponse';
import type { GetActiveTasksResponse } from '../models/GetActiveTasksResponse';
import type { GetPlayerBalanceResponse } from '../models/GetPlayerBalanceResponse';
import type { GetPlayerTopicsResponse } from '../models/GetPlayerTopicsResponse';
import type { SavePlayerTopicsRequest } from '../models/SavePlayerTopicsRequest';
import type { SearchPlayerBalanceTransactionsResponse } from '../models/SearchPlayerBalanceTransactionsResponse';
import type { SearchPlayerTasksResponse } from '../models/SearchPlayerTasksResponse';
import type { SearchRequest } from '../models/SearchRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlayerService {
    /**
     * Get current player's topics with levels
     * @returns GetPlayerTopicsResponse Current player's topic levels
     * @throws ApiError
     */
    public static getPlayerTopics(): CancelablePromise<GetPlayerTopicsResponse> {
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
     * @param id
     * @returns CompleteTaskResponse Task completed successfully
     * @throws ApiError
     */
    public static completeTask(
        id: string,
    ): CancelablePromise<CompleteTaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/{id}/complete',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Skip a task
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static skipTask(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/{id}/skip',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Search player tasks
     * @param requestBody
     * @param page
     * @param pageSize
     * @returns SearchPlayerTasksResponse Successful response
     * @throws ApiError
     */
    public static searchPlayerTasks(
        requestBody: SearchRequest,
        page?: number,
        pageSize: number = 20,
    ): CancelablePromise<SearchPlayerTasksResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/tasks/search',
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get player balance
     * @returns GetPlayerBalanceResponse Successful response
     * @throws ApiError
     */
    public static getPlayerBalance(): CancelablePromise<GetPlayerBalanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/player/balance',
        });
    }
    /**
     * Search player balance transactions
     * @param requestBody
     * @param page
     * @param pageSize
     * @returns SearchPlayerBalanceTransactionsResponse Successful response
     * @throws ApiError
     */
    public static searchPlayerBalanceTransactions(
        requestBody: SearchRequest,
        page?: number,
        pageSize: number = 20,
    ): CancelablePromise<SearchPlayerBalanceTransactionsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/player/balance/transaction/search',
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
