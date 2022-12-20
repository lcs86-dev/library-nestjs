import { PatronEvent } from 'libs/lending/domain/events/patron-event';
import {
  BookId,
  DateVO,
  LibraryBranchId,
  PatronId,
} from 'libs/lending/domain/value-objects';

export class BookPlacedOnHold implements PatronEvent {
  constructor(
    public readonly patronId: PatronId,
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId,
    public readonly till: DateVO | null
  ) {}
}
