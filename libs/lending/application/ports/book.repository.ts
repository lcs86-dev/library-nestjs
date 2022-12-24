import { Book, BookId } from '@libs/lending/domain';
import { Option } from 'fp-ts/lib/Option';

export abstract class BookRepository {
  abstract findById(id: BookId): Promise<Option<Book>>;
  abstract save(book: Book): Promise<void>;
}
