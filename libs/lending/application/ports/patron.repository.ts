import { Patron, PatronEvent, PatronId } from '@libs/lending/domain';
import { Option } from 'fp-ts/lib/Option';

export abstract class PatronRepository {
  abstract publish(event: PatronEvent): Promise<Patron>;
  abstract findById(id: PatronId): Promise<Option<Patron>>;
}
