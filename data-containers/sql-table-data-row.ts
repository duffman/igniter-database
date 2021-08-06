/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { L }              from "../db-logger";
import { Point }          from "./point";
import { DbVarUtils }     from '../utils/var-utils';
import { ISQLTableField } from "./sql-table-field";
import { SQLTableField }  from "./sql-table-field";

export interface ISQLTableDataRow {
	isEmpty: boolean;
	obj: any;
	fields: Array<ISQLTableField>;

	parseData(obj: any): void;
	addField(key: string, value: any);
	getField(key: string): ISQLTableField
	count(): number;
	nullValue(key: string): void;
	asStr(key: string): string;
	asPoint(key: string): Point;
	asDate(key: string): Date;
	asNum(key: string): number;
	asInt(key: string): number;
	asBool(key: string): boolean;
	asJson(): string;
}

export class SQLTableDataRow implements ISQLTableDataRow {
	public isEmpty: boolean = false;
	public obj: any;
	public fields: Array<ISQLTableField>;

	constructor(obj?: any) {
		this.fields = new Array<ISQLTableField>();
		if (!DbVarUtils.isDefined(obj)) {
			this.parseData(obj);
		}
	}

	/**
	 * Parse table field data
	 * @param obj
	 */
	public parseData(obj: any): void {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				this.addField(key, obj[key]);
			}
		}
	}

	/**
	 * Create new field
	 * @param key
	 * @param value
	 */
	public addField(key: string, value: any) {
		this.fields.push(new SQLTableField(key, value));
	}

	/**
	 * Return Column by field
	 * @param {string} key
	 * @returns {ISQLTableField}
	 */
	public getField(key: string): ISQLTableField {
		let result: ISQLTableField = null;
		for (let field of this.fields) {
			if (field.name === key) {
				result = field;
				break;
			}
		}

		return result;
	}

	/**
	 * Return the number of columns
	 * @returns {number}
	 */
	public count(): number {
		return this.fields.length;
	}

	/**
	 * Set Value to Null
	 * @param {string} key
	 */
	public nullValue(key: string): void {
		let column = this.getField(key);
		if (column != null) {
			column.value = null;
		}
	}

	/**
	 * Return column value as String
	 * @param {string} key
	 * @returns {string}
	 */
	public asStr(key: string): string {
		let column = this.getField(key);
		return column != null ? column.value : null;
	}

	/**
	 * Return column value as Point
	 * @param {string} key
	 * @returns {Point}
	 */
	public asPoint(key: string): Point {
		let column = this.getField(key);
		let res    = column != null ? column.value : null;

		return new Point(0, 0);
	}

	/**
	 * Return column value as Number
	 * @param {string} key
	 * @returns {number}
	 */
	public asNum(key: string): number {
		let value = this.asStr(key);
		if (value != null) {
			return parseInt(value)
		}

		return -1;
	}

	/**
	 * Makes an optimistic attempt to parse a JS date from given string
	 * @param {string} key
	 * @returns {Date}
	 */
	public asDate(key: string): Date {
		return new Date(key);
	}

	/**
	 * Return the column value as Number
	 * @param {string} key
	 * @returns {number}
	 */
	public asInt(key: string): number {
		return this.asNum(key);
	}

	/**
	 * Return the column value as Boolean
	 * @param {string} key
	 * @returns {number}
	 */
	public asBool(key: string): boolean {
		let result: boolean = false;

		try {
			let val = this.getField(key);
			result  = ( Number.parseInt(val.value) === 1 );
		}
		catch (err) {
			L.logErrorMessage('getValAsBool ::', err)
			result = false;
		}

		return result;
	}

	/**
	 * Return a JSON representation of the table data
	 * @returns {string}
	 */
	public asJson(): string {
		let data = this.fields != null ? this.fields : "NULL";
		return JSON.stringify(data);
	}
}
