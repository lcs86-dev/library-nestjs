import { Version } from '@library/shared/domain';
import { Book } from 'libs/lending/domain/book/book';
import { BookId } from 'libs/lending/domain/value-objects/book-id';
import { LibraryBranchId } from 'libs/lending/domain/value-objects/library-branch-id';
import { PatronId } from 'libs/lending/domain/value-objects/patron-id';

export class BookOnHold implements Book {
  constructor(
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId,
    public readonly patronId: PatronId,
    public readonly version: Version
  ) {}

  by(patronId: PatronId): boolean {
    return this.patronId.equals(patronId);
  }

  // handleHoldCanceled(holdCanceled: BookHoldCanceled): AvailableBook {
  //   return new AvailableBook(
  //     this.bookId,
  //     holdCanceled.libraryBranchId,
  //     this.version
  //   );
  // }
}
