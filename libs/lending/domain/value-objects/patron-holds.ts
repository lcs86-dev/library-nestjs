import { BookOnHold } from 'libs/lending/domain/book';
import { Hold } from 'libs/lending/domain/value-objects/hold';

export class PatronHolds {
  static MAX_NUMBER_OF_HOLDS = 5;
  constructor(private readonly resourcesOnHold: Set<Hold>) {}

  get numberOfHolds(): number {
    return this.resourcesOnHold.size;
  }

  includes(book: BookOnHold): boolean {
    return !![...this.resourcesOnHold].find((hold) =>
      hold.forBook(book.bookId)
    );
  }

  maximumHoldsAfterHoldingNextBook(): boolean {
    return this.resourcesOnHold.size + 1 === PatronHolds.MAX_NUMBER_OF_HOLDS;
  }
}
