import { Scope, UserStatus } from './entity';

export interface SessionInfo {
    userId: string;
    admin?: any;
    scopes: Scope[];
    status: UserStatus;
    host: string;
    timezone: string;
    organizationId?: string;
}
