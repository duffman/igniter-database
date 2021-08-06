/**
 * Copyright (C) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ISQLTableField }      from "./data-containers/sql-table-field";
import { injectable }          from 'inversify';
import { MysqlError }          from "mysql";
import * as mysql              from "mysql";
import { Connection }          from "mysql";
import { L }                   from "./db-logger";
import { DbResult, IDbResult } from "./db-result";
import { DbResultParser }      from "./db-result-parser";
import { IDbSettings }         from "./db-settings";

const util = require('util');

@injectable()
export class MySqlClient {
	private dbSettings: IDbSettings;
	private connLost: boolean = false;
	public debug: boolean     = true;
	public lastError: Error;

	connection: Connection;

	constructor() {}

	public configure(settings: IDbSettings): void {
		this.dbSettings = settings;
	}

	/**
	 * Create MySQL Connection
	 * @param {IDbSettings} settings
	 * @returns {Connection}
	 */
	public getConnection(settings?: IDbSettings): Connection {
		L.log("Creating new connection");

		try {
			if (!this.dbSettings) {
				L.logErrorMessage('DBKernel :: getConnection :: MySQL not initialized - settings missing');
				return;
			}

			if (!this.connection || true) {
				this.connection = mysql.createConnection(
					{
						host:     this.dbSettings.dbHost,
						user:     this.dbSettings.dbUser,
						password: this.dbSettings.dbPass,
						database: this.dbSettings.dbName
					});

				this.connection.on("error", (err) => {
					if (err.code == 'PROTOCOL_CONNECTION_LOST') {
						console.log("CONNECTION -- LOST --:::", err);
						this.connLost = true;
					}
				});
			}

			if (this.connection.state === 'disconnected') {
				this.connection.connect((err, connection) => {
					if (err) {
						L.logErrorMessage("Open MySQL Connection failed");
						throw err;
					}
					else {
						this.connection = connection;
					}
				});
			}
		}
		catch (e) {
			console.log('Fläskballe ::', e);
		}

		return this.connection;
	}

	/**
	 * Initialize transaction
	 * @returns {Promise<MysqlError>}
	 */
	public startTransaction(): Promise<MysqlError> {
		let conn: Connection = this.getConnection();
		return util.promisify(conn.beginTransaction);
	}

	/**
	 * Undo transaction
	 * @returns {Promise<MysqlError>}
	 */
	public rollbackTransaction(): Promise<MysqlError> {
		let conn: Connection = this.getConnection();
		return util.promisify(conn.rollback);
	}

	/**
	 * Save transaction changes to database
	 * @returns {Promise<MysqlError>}
	 */
	public commitTransaction(): Promise<MysqlError> {
		let conn: Connection = this.getConnection();
		return util.promisify(conn.commit);
	}

	/**
	 * Execute SQL query
	 * @param {string} sql
	 * @returns {Promise<IDbResult>}
	 */
	public query(sql: string): Promise<IDbResult> {
		if (this.debug) {
			L.log("Executing Query ::", sql);
			console.profile("Profiling start");
		}

		return new Promise((resolve, reject) => {
			let scope = this;
			let conn: Connection = this.getConnection();
			return conn.query(sql, (error, result, tableFields) => {
				if (error) {
					L.log("dbQuery ERROR ::", error);

					if (error.fatal) {
						console.trace('Fatal error: ' + error.message);
					}

					conn.end();

					resolve(new DbResult(error));
				}
				else {
					return DbResultParser.parseQueryResult(
						error,
						result,
						tableFields
					).then((res) => {

						if (error) {
							// L.error("parseQueryResult ::", error);
							resolve(new DbResult(error));
						}

						return res;

					}).then((res) => {
						conn.end((err?: MysqlError) => {
							L.log('MysqlConn Close Error ::', err);

							if (err) {
								reject(err);
							}
						});

						resolve(res);

					}).catch((err) => {
						conn.end((err?: MysqlError) => {
							L.error('In Catch: End mysqlConnection :: err ::', err);
						});

						resolve(new DbResult(err));
					});
				}
			});
		});
	}

	public describeTable(tableName: string): Promise<IDbResult> {
		return Promise.resolve(undefined);
	}

	/**
	 * Get the primary key from given table
	 * @param {string} tableName
	 * @returns {Promise<ISQLTableField>}
	 */
	public getPrimaryKeyField(tableName: string): Promise<ISQLTableField> {
		return null;
	}
}
