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

import { FieldType } from "@database/db-types";

export interface ISQLTableField {
	name:         string;
	value?:        string;
	isPrimary?:    boolean;
	isIndexed:     boolean;
	fieldType?:    FieldType;
	nullable?:     boolean;
	key?:          string;
	default?:      any;
	extra?:        string;
	autoInc?:      boolean;
}

export class SQLTableField implements ISQLTableField {
	public isPrimary: boolean   = false;
	public isIndexed: boolean   = false;
	public fieldType: FieldType = FieldType.unset;
	public nullable:  boolean   = false;
	public key:       string    = '';
	public default:   any       = '';
	public extra:     string    = '';
	public autoInc:   boolean   = false;

	constructor(
		public name: string,
		public value?: string
	) {
	}
}
