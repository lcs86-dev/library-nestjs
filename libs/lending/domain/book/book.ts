import { Version } from '@libs/shared/domain';
import { BookId } from '../value-objects/book-id';

export interface Book {
  bookId: BookId;
  version: Version;
}
