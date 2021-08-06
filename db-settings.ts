/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * 2020-05-14
 */

export interface IDbSettings {
	dbType: string;
	dbName: string;
	dbHost: string;
	dbUser: string;
	dbPass: string;
	connectionLimit?: number;
}
