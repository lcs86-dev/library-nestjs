import { FindAvailableBook } from '@libs/lending/application/place-on-hold/find-available-book';
import { PlaceOnHoldCommand } from '@libs/lending/application/place-on-hold/place-on-hold.command';
import { PatronRepository } from '@libs/lending/application/ports/patron.repository';
import {
  AvailableBook,
  BookHoldFailed,
  BookId,
  BookPlacedOnHoldEvents,
  Patron,
  PatronId,
} from '@libs/lending/domain';
import { InvalidArgumentException, Result } from '@libs/shared/domain';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { match } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { getOrElseW } from 'fp-ts/lib/Option';

@CommandHandler(PlaceOnHoldCommand)
export class PlaceOnHoldHandler implements ICommandHandler<PlaceOnHoldCommand> {
  constructor(
    private readonly findAvailableBook: FindAvailableBook,
    private readonly repository: PatronRepository
  ) {}

  async execute(command: PlaceOnHoldCommand): Promise<any> {
    const availableBook = await this.findBook(command.bookId);
    const patron = await this.findPatron(command.patron);
    const result = patron.placeOnHold(availableBook, command.holdDuration);
    return pipe(
      result,
      match<BookHoldFailed, BookPlacedOnHoldEvents, Promise<Result>>(
        this.publishOnFail.bind(this),
        this.publishOnSuccess.bind(this)
      )
    );
  }

  private findBook(id: BookId): Promise<AvailableBook> {
    return this.findAvailableBook.findAvailableBookById(id).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Cannot find available book with Id: ${id}`
          );
        })
      )
    );
  }

  private findPatron(patronId: PatronId): Promise<Patron> {
    return this.repository.findById(patronId).then((result) =>
      pipe(
        result,
        getOrElseW(() => {
          throw new InvalidArgumentException(
            `Patron with given Id does not exists : ${patronId}`
          );
        })
      )
    );
  }

  private async publishOnFail(
    bookHoldFailed: BookHoldFailed
  ): Promise<Result.Rejection> {
    await this.repository.publish(bookHoldFailed);

    return Result.Rejection;
  }

  private async publishOnSuccess(
    placeOnHold: BookPlacedOnHoldEvents
  ): Promise<Result.Success> {
    await this.repository.publish(placeOnHold);

    return Result.Success;
  }
}
