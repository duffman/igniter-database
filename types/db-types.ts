/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ISQLTableDataRow } from "../data-containers/sql-table-data-row";

export type SQLTableRows = Array<ISQLTableDataRow>;

export module FieldDataTypeDef {
	export const BIGINT = 8;
	export const TINYINT = 1;
	export const SMALLINT = 2;
	export const VARCHAR = 253;
	export const INT = 3;
	export const DATE_TIME = 12;
	export const DOUBLE = 5;
	export const POINT = 255;
	export const ENUM_STR = 254;
}

export enum FieldType {
	unset = -1,
	bigint = 8,
	tinyint = 1,
	smallint = 2,
	varchar = 253,
	int = 3,
	datetime = 12,
	double = 5,
	point = 255,
	enumStr = 254
}
