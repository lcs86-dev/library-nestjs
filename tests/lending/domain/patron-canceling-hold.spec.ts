import { BookFixtures } from '@tests/lending/domain/book.fixtures';
import { PatronFixtures } from '@tests/lending/domain/patron.fixtures';
import { isRight } from 'fp-ts/lib/Either';

describe('PatronCancelingHoldTest', () => {
  test('patron should be able to cancel his holds', () => {
    // given
    const forBook = BookFixtures.bookOnHold();
    // and
    const patron = PatronFixtures.regularPatronWithHold(forBook);
    // when
    const cancelHold = patron.cancelHold(forBook);
    // then
    expect(isRight(cancelHold)).toBe(true);
  });

  test('patron cannot cancel not his hold', () => {
    // given
    const forBook = BookFixtures.bookOnHold();
    // and
    const patron = PatronFixtures.GivenRegularPatron();
    // when
    const cancelHold = patron.cancelHold(forBook);
    // then
    expect(isRight(cancelHold)).toBe(false);
  });
});
