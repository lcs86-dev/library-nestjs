import {
  AvailableBook,
  BookHoldFailed,
  BookPlacedOnHold,
  BookPlacedOnHoldEvents,
  Patron,
} from '@libs/lending/domain';
import { PatronFixtures } from '@tests/lending/domain/patron.fixtures';
import { Either, right } from 'fp-ts/lib/Either';

class Fixtures {
  ThenCantDoThis(result: Either<BookHoldFailed, BookPlacedOnHoldEvents>) {
    expect(result).toMatchObject({ _tag: 'Left' }); // @ToDo
  }
  ThenTheBookIsOnHold(
    result: Either<BookHoldFailed, BookPlacedOnHoldEvents>
  ): void {
    expect(result).toMatchObject(
      right(
        expect.objectContaining({
          bookPlacedOnHold: expect.any(BookPlacedOnHold),
        })
      )
    );
  }
  WhenRequestingOpenEndedHold(
    patron: Patron,
    book: AvailableBook
  ): Either<BookHoldFailed, BookPlacedOnHoldEvents> {
    return patron.placeOnOpenEndedHold(book);
  }
}

describe('PatronReqeustingOpenEndedHold', () => {
  const fixtures = new Fixtures();

  it('researcher patron can request close ended hold', () => {
    const book = PatronFixtures.GivenCirculatingAvailableBook();
    const researcherPatron = PatronFixtures.GivenResearcherPatron();
    const result = fixtures.WhenRequestingOpenEndedHold(researcherPatron, book);
    fixtures.ThenTheBookIsOnHold(result);
  });

  it('regular patron cannot request open ended hold', () => {
    const book = PatronFixtures.GivenCirculatingAvailableBook();
    const regularPatron = PatronFixtures.GivenRegularPatron();
    const result = fixtures.WhenRequestingOpenEndedHold(regularPatron, book);
    fixtures.ThenCantDoThis(result);
  });
});
