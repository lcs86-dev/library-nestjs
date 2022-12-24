import { FindAvailableBook } from '@libs/lending/application/place-on-hold/find-available-book';
import { PlaceOnHoldCommand } from '@libs/lending/application/place-on-hold/place-on-hold.command';
import { PlaceOnHoldHandler } from '@libs/lending/application/place-on-hold/place-on-hold.handler';
import { PatronRepository } from '@libs/lending/application/ports/patron.repository';
import { BookId, PatronId } from '@libs/lending/domain';
import { Result } from '@libs/shared/domain';
import { BookFixtures } from '@tests/lending/domain/book.fixtures';
import { PatronFixtures } from '@tests/lending/domain/patron.fixtures';
import { none, some } from 'fp-ts/lib/Option';
import { createSpyObj } from 'jest-createspyobj';

describe('PlaceOnHoldHandler', () => {
  const willFindBook: FindAvailableBook = {
    findAvailableBookById: () =>
      Promise.resolve(some(BookFixtures.circulatingBook())),
  };
  const willNotFindBook: FindAvailableBook = {
    findAvailableBookById: () => Promise.resolve(none),
  };
  const repository = createSpyObj(PatronRepository, ['findById', 'publish']);

  it('should successfully place on hold book if patron and book exist', async () => {
    // given
    const holding = new PlaceOnHoldHandler(willFindBook, repository);
    // and
    const patron = persistedRegularPatron(repository);
    // when
    const result = await holding.execute(for3days(patron));
    // then
    expect(result).toBe(Result.Success);
  });

  it('should reject placing on hold book if one of the domain rules is broken (but should not fail!)', async () => {
    // given
    const holding = new PlaceOnHoldHandler(willFindBook, repository);
    // and
    const patron = persistedRegularPatronWithManyHolds(repository);
    // when
    const result = await holding.execute(for3days(patron));
    // then
    expect(result).toBe(Result.Rejection);
  });

  it('should fail if patron does not exist', async () => {
    // given
    const holding = new PlaceOnHoldHandler(willFindBook, repository);
    // and
    const patron = unknownPatron(repository);
    // when
    const result = holding.execute(for3days(patron));
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if book does not exist', async () => {
    // given
    const holding = new PlaceOnHoldHandler(willNotFindBook, repository);
    // and
    const patron = persistedRegularPatron(repository);
    // when
    const result = holding.execute(for3days(patron));
    // then
    await expect(result).rejects.toThrow();
  });

  it('should fail if saving patron fails', async () => {
    // given
    const holding = new PlaceOnHoldHandler(willFindBook, repository);
    // and
    const patron = persistedRegularPatronThatFailsOnSaving(repository);
    // when
    const result = holding.execute(for3days(patron));
    // then
    await expect(result).rejects.toThrow();
  });
});

function persistedRegularPatron(
  repository: jest.Mocked<PatronRepository>
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.GivenRegularPatron(patronId);
  repository.findById.mockResolvedValueOnce(some(patron));
  return patronId;
}

function persistedRegularPatronWithManyHolds(
  repository: jest.Mocked<PatronRepository>
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.regularPatronWithHolds(5);
  repository.publish.mockResolvedValueOnce(patron);
  repository.findById.mockResolvedValueOnce(some(patron));
  return patronId;
}

function for3days(patron: PatronId): PlaceOnHoldCommand {
  return PlaceOnHoldCommand.closeEnded(patron, BookId.generate(), 4);
}

function unknownPatron(repository: jest.Mocked<PatronRepository>): PatronId {
  repository.findById.mockResolvedValueOnce(none);
  return PatronId.generate();
}

function persistedRegularPatronThatFailsOnSaving(
  repository: jest.Mocked<PatronRepository>
): PatronId {
  const patronId = PatronId.generate();
  const patron = PatronFixtures.GivenRegularPatron(patronId);
  repository.findById.mockResolvedValueOnce(some(patron));
  repository.publish.mockRejectedValueOnce(new Error('Mocked to fail'));
  return patronId;
}
