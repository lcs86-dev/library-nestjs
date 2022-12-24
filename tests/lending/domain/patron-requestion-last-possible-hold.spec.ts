import {
  AvailableBook,
  BookHoldFailed,
  BookPlacedOnHoldEvents,
  HoldDuration,
  NumberOfDays,
  Patron,
} from '@libs/lending/domain';
import { MaximumNumberOhHoldsReached } from '@libs/lending/domain/events/maximum-number-on-holds-reached';
import { PatronFixtures } from '@tests/lending/domain/patron.fixtures';
import { Either } from 'fp-ts/lib/Either';

class Fixtures {
  static GivenCirculatingAvailableBook =
    PatronFixtures.GivenCirculatingAvailableBook;
  static GivenRegularPatronWithLastPossibleHold(): Patron {
    return PatronFixtures.regularPatronWithHolds(4);
  }
  static WhenRequestingLastPossibleHold(
    patron: Patron,
    book: AvailableBook
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnCloseEndedHold(
      book,
      HoldDuration.closeEnded(NumberOfDays.of(3))
    );
  }
  static ThenAnnounceLastPossibleHold(
    result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
  ) {
    expect(result).toMatchObject(
      expect.objectContaining({
        right: expect.objectContaining({
          maximumNumberOhHoldsReached: new MaximumNumberOhHoldsReached(),
        }),
      })
    );
  }
}

it('should announce that a regular patron places his last possible hold (4th)', () => {
  const book = Fixtures.GivenCirculatingAvailableBook();
  const patron = Fixtures.GivenRegularPatronWithLastPossibleHold();
  const result = Fixtures.WhenRequestingLastPossibleHold(patron, book);
  Fixtures.ThenAnnounceLastPossibleHold(result);
});
