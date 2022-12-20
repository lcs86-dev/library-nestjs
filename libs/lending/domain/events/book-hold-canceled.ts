import { PatronEvent } from 'libs/lending/domain/events/patron-event';
import {
  BookId,
  LibraryBranchId,
  PatronId,
} from 'libs/lending/domain/value-objects';

export class BookHoldCanceled implements PatronEvent {
  constructor(
    public readonly patronId: PatronId,
    public readonly bookId: BookId,
    public readonly libraryBranchId: LibraryBranchId
  ) {}
}
