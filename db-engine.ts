/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { injectable }     from "inversify";
import * as mysql         from "mysql";
import { MysqlError }     from "mysql";
import { Connection }     from "mysql";
import { L }              from "./db-logger";
import { DbResult }       from "./db-result";
import { IDbResult }      from "./db-result";
import { DbResultParser } from "./db-result-parser";
import { IDbSettings }    from "./db-settings";

const util = require("util");

export interface IDbEngine {
	configure(settings: IDbSettings): void;
	getConnection(settings?: IDbSettings): Connection;
	startTransaction(): Promise<MysqlError>;
	rollbackTransaction(): Promise<MysqlError>;
	commitTransaction(): Promise<MysqlError>;
	runQuery(sql: string): Promise<IDbResult>;
}

@injectable()
export class DbEngine implements IDbEngine {
	private dbSettings: IDbSettings;
	private connLost: boolean = false;
	public debug: boolean     = true;
	public lastError: Error;

	connection: Connection = null;

	constructor() {}

	/**
	 * Assign server connection settings
	 * @param {IDbSettings} settings
	 */
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
				L.logErrorMessage("DbEngine :: getConnection :: MySQL not initialized - Settings missing!");
				return null;
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
		catch (ex) {
			console.log("DbEngine :: getConnection ::", ex);
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

	public startTransaction2(): Promise<Connection> {
		return new Promise((resolve, reject) => {
			let conn: Connection = this.getConnection();
			let trans = conn.beginTransaction;
			resolve(conn);
		});
	}

	/**
	 * Undo transaction
	 * @returns {Promise<MysqlError>}
	 */
	public rollbackTransaction(conn?: Connection): Promise<MysqlError> {
		conn = !conn ? this.getConnection() : conn;
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
	 * @param transConn
	 * @returns {Promise<IDbResult>}
	 */
	public runQuery(sql: string, transConn?: Connection): Promise<IDbResult> {
		let scope = this;

		if (this.debug) {
			L.log("Executing Query ::", sql);
			console.profile("Profiling start");
		}

		return new Promise((resolve, reject) => {
			let qConn = !transConn ? this.getConnection() : transConn;

			return qConn.query(sql, (error, result, tableFields) => {
				try {
					if (error) {
						L.log("dbQuery ERROR ::", error);

						if (error.fatal) {
							console.trace('Fatal error: ' + error.message);
						}

						//conn.end();

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
							scope.connection.end((err?: MysqlError) => {
								L.log('MysqlConn Close Error ::', err);

								if (err) {
									reject(err);
								}
							});

							resolve(res);

						}).catch((err) => {
							scope.connection.end((err?: MysqlError) => {
								L.error('In Catch: End mysqlConnection :: err ::', err);
							});

							resolve(new DbResult(err));
						});
					}

				}
				catch (err) {
					console.log("FET FIA ::", err);
				}

			});
		});
	}
}
