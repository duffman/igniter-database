"use strict";
/**
 * Copyright (C) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const db_logger_1 = require("../db-logger");
const row_data_packet_1 = require("../row-data-packet");
const sql_table_field_1 = require("./sql-table-field");
const db_types_1 = require("../db-types");
const sql_table_data_row_1 = require("./sql-table-data-row");
class SQLTableData {
    constructor() {
        this.fields = new Array();
        this.fieldTypes = {};
        this.dataRows = Array();
    }
    rowCount() {
        return this.dataRows != null ? this.dataRows.length : 0;
    }
    // TODO:: Replace this one with the sucker below
    parseFields(fields) {
        for (let index in fields) {
            let obj = fields[index];
            let name = "";
            let type = "";
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
    parseFields2(fields) {
        function parseProps(obj, fieldTypes) {
            let name = "";
            let type = "";
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
    addRow() {
        let newRow = new sql_table_data_row_1.SQLTableDataRow();
        this.dataRows.push(newRow);
        return newRow;
    }
    pushRow(row) {
        this.dataRows.push(row);
    }
    /**
     * Returns the first row in result
     * @param safe - if set to true a non null result is  guaranteed
     * @returns {DbTableDataRow}
     */
    safeGetFirstRow() {
        let result = this.dataRows[0];
        if (result == null) {
            result = new sql_table_data_row_1.SQLTableDataRow();
        }
        return result;
    }
    /**
     * Return the first row of the result set
     * @returns {ISQLTableDataRow}
     */
    getFirstRow() {
        return (this.dataRows && this.dataRows.length > 0) ? this.dataRows[0] : null;
    }
    parseRowCollection(dataRows) {
        const scope = this;
        function parseRow(dataRow, dbDataRow) {
            for (let cell in dataRow) {
                if (dataRow.hasOwnProperty(cell)) {
                    let rowObj = dataRow[cell];
                    let field = new sql_table_field_1.SQLTableField(cell, rowObj);
                    dbDataRow.columns.push(field);
                }
            }
        }
        for (let i = 0; i < dataRows.length; i++) {
            let row = dataRows[i];
            //let dbDataRow  = this.addRow();
            let isMetaData = true; // Is this a result from a DESC TABLE?
            try {
                if (row.Default === null) {
                    row.Default = undefined;
                }
                let fieldJson = JSON.stringify(row);
                const fieldPacket = row_data_packet_1.RowDataPacketConverter.toIRowDataPacket(fieldJson);
                let field = new sql_table_field_1.SQLTableField(fieldPacket.field);
                field.fieldType = db_types_1.FieldType[fieldPacket.type];
                field.isPrimary = (fieldPacket.key === 'PRI');
                field.isIndexed = (field.isPrimary || (fieldPacket.key in ['PRI', 'MUL']));
                //dbDataRow.columns.push(field);
                //console.log('-- FIELD ::', field);
                //console.log('-- DATA ROW ::', dbDataRow);
                this.fields.push(field);
            }
            catch (ex) {
                db_logger_1.L.error('RowDataPacketConverter :: EXCEPTION ::', ex);
                isMetaData = false;
            }
            console.log('IS META DATA ::', isMetaData);
            if (!isMetaData) {
                // parseRow(row, dbDataRow);
                parseRow(row, this.addRow());
            }
        }
    }
    parseResultSet(dataRows, dataFields) {
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
    getPrimaryField() {
        let result = null;
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
    toString() {
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
exports.SQLTableData = SQLTableData;
