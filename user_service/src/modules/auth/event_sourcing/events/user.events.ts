export interface IUserEvent {
    userId: string;
    timestamp: Date;
    eventType: string;
}

export interface UserRegisteredEvent extends IUserEvent {
    eventType: 'UserRegistered';
    email: string;
    fullName: string;
    hashedPassword: string;
}

export interface UserLoggedInEvent extends IUserEvent {
    eventType: 'UserLoggedIn';
    email: string;
    refreshToken: string;
}

export interface UserLoggedOutEvent extends IUserEvent {
    eventType: 'UserLoggedOut';
    email: string;
}

export interface UserPasswordChangedEvent extends IUserEvent {
    eventType: 'UserPasswordChanged';
    email: string;
    newHashedPassword: string;
}

export interface UserRefreshTokenUpdatedEvent extends IUserEvent {
    eventType: 'UserRefreshTokenUpdated';
    email: string;
    refreshToken: string;
}

// -------
// User event:
export interface UserCreatedEvent extends IUserEvent {
    eventType: 'UserCreated';
    email: string;
    fullName: string;
    hashedPassword: string;
}

export interface UserUpdatedEvent extends IUserEvent {
    eventType: 'UserUpdated';
    email?: string;
    fullName?: string;
    hashedPassword?: string;
}

export interface UserDeletedEvent extends IUserEvent {
    eventType: 'UserDeleted';
    email: string;
}

export interface UserRefreshTokenRemovedEvent extends IUserEvent {
    eventType: 'UserRefreshTokenRemoved';
}

export interface UserProfileUpdatedEvent extends IUserEvent {
    eventType: 'UserProfileUpdated';
    fullName?: string;
    email?: string;
}

export type UserEvent =
    | UserRegisteredEvent
    | UserLoggedInEvent
    | UserLoggedOutEvent
    | UserPasswordChangedEvent
    | UserRefreshTokenUpdatedEvent
    | UserCreatedEvent
    | UserUpdatedEvent
    | UserDeletedEvent
    | UserRefreshTokenRemovedEvent
    | UserProfileUpdatedEvent;