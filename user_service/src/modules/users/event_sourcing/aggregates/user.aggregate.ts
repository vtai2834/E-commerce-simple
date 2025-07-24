// user-service/src/users/event_sourcing/aggregate/user.aggregate.ts
import {
    UserEvent,
    UserCreatedEvent,
    UserUpdatedEvent,
    UserDeletedEvent,
    UserRefreshTokenUpdatedEvent,
    UserRefreshTokenRemovedEvent,
    UserProfileUpdatedEvent
} from '../../../auth/event_sourcing/events/user.events';

export interface UserState {
    id: string;
    email: string;
    fullName: string;
    hashedPassword: string;
    refreshToken?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export class UserAggregate {
    private _id: string;
    private _events: UserEvent[] = [];
    private _uncommittedEvents: UserEvent[] = [];
    private _state: UserState;

    constructor(id: string) {
        this._id = id;
        this._state = {
            id,
            email: '',
            fullName: '',
            hashedPassword: '',
            isActive: false,
            isDeleted: false,
            createdAt: new Date(),
        };
    }

    // Business logic methods
    createUser(email: string, fullName: string, hashedPassword: string): void {
        if (this._state.isActive) {
            throw new Error('User already exists');
        }

        const event: UserCreatedEvent = {
            userId: this._id,
            eventType: 'UserCreated',
            email,
            fullName,
            hashedPassword,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    updateUser(email?: string, fullName?: string, hashedPassword?: string): void {
        if (!this._state.isActive || this._state.isDeleted) {
            throw new Error('User does not exist or is deleted');
        }

        const event: UserUpdatedEvent = {
            userId: this._id,
            eventType: 'UserUpdated',
            email,
            fullName,
            hashedPassword,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    updateProfile(fullName?: string, email?: string): void {
        if (!this._state.isActive || this._state.isDeleted) {
            throw new Error('User does not exist or is deleted');
        }

        const event: UserProfileUpdatedEvent = {
            userId: this._id,
            eventType: 'UserProfileUpdated',
            fullName,
            email,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    deleteUser(): void {
        if (!this._state.isActive || this._state.isDeleted) {
            throw new Error('User does not exist or is already deleted');
        }

        const event: UserDeletedEvent = {
            userId: this._id,
            eventType: 'UserDeleted',
            email: this._state.email,
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    updateRefreshToken(email: string, refreshToken: string): void {
        if (!this._state.isActive || this._state.isDeleted) {
            throw new Error('User does not exist or is deleted');
        }

        const event: UserRefreshTokenUpdatedEvent = {
            userId: this._id,
            eventType: 'UserRefreshTokenUpdated',
            email,
            refreshToken,
            timestamp: new Date(),
          };

        this.addEvent(event);
    }

    removeRefreshToken(): void {
        if (!this._state.isActive || this._state.isDeleted) {
            throw new Error('User does not exist or is deleted');
        }

        const event: UserRefreshTokenRemovedEvent = {
            userId: this._id,
            eventType: 'UserRefreshTokenRemoved',
            timestamp: new Date(),
        };

        this.addEvent(event);
    }

    // Event handling
    private addEvent(event: UserEvent): void {
        this.applyEvent(event);
        this._uncommittedEvents.push(event);
    }

    applyEvent(event: UserEvent): void {
        switch (event.eventType) {
            case 'UserCreated':
                this.applyUserCreated(event);
                break;
            case 'UserUpdated':
                this.applyUserUpdated(event);
                break;
            case 'UserDeleted':
                this.applyUserDeleted(event);
                break;
            case 'UserRefreshTokenUpdated':
                this.applyUserRefreshTokenUpdated(event);
                break;
            case 'UserRefreshTokenRemoved':
                this.applyUserRefreshTokenRemoved(event);
                break;
            case 'UserProfileUpdated':
                this.applyUserProfileUpdated(event);
                break;
            default:
                throw new Error(`Unknown event type: ${(event as any).eventType}`);
        }

        this._events.push(event);
    }

    private applyUserCreated(event: UserCreatedEvent): void {
        this._state.email = event.email;
        this._state.fullName = event.fullName;
        this._state.hashedPassword = event.hashedPassword;
        this._state.isActive = true;
        this._state.createdAt = event.timestamp;
    }

    private applyUserUpdated(event: UserUpdatedEvent): void {
        if (event.email) this._state.email = event.email;
        if (event.fullName) this._state.fullName = event.fullName;
        if (event.hashedPassword) this._state.hashedPassword = event.hashedPassword;
        this._state.updatedAt = event.timestamp;
    }

    private applyUserProfileUpdated(event: UserProfileUpdatedEvent): void {
        if (event.fullName) this._state.fullName = event.fullName;
        if (event.email) this._state.email = event.email;
        this._state.updatedAt = event.timestamp;
    }

    private applyUserDeleted(event: UserDeletedEvent): void {
        this._state.isDeleted = true;
        this._state.isActive = false;
        this._state.updatedAt = event.timestamp;
    }

    private applyUserRefreshTokenUpdated(event: UserRefreshTokenUpdatedEvent): void {
        this._state.refreshToken = event.refreshToken;
        this._state.updatedAt = event.timestamp;
        this._state.email = event.email;
    }

    private applyUserRefreshTokenRemoved(event: UserRefreshTokenRemovedEvent): void {
        this._state.refreshToken = undefined;
        this._state.updatedAt = event.timestamp;
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get state(): UserState {
        return { ...this._state };
    }

    get events(): UserEvent[] {
        return [...this._events];
    }

    get uncommittedEvents(): UserEvent[] {
        return [...this._uncommittedEvents];
    }

    // Mark events as committed
    markEventsAsCommitted(): void {
        this._uncommittedEvents = [];
    }
}