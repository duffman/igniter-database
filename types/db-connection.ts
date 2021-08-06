/**
 * Copyright (c) 2020 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 * 2020-06-17
 */

export enum ConnectionState {
	Connected     = 'connected',
	Authenticated = 'authenticated',
	Disconnected  = 'disconnected',
	ProtocolError = 'protocol_error'
}

export class DbConnection {
	constructor() {}
}
