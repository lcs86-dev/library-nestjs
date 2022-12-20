import { Version } from '@library/shared/domain';
import { BookId } from 'libs/lending/domain/value-objects/book-id';

export interface Book {
  bookId: BookId;
  version: Version;
}
