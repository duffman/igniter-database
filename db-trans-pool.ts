/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-06-13
 */

import * as mysql from "mysql";

const pool = mysql.createPool(dbConfig);

export class DbTransPool {

}



module.exports = { pool, connection, query };
