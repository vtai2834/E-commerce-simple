import {
    UserEvent,
    UserRegisteredEvent,
    UserLoggedInEvent,
    UserLoggedOutEvent,
    UserPasswordChangedEvent,
    UserRefreshTokenUpdatedEvent
  } from '../events/user.events';

export interface UserState {
  id: string;
  email: string;
  fullName: string;
  hashedPassword: string;
  refreshToken?: string;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
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
      createdAt: new Date(),
    };
  }

  // Business logic methods
  register(email: string, fullName: string, hashedPassword: string): void {
    if (this._state.isActive) {
      throw new Error('User is already registered');
    }

    const event: UserRegisteredEvent = {
      userId: this._id,
      eventType: 'UserRegistered',
      email,
      fullName,
      hashedPassword,
      timestamp: new Date(),
    };

    this.addEvent(event);
  }

  login(email: string, refreshToken: string): void {
    if (!this._state.isActive) {
      throw new Error('User is not registered');
    }

    const event: UserLoggedInEvent = {
      userId: this._id,
      eventType: 'UserLoggedIn',
      email,
      refreshToken,
      timestamp: new Date(),
    };

    this.addEvent(event);
  }

  logout(email: string): void {
    if (!this._state.isActive) {
      throw new Error('User is not registered');
    }

    const event: UserLoggedOutEvent = {
      userId: this._id,
      eventType: 'UserLoggedOut',
      email,
      timestamp: new Date(),
    };

    this.addEvent(event);
  }

  updateRefreshToken(email: string, refreshToken: string): void {
    if (!this._state.isActive) {
      throw new Error('User is not registered');
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

  // Event handling
  private addEvent(event: UserEvent): void {
    this.applyEvent(event);
    this._uncommittedEvents.push(event);
  }

  applyEvent(event: UserEvent): void {
    switch (event.eventType) {
      case 'UserRegistered':
        this.applyUserRegistered(event);
        break;
      case 'UserLoggedIn':
        this.applyUserLoggedIn(event);
        break;
      case 'UserLoggedOut':
        this.applyUserLoggedOut(event);
        break;
      case 'UserRefreshTokenUpdated':
        this.applyUserRefreshTokenUpdated(event);
        break;
      default:
        throw new Error(`Unknown event type: ${(event as any).eventType}`);
    }

    this._events.push(event);
  }

  private applyUserRegistered(event: UserRegisteredEvent): void {
    this._state.email = event.email;
    this._state.fullName = event.fullName;
    this._state.hashedPassword = event.hashedPassword;
    this._state.isActive = true;
    this._state.createdAt = event.timestamp;
  }

  private applyUserLoggedIn(event: UserLoggedInEvent): void {
    this._state.refreshToken = event.refreshToken;
    this._state.lastLoginAt = event.timestamp;
  }

  private applyUserLoggedOut(event: UserLoggedOutEvent): void {
    this._state.refreshToken = undefined;
  }

  private applyUserRefreshTokenUpdated(event: UserRefreshTokenUpdatedEvent): void {
    this._state.refreshToken = event.refreshToken;
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