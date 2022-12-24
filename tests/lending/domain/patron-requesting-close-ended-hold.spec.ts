import {
  AvailableBook,
  BookHoldFailed,
  BookPlacedOnHoldEvents,
  DateVO,
  HoldDuration,
  NumberOfDays,
  Patron,
} from '@libs/lending/domain';
import { PatronFixtures } from '@tests/lending/domain/patron.fixtures';
import { right } from 'fp-ts/Either';
import { Either } from 'fp-ts/lib/Either';

class Fixtures {
  private constructor() {
    // use init
  }
  static init(): Fixtures {
    jest.useFakeTimers().setSystemTime(new Date('2021-01-01').getTime());
    return new Fixtures();
  }
  GivenPatronWithManyHolds(): Patron {
    return PatronFixtures.regularPatronWithHolds(5);
  }

  GivenAnyPatron(): Patron[] {
    return [
      PatronFixtures.GivenRegularPatron(),
      PatronFixtures.GivenResearcherPatron(),
    ];
  }

  GivenCirculatingAvailableBook =
    PatronFixtures.GivenCirculatingAvailableBook.bind(this);

  ThenBookShouldBePlacedOnHoldTillDate(
    result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
  ): void {
    expect(result).toMatchObject(
      right(
        expect.objectContaining({
          bookPlacedOnHold: expect.objectContaining({
            till: DateVO.now().addDays(3),
          }),
        })
      )
    );
  }

  ThenItFailed(result: Either<BookHoldFailed, BookPlacedOnHoldEvents>): void {
    expect(result).toMatchObject({ _tag: 'Left' }); // @ToDo
  }

  WhenRequestingCloseEndedHold(
    patron: Patron,
    book: AvailableBook,
    duration: HoldDuration
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnCloseEndedHold(book, duration);
  }
}

describe('PatronRequestingCloseEndedHold', () => {
  const fixtures = Fixtures.init();
  test('any patron can request close ended hold', () => {
    fixtures.GivenAnyPatron().forEach((patron) => {
      const book = fixtures.GivenCirculatingAvailableBook();
      const result = fixtures.WhenRequestingCloseEndedHold(
        patron,
        book,
        HoldDuration.closeEnded(NumberOfDays.of(3))
      );
      fixtures.ThenBookShouldBePlacedOnHoldTillDate(result);
    });
  });
});
