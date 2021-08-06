/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-06-16
 *
 * Description **
 * Result from an insert, update, or delete statement.
 *
 */
import { matchObjectProps } from "../utils/prop-match";

export interface IOkPacket {
	fieldCount: number;
	/**
	 * The number of affected rows from an insert, update,
	 * or delete statement.
	 */
	affectedRows: number;
	/**
	 * The insert id after inserting a row into a table with
	 * an auto increment primary key.
	 */
	insertId: number;
	serverStatus?: number;
	warningCount?: number;
	/**
	 * The server result message from an insert, update, or delete statement.
	 */
	message: string;
	/**
	 * The number of changed rows from an update statement. "changedRows"
	 * differs from "affectedRows" in that it does not count updated rows
	 * whose values were not changed.
	 */
	changedRows: number;
	protocol41: boolean;
}

export class MySqlOkPacket {
	public static toPacket(json: string): IOkPacket {
		return JSON.parse(json);
	}

	public static toJson(value: IOkPacket): string {
		return JSON.stringify(value);
	}

	public static validate(packet: any): boolean {
		let okPacketProps = [
			'fieldCount',
			'affectedRows',
			'insertId',
			'serverStatus',
			'warningCount',
			'message',
			'protocol41',
			'changedRows'
		];

		return matchObjectProps(packet, okPacketProps);
	}
}
