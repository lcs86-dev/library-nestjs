import { BookId } from 'libs/lending/domain/value-objects/book-id';
import { LibraryBranchId } from 'libs/lending/domain/value-objects/library-branch-id';
import { TinyType } from 'tiny-types';

export class Hold extends TinyType {
  constructor(
    private readonly bookId: BookId,
    private readonly libraryBranchId: LibraryBranchId
  ) {
    super();
  }

  forBook(bookId: BookId): boolean {
    return bookId.equals(this.bookId);
  }
}
