/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocalizedItem } from './LocalizedItem';
export type LocalizedField = {
    /**
     * Field identifier
     */
    field: string;
    /**
     * Localized display name
     */
    localization: string;
    /**
     * List of localized items for this field
     */
    items: Array<LocalizedItem>;
};

