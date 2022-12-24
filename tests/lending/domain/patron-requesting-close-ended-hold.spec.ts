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

  test('patron cannot hold a book for 0 or negative amount of days', () => {
    for (let days = -10; days <= 0; days++) {
      const test = () => {
        const patron = PatronFixtures.GivenRegularPatron();
        const book = fixtures.GivenCirculatingAvailableBook();
        fixtures.WhenRequestingCloseEndedHold(
          patron,
          book,
          HoldDuration.closeEnded(NumberOfDays.of(days))
        );
      };
      expect(test).toThrow();
    }
  });

  test('patron cannot hold more books then it is allowed', () => {
    const patron = fixtures.GivenPatronWithManyHolds();
    const book = fixtures.GivenCirculatingAvailableBook();
    const result = fixtures.WhenRequestingCloseEndedHold(
      patron,
      book,
      HoldDuration.closeEnded(NumberOfDays.of(1))
    );
    fixtures.ThenItFailed(result);
  });
});
