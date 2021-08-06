/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { MySqlOkPacket } from "./types/mysql-ok-packet";
import { SQLTableData }  from "./data-containers/sql-table-data";
import { L }             from "./db-logger";
import { IDbResult }     from "./db-result";
import { DbResult }      from "./db-result";

export class DbResultParser {
	public static parseQueryResult(error, result, tableFields): Promise<IDbResult> {
		return new Promise((resolve, reject) => {
			let queryResult = new DbResult();

			if (error) {
				queryResult.success = false;
				queryResult.error   = error;
				let customError     = error;

				// error code 1292

				if (error.errno === 'ECONNREFUSED') {
					customError = new Error("ECONNREFUSED");
				}
				if (error.errno == 1062) {
					customError = new Error("DUP_ENTRY");
				}
				else {
					L.logErrorMessage("dbQuery :: Error ::", error.errno);
				}

				reject(customError);
			}
			else {
				if (MySqlOkPacket.validate(result)) {
					queryResult.affectedRows = result.affectedRows;
					queryResult.lastInsertId = result.insertId;
				}

				let data = new SQLTableData();

				data.parseResultSet(result, tableFields).then((res) => {
					queryResult.setResult(res);
					resolve(queryResult);
				}).catch((err) => {
					reject(err);
				});
			}
		});
	}
}
