import { BookPlacedOnHold } from 'libs/lending/domain/events/book-placed-on-hold';
import { MaximumNumberOhHoldsReached } from 'libs/lending/domain/events/maximum-number-on-holds-reached';
import { PatronEvent } from 'libs/lending/domain/events/patron-event';
import { PatronId } from 'libs/lending/domain/value-objects';

export class BookPlacedOnHoldEvents implements PatronEvent {
  private constructor(
    public readonly patronId: PatronId,
    public readonly bookPlacedOnHold: BookPlacedOnHold,
    public readonly maximumNumberOhHoldsReached?: MaximumNumberOhHoldsReached
  ) {}

  static event(
    patronId: PatronId,
    bookPlacedOnHold: BookPlacedOnHold
  ): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(patronId, bookPlacedOnHold);
  }

  static events(
    patronId: PatronId,
    bookPlacedOnHold: BookPlacedOnHold,
    maximumNumberOhHoldsReached: MaximumNumberOhHoldsReached
  ): BookPlacedOnHoldEvents {
    return new BookPlacedOnHoldEvents(
      patronId,
      bookPlacedOnHold,
      maximumNumberOhHoldsReached
    );
  }
}
