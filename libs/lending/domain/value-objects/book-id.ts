import { Uuid } from '@libs/shared/domain';

export class BookId extends Uuid {
  static generate(): BookId {
    return super.generate();
  }
}
