/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Level } from './Level';
import type { PlayerBalance } from './PlayerBalance';
import type { PlayerTaskTopic } from './PlayerTaskTopic';
export type Player = {
    id?: number;
    version?: number;
    maxTasks?: number;
    agility?: number;
    strength?: number;
    intelligence?: number;
    level?: Level;
    balance?: PlayerBalance;
    taskTopics?: Array<PlayerTaskTopic>;
};

