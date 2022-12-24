import {
  AvailableBook,
  BookId,
  BookOnHold,
  LibraryBranchId,
  PatronId,
} from '@libs/lending/domain';
import { Version } from '@libs/shared/domain';

export class BookFixtures {
  static bookOnHold(): BookOnHold {
    return new BookOnHold(
      BookId.generate(),
      LibraryBranchId.generate(),
      PatronId.generate(),
      new Version(1)
    );
  }

  static circulatingBook(): AvailableBook {
    return new AvailableBook(
      BookId.generate(),
      LibraryBranchId.generate(),
      Version.zero()
    );
  }
}
