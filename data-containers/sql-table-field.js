"use strict";
/**
 * Copyright (C) 2020 Ionic Igniter - ionicigniter.com
 * Author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_types_1 = require("@zynDb/db-types");
class SQLTableField {
    constructor(field, value) {
        this.field = field;
        this.value = value;
        this.isPrimary = false;
        this.isIndexed = false;
        this.fieldType = db_types_1.FieldType.unset;
        this.nullable = false;
        this.key = '';
        this.default = '';
        this.extra = '';
        this.autoInc = false;
    }
}
exports.SQLTableField = SQLTableField;
