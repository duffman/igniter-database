/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * February 2019
 */

import { MysqlError }     from "mysql";
import { PoolConnection } from "mysql";
import { L }              from "./db-logger";
import { IDbSettings }    from "./db-settings";
import { injectable }     from "inversify";
import * as mysql         from "mysql";
import { Connection }     from "mysql";

export interface IDBPool {
}

@injectable()
export class DBPool implements IDBPool {
	pool: Map<number, Connection>;
	dbPool: mysql.Pool;

	constructor() {
		this.pool = new Map<number, Connection>();
	}

	private removeConnection(id: number): boolean {
		let result = false;
		return result;
	}

	private addConnection(id: number, conn: Connection): boolean {
		let result = false;

		if (!this.pool.has(id)) {
			this.pool.set(id, conn);
			result = true;
		}

		return result;
	}

	public connection() {
		return new Promise((resolve, reject) => {
			this.dbPool.getConnection((err: MysqlError, connection: PoolConnection) => {
				if (err) reject(err);
				console.log("MySQL pool connected: threadId " + connection.threadId);
				const query = (sql, binding) => {
					return new Promise((resolve, reject) => {
						connection.query(sql, binding, (err, result) => {
							if (err) reject(err);
							resolve(result);
						});
					});
				};
				const release = () => {
					return new Promise((resolve, reject) => {
						if (err) reject(err);
						console.log("MySQL pool released: threadId " + connection.threadId);
						resolve(connection.release());
					});
				};
				resolve({ query, release });
			});
		});
	};

	public query(sql, binding): Promise<any> {
		return new Promise((resolve, reject) => {
			this.dbPool.query(sql, binding, (err, result, fields) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	};



	public getPoolConnection(threadId?: number, settings?: IDbSettings): Promise<Connection> {
		return new Promise((resolve, reject) => {
			let connection = mysql.createConnection(
				{
					host:     settings.dbHost,
					user:     settings.dbUser,
					password: settings.dbPass,
					database: settings.dbName
				});

			connection.on("error", (err) => {
				if (err.code == 'PROTOCOL_CONNECTION_LOST') {
					console.log("CONNECTION -- LOST --:::", err);
				}
			});

			if (connection.state === 'disconnected') {
				connection.connect((err, connection) => {
					if (err) {
						L.logErrorMessage("Open MySQL Connection failed");
						throw err;
					}
					else {
						resolve(connection);
					}
				});
			}
		});
	}
}
