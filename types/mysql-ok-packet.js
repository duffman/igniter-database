"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-06-16
 *
 * Description **
 * Result from an insert, update, or delete statement.
 *
 */
const prop_match_1 = require("../utils/prop-match");
class MySqlOkPacket {
    static toPacket(json) {
        return JSON.parse(json);
    }
    static toJson(value) {
        return JSON.stringify(value);
    }
    static validate(packet) {
        let okPacketProps = [
            'fieldCount',
            'affectedRows',
            'insertId',
            'serverStatus',
            'warningCount',
            'message',
            'protocol41',
            'changedRows'
        ];
        return prop_match_1.matchObjectProps(packet, okPacketProps);
    }
}
exports.MySqlOkPacket = MySqlOkPacket;
