/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { ISQLTableData } from "./data-containers/sql-table-data";

export interface IQueryResult {
	tableData: ISQLTableData;
	error: Error;
}

export class QueryResult implements IQueryResult {
	constructor(
		public tableData: ISQLTableData = null,
		public error: Error             = null
	) {
	}
}
