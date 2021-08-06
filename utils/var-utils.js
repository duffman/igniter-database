"use strict";
/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DbVarUtils {
    static isDefined(value) {
        return value === null || value === undefined;
    }
    static isString(value) {
        return (value && typeof value === 'string');
    }
}
exports.DbVarUtils = DbVarUtils;
