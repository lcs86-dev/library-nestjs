import { Version } from '@library/shared/domain';
import { Book } from 'libs/lending/domain/book/book';
import { BookId } from 'libs/lending/domain/value-objects/book-id';
import { LibraryBranchId } from 'libs/lending/domain/value-objects/library-branch-id';

export class AvailableBook implements Book {
  constructor(
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId,
    public readonly version: Version
  ) {}

  // handleBookPlacedOnHold(bookPlacedOnHold: BookPlacedOnHold): BookOnHold {
  //   return new BookOnHold(
  //     this.bookId,
  //     this.libraryBranchId,
  //     bookPlacedOnHold.patronId,
  //     this.version
  //   );
  // }
}
