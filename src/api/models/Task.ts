/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskRarity } from './TaskRarity';
import type { TaskTopic } from './TaskTopic';
export type Task = {
    id?: string;
    version?: number;
    title?: string;
    description?: string;
    experience?: number;
    rarity?: TaskRarity;
    topics?: Array<TaskTopic>;
    agility?: number;
    strength?: number;
    intelligence?: number;
};

