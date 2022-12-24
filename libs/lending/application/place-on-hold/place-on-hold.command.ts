import {
  BookId,
  HoldDuration,
  NumberOfDays,
  PatronId,
} from '@libs/lending/domain';
import { Command } from '@nestjs-architects/typed-cqrs';
import { pipe } from 'fp-ts/lib/function';
import { getOrElse, map, Option, some } from 'fp-ts/lib/Option';

export class PlaceOnHoldCommand extends Command<void> {
  constructor(
    public readonly patron: PatronId,
    public readonly bookId: BookId,
    public readonly noOfDays: Option<number>
  ) {
    super();
  }

  static closeEnded(
    patron: PatronId,
    bookId: BookId,
    forDays: number
  ): PlaceOnHoldCommand {
    return new PlaceOnHoldCommand(patron, bookId, some(forDays));
  }

  get holdDuration(): HoldDuration {
    return pipe(
      this.noOfDays,
      map(NumberOfDays.of),
      map(HoldDuration.closeEnded),
      getOrElse(HoldDuration.openEnded)
    );
  }
}
