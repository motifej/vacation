import * as users from './users.consts';

export const ADMIN = [users.ADMIN];
export const ANONIM = [users.ANONIM];
export const MANAGER = [users.MANAGER];
export const USER = [users.ADMIN, users.USER, users.MANAGER];
export const PUBLIC = [users.ADMIN, users.USER, users.MANAGER, users.ANONIM];