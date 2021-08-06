"use strict";
/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-06-20
 */
Object.defineProperty(exports, "__esModule", { value: true });
function matchObjectProps(data, propNames) {
    let result = true;
    if (!data || typeof data !== 'object') {
        return false;
    }
    let keys = Object.keys(data);
    for (let prop of propNames) {
        if (keys.indexOf(prop) === -1) {
            result = false;
            break;
        }
    }
    return result;
}
exports.matchObjectProps = matchObjectProps;
