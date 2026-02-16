/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Stamina = {
    id: string;
    /**
     * Текущее количество стамины
     */
    current: number;
    /**
     * Максимальное количество стамины
     */
    max: number;
    /**
     * Флаг активной регенерации стамины
     */
    isRegenerating: boolean;
    /**
     * Количество стамины, восстанавливаемое за один интервал
     */
    regenRate: number;
    /**
     * Интервал регенерации в секундах
     */
    regenIntervalSeconds: number;
    /**
     * Время следующей регенерации стамины (ISO 8601)
     */
    nextRegenAt?: string;
    /**
     * Время полного восстановления стамины (ISO 8601)
     */
    fullRegenAt?: string;
};

