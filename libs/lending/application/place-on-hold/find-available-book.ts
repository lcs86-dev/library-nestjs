import { AvailableBook, BookId } from '@libs/lending/domain';
import { Option } from 'fp-ts/lib/Option';

export abstract class FindAvailableBook {
  abstract findAvailableBookById(id: BookId): Promise<Option<AvailableBook>>;
}
