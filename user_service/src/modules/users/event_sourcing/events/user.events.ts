
// export interface IUserEvent {
//     userId: string;
//     timestamp: Date;
//     eventType: string;
// }

// export interface UserCreatedEvent extends IUserEvent {
//     eventType: 'UserCreated';
//     email: string;
//     fullName: string;
//     hashedPassword: string;
// }

// export interface UserUpdatedEvent extends IUserEvent {
//     eventType: 'UserUpdated';
//     email?: string;
//     fullName?: string;
//     hashedPassword?: string;
// }

// export interface UserDeletedEvent extends IUserEvent {
//     eventType: 'UserDeleted';
//     email: string;
// }

// export interface UserRefreshTokenUpdatedEvent extends IUserEvent {
//     eventType: 'UserRefreshTokenUpdated';
//     refreshToken: string;
// }

// export interface UserRefreshTokenRemovedEvent extends IUserEvent {
//     eventType: 'UserRefreshTokenRemoved';
// }

// export interface UserProfileUpdatedEvent extends IUserEvent {
//     eventType: 'UserProfileUpdated';
//     fullName?: string;
//     email?: string;
// }

// export type UserEvent =
//     | UserCreatedEvent
//     | UserUpdatedEvent
//     | UserDeletedEvent
//     | UserRefreshTokenUpdatedEvent
//     | UserRefreshTokenRemovedEvent
//     | UserProfileUpdatedEvent;