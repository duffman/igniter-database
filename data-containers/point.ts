/**
 * Copyright (C) 1998-2020 Patrik Forsberg <patrik.forsberg@coldmind.com>
 * All Rights Reserved, Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

export interface IPoint {
	x: number;
	y: number;
	z: number;
}

export class Point implements IPoint {
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0
	) {}
}
