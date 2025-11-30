/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlayerTask } from './PlayerTask';
import type { SearchEntitiesResponse } from './SearchEntitiesResponse';
export type SearchPlayerTasksResponse = (SearchEntitiesResponse & {
    tasks: Array<PlayerTask>;
});

