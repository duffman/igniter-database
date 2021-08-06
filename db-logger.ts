/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { IDbResult } from "./db-result";
let chalk = require("chalk");
const log = console.log;

export class dc {
	public static l(message: string, data: any = null) {
		L.log(message, data);
	}

	public static g(logMessage: string, logData: any = null) {
		if (logData) {
			log(chalk.greenBright(logMessage), chalk.greenBright(logData));
		} else {
			log(chalk.greenBright(logMessage));
		}
	}

	public static r(logMessage: string, logData: any = null) {
		log(chalk.redBright(logMessage + '::'), chalk.redBright(logData));
	}

	public static y(logMessage: string, logData: any = "") {
		log(chalk.yellow(logMessage), logData);
	}

	public static c(logMessage: string, logData: any = "") {
		log(chalk.cyan(logMessage), logData);
	}
}

export class L {
	public static log(message: string, data: any = null) {
		L.logMessage(message, data);
	}

	// Log unset Variable
	public static logUVE(varData: any, message): void {
		if (!varData) {
			L.error(message, varData);
		}
	}
	// --- //

	public static logDbResult(res: IDbResult, message?: string, logRows?: boolean): void {
		const resMessage = `Success: ${res.success}, Affected Rows: ${res.affectedRows}, Result Row Count: ${res.rowCount}`;
		if (message) {
			L.logMessage(message, resMessage);
		}
		else {
			L.logMessage(resMessage);
		}

		if (logRows) {
			for (let row of res.result.dataRows) {
				L.log('row ::', row);
			}
		}
	}

	public static logMessage(message: string, data: any = null): void {
		if (!data) {
			log(message);
		}
		else {
			log(message, data);
		}
	}

	public static logErrorMessage(errorMessage: string, error?: Error): void {
		if (error) {
			log('ERROR :: ' + errorMessage, errorMessage);
		}
		else {
			log(errorMessage, errorMessage);
		}
	}

	public static error(errorMessage: string, error: Error = null): void {
		L.logErrorMessage(errorMessage, error);
	}
}
