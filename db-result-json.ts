/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { SQLTableRows } from "./types/db-types";
import { StringCasing } from "./utils/casing-type";

export class DbResultJson {
	public result: any = {};

	constructor(private dataRows?: SQLTableRows) {
		this.result = {};
		this.transformToObj();
	}

	/**
	 * Create JSON object with "_" underscored field names
	 * renamed to lowerPascalCasing
	 */
	private transformToObj() {
		if (!this.dataRows || this.dataRows.length === 0) {
			return;
		}

		let result = new Array<any>();

		for (let row of this.dataRows) {
			let obj: any = {};

			for (let col of row.fields) {
				let camelKey = StringCasing.snakeToPascalCase(
					col.name,
					true
				);

				obj[camelKey] = col.value;
			}

			result.push(obj);
		}

		if (result.length === 1) {
			this.result = result[0];
		}
	}

	public getJsonStr(): string {
		return JSON.stringify(this.result);
	}
}
