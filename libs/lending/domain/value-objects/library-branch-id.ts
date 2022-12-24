import { Uuid } from '@libs/shared/domain';

export class LibraryBranchId extends Uuid {
  static generate(): LibraryBranchId {
    return super.generate();
  }
}
