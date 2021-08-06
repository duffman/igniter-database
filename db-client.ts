/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Created: 2017-05-14
 */

import { DbEngine }       from "./db-engine";
import { injectable }     from 'inversify';
import { MysqlError }     from "mysql";
import { Connection }     from "mysql";
import { ISQLTableField } from "./data-containers/sql-table-field";
import { L }              from "./db-logger";
import { DbVarUtils }     from "./utils/var-utils";
import { IDbSettings }    from "./db-settings";
import { IDbResult }      from "./db-result";

export interface IDbClient {
	configure(settings: IDbSettings): void;
	getConnection(settings?: IDbSettings): Connection;

	// Transactions
	startTransaction(): Promise<MysqlError>;
	startTransaction2(): Promise<Connection>

	commitTransaction(): Promise<MysqlError>;
	rollbackTransaction(conn?: Connection): Promise<MysqlError>;

	// Query functionality
	query(sql: any, conn?: Connection): Promise<IDbResult>;
	describeTable(tableName: string): Promise<IDbResult>;
	getPrimaryKeyField(tableName: string): Promise<ISQLTableField>;
}

@injectable()
export class DbClient extends DbEngine implements IDbClient {

	constructor() {
		super();
	}

	/**
	 * Get database connection instance
	 * @param {IDbSettings} settings
	 * @returns {Connection}
	 */
	public getConnection(settings?: IDbSettings): Connection {
		return super.getConnection();
	}

	/**
	 * Initialize transaction
	 * @returns {Promise<MysqlError>}
	 */
	public startTransaction(): Promise<MysqlError> {
		return super.startTransaction();
	}

	/**
	 * Undo transaction
	 * @returns {Promise<MysqlError>}
	 */
	public rollbackTransaction(conn?: Connection): Promise<MysqlError> {
		return super.rollbackTransaction();
	}

	/**
	 * Save transaction changes to database
	 * @returns {Promise<MysqlError>}
	 */
	public commitTransaction(): Promise<MysqlError> {
		return super.commitTransaction();
	}

	/**
	 * Executes a SQL query against the Database Server if an object instance
	 * is passed, an attempt to call a toString() method will be make which
	 * makes it possible to pass an instance of ZynQuery for exampe is possible.
	 *
	 * @param query
	 * @param conn
	 * @returns {Promise<IDbResult>}
	 */
	public query(query: any, conn?: Connection): Promise<IDbResult> {
		let sql: string = undefined;

		if (DbVarUtils.isString(query)) {
			sql = query
		}
		else if (typeof query === 'object' && typeof query.toSql === "function") {
			sql = query.toSql();
		}

		if (typeof sql === "string") {
			return super.runQuery(sql, conn);
		}
		else {
			return new Promise((resolve, reject) => {
				reject(new Error("Invalid SQL"));
			});
		}
	}

	/**
	 * Extracts table META-data
	 * @param {string} tableName
	 * @returns {Promise<IDbResult>}
	 */
	public describeTable(tableName: string): Promise<IDbResult> {
		return new Promise((resolve, reject) => {
			const sql = `DESC ${tableName}`;
			L.log('setRecord :: haveRow ::', sql);

			this.runQuery(sql).then((res: IDbResult) => {
				resolve(res);
			}).catch(err => {
				L.error("describeTable :: haveRow ::", err);
				reject(err);
			});
		});
	}

	/**
	 * Get the primary key from given table
	 * @param {string} tableName
	 * @returns {Promise<ISQLTableField>}
	 */
	public getPrimaryKeyField(tableName: string): Promise<ISQLTableField> {
		return new Promise((resolve, reject) => {
			this.describeTable(tableName).then((res: IDbResult) => {
				let primaryField: ISQLTableField = undefined;
				if (res.result) {
					primaryField = res.result.getPrimaryField();
				}
				resolve(primaryField);
			}).catch(err => {
				reject(err);
			})
		});
	}
}
