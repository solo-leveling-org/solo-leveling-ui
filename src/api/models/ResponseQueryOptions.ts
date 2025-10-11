/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocalizedField } from './LocalizedField';
export type ResponseQueryOptions = {
    /**
     * Total number of rows/items
     */
    totalRowCount?: number;
    /**
     * Total number of pages
     */
    totalPageCount?: number;
    /**
     * Available filters with localization
     */
    filters?: Array<LocalizedField>;
    /**
     * Available sort fields
     */
    sorts?: Array<string>;
};

