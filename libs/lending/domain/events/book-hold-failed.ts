import { PatronEvent } from 'libs/lending/domain/events';
import { Rejection } from 'libs/lending/domain/policies.ts';
import { PatronId } from 'libs/lending/domain/value-objects';

export class BookHoldFailed implements PatronEvent {
  constructor(
    public readonly reason: string,
    public readonly patronId: PatronId
  ) {}

  static bookHoldFailedNow(
    rejection: Rejection,
    patronId: PatronId
  ): BookHoldFailed {
    return new BookHoldFailed(rejection.reason, patronId);
  }
}
