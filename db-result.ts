/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * September 2018
 */

import { ISQLTableData }    from "./data-containers/sql-table-data";
import { SQLTableData }     from "./data-containers/sql-table-data";
import { ISQLTableDataRow } from './data-containers/sql-table-data-row';
import { SQLTableDataRow }  from './data-containers/sql-table-data-row';
import { DbResultJson }     from "./db-result-json";
import { SQLTableRows }     from "./types/db-types";

export interface IDbResult {
	success: boolean;
	error: Error;
	lastInsertId: number;
	affectedRows: number;
	result: ISQLTableData;
	resultSet: SQLTableRows;
	rowCount: number;
	jsonResult: DbResultJson;
	setResult(result: ISQLTableData): void;
	safeGetFirstRow(): ISQLTableDataRow;
	any(): boolean;
	setError(err: Error);
}

export class DbResult implements IDbResult {
	public success: boolean                   = true;
	public lastInsertId: number               = 0;
	public affectedRows: number               = 0;
	public resultSet: Array<ISQLTableDataRow> = [];
	public rowCount: number                   = 0;
	public jsonResult: DbResultJson;
	public result: ISQLTableData              = null;

	constructor(public error: any = null) {}

	public setResult(result: ISQLTableData): void {
		if (result) {
			this.result = result;
		}

		if (result && result.dataRows) {
			this.resultSet  = result.dataRows;
			this.jsonResult = new DbResultJson(result.dataRows);
			this.rowCount   = this.resultSet.length;
		}
	}

	public any(): boolean {
		return this.result.rowCount() > 0;
	}

	/**
	 * Always return a SQLTableDataRow
	 * If a SQLTableData result is present containing
	 * one or more rows, the first row will be returned
	 * otherwize a new SQLTableDataRow will be created.
	 */
	public safeGetFirstRow(): ISQLTableDataRow {
		let tableDataRow: ISQLTableDataRow;
		let isObj       = this.result != null;
		let isTableData = this.result instanceof SQLTableData;

		if (isObj && isTableData && this.result.dataRows.length > 0) {
			tableDataRow = this.result.getFirstRow()
		}
		else {
			tableDataRow         = new SQLTableDataRow();
			tableDataRow.isEmpty = true;
		}

		return tableDataRow;
	}

	public setError(err: Error): void {
		if (err !== null) {
			this.error   = err;
			this.success = false;
		}
	}
}
