/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { L }                      from "../db-logger";
import { RowDataPacketConverter } from "../types/row-data-packet";
import { ISQLTableField }         from "./sql-table-field";
import { SQLTableField }          from "./sql-table-field";
import { FieldType }              from "../types/db-types";
import { SQLTableRows }           from "../types/db-types";
import { SQLTableDataRow }        from "./sql-table-data-row";
import { ISQLTableDataRow }       from "./sql-table-data-row";

export type DbFieldTypes = {[name: string]: number;};

export interface ISQLTableData {
	tableName?: string;
	fields: Array<ISQLTableField>;
	fieldTypes: DbFieldTypes;
	dataRows: ISQLTableDataRow[];
	haveFieldName(name: string): boolean;
	rowCount(): number;
	safeGetFirstRow(): ISQLTableDataRow;
	getFirstRow(): ISQLTableDataRow;
	getPrimaryField(): ISQLTableField;
	toString(): string;
}

export class SQLTableData implements ISQLTableData {
	public fields = new Array<ISQLTableField>();
	public fieldTypes: {[name: string]: number;} = {};
	public dataRows: SQLTableRows;

	constructor() {
		this.dataRows = Array<ISQLTableDataRow>();
		this.fields   = new Array<ISQLTableField>();
	}

	public rowCount(): number {
		return this.dataRows != null ? this.dataRows.length : 0;
	}

	public haveFieldName(name: string): boolean {
		let result = false;
		for (let field of this.fields) {
			if (field.name == name) {
				result = true;
				break;
			}
		}
		return result;
	}

	// TODO:: Replace this one with the sucker below
	public parseFields(fields: any): void {
		for (let index in fields) {
			let obj: any = fields[index];

			let name: string = "";
			let type: string = "";

			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (prop === "name") {
						name = obj[prop];
					}
					if (prop === "type") {
						type = obj[prop];
					}
				}
			}

			this.fieldTypes[name] = Number(type);
		}
	}

	public _parseFields2(fields: any) {
		function parseProps(obj: any, fieldTypes: DbFieldTypes) {
			let name: string = "";
			let type: string = "";

			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (prop === "name") {
						name = obj[prop];
					}
					if (prop === "type") {
						type = obj[prop];
					}
				}
			}

			fieldTypes[name] = Number(type);
		}

		for (let index in fields) {
			if (fields.hasOwnProperty(fields[index])) {
				parseProps(fields[index], this.fieldTypes);
			}
		}
	}

	public addRow(): ISQLTableDataRow {
		let newRow = new SQLTableDataRow();
		this.dataRows.push(newRow);
		return newRow;
	}

	public pushRow(row: ISQLTableDataRow): void {
		this.dataRows.push(row);
	}

	/**
	 * Returns the first row in result
	 * @param safe - if set to true a non null result is  guaranteed
	 * @returns {DbTableDataRow}
	 */
	public safeGetFirstRow(): ISQLTableDataRow {
		let result = this.dataRows[0];

		if (result == null) {
			result = new SQLTableDataRow();
		}

		return result;
	}

	/**
	 * Return the first row of the result set
	 * @returns {ISQLTableDataRow}
	 */
	public getFirstRow(): ISQLTableDataRow {
		return ( this.dataRows && this.dataRows.length > 0 ) ? this.dataRows[0] : null;
	}

	private parseRowCollection(dataRows: any) {
		const scope = this;

		function parseRow(dataRow: any, dbDataRow: SQLTableDataRow) {
			for (let cell in dataRow) {
				if (dataRow.hasOwnProperty(cell)) {
					let rowObj = dataRow[cell];
					let field  = new SQLTableField(cell, rowObj);
					dbDataRow.fields.push(field);
				}
			}
		}

		for (let i = 0; i < dataRows.length; i++) {
			let row        = dataRows[i];
			let isMetaData = true; // Is this a result from a DESC TABLE?

			try {
				if (row.Default === null) {
					row.Default = undefined;
				}

				let fieldJson     = JSON.stringify(row);
				const fieldPacket = RowDataPacketConverter.toIRowDataPacket(fieldJson);

				let field       = new SQLTableField(fieldPacket.field);
				field.fieldType = FieldType[fieldPacket.type];
				field.isPrimary = ( fieldPacket.key === 'PRI' );
				field.isIndexed = ( field.isPrimary || ( fieldPacket.key.toLowerCase() in ['pri', 'mul'] ) );
				field.nullable  = ( fieldPacket.null && fieldPacket.null.toLowerCase() === 'yes' ) || false;

				if (fieldPacket.extra && fieldPacket.extra.toLowerCase() === 'auto_increment') {
					field.autoInc = true;
				}

				this.fields.push(field);
			}
			catch (ex) {
				L.error('RowDataPacketConverter :: EXCEPTION ::', ex);
				isMetaData = false;
			}

			if (!isMetaData) {
				parseRow(row, this.addRow());
			}
		}
	}

	public parseResultSet(dataRows: any, dataFields: any): Promise<SQLTableData> {
		return new Promise((resolve, reject) => {
			try {
				this.parseFields(dataFields);
				this.parseRowCollection(dataRows);
			}
			catch (ex) {
				reject(ex);
			}

			resolve(this);
		});
	}

	/**
	 * Retrieve the primary key field (if any)mm
	 * @returns {ISQLTableField}
	 */
	public getPrimaryField(): ISQLTableField {
		let result: ISQLTableField = null;

		for (let field of this.fields) {
			if (field.isPrimary) {
				result = field;
			}
		}

		return result;
	}

	/**
	 * Generate a string representation of the data table
	 * @returns {string}
	 */
	public toString(): string {
		let result = "";

		let types = this.fieldTypes;

		for (let prop in types) {
			if (types.hasOwnProperty(prop)) {

				console.log('toString :: prop ::', prop);

				/*
				if (prop === "field") {
					field = types[prop];
				}
				if (prop === "fieldType") {
					fieldType = types[prop];
				}
			 	*/
			}
		}

		/*
		 for (var r in this.rows) {
		 for (var value1 in r.columns) {
		 result += value1.key + ": " + value1.value + "\n";
		 }
		 result += "-----------------\n";
		 }
		 */

		return result;
	}
}
