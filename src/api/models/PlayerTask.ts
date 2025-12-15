/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerTaskStatus } from './PlayerTaskStatus';
import type { Task } from './Task';
export type PlayerTask = {
    id: string;
    createdAt: string;
    updatedAt: string;
    order: number;
    status: PlayerTaskStatus;
    task: Task;
};

