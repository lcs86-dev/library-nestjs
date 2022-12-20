import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { getLeft, isNone, none, Option } from 'fp-ts/lib/Option';
import { AvailableBook, BookOnHold } from 'libs/lending/domain/book';
import {
  BookHoldCanceled,
  BookHoldCancelingFailed,
  BookPlacedOnHold,
  BookPlacedOnHoldEvents,
} from 'libs/lending/domain/events';
import { BookHoldFailed } from 'libs/lending/domain/events/book-hold-failed';
import { MaximumNumberOhHoldsReached } from 'libs/lending/domain/events/maximum-number-on-holds-reached';
import { Rejection } from 'libs/lending/domain/policies.ts';
import {
  HoldDuration,
  PatronHolds,
  PatronInformation,
} from 'libs/lending/domain/value-objects';

export class Patron {
  constructor(
    private readonly patronHolds: PatronHolds,
    private readonly placingOnHoldPolicies,
    private readonly patronInformation: PatronInformation
  ) {}

  cancelHold(book: BookOnHold) {
    if (this.patronHolds.includes(book)) {
      return right(
        new BookHoldCanceled(
          this.patronInformation.patronId,
          book.bookId,
          book.libraryBranchId
        )
      );
    }
    return left(new BookHoldCancelingFailed(this.patronInformation.patronId));
  }

  isRegular(): boolean {
    return this.patronInformation.isRegular();
  }

  numberOfHolds(): number {
    return this.patronHolds.numberOfHolds;
  }

  hasOnHold(book: BookOnHold): boolean {
    return this.patronHolds.includes(book);
  }

  private patronCanHold(
    book: AvailableBook,
    duration: HoldDuration
  ): Option<Rejection> {
    const rejection = [...this.placingOnHoldPolicies]
      .map((policy) => policy(book, this, duration))
      .find(isLeft);
    return rejection ? getLeft(rejection) : none;
  }

  placeOnHold(book: AvailableBook, duration: HoldDuration) {
    const rejection = this.patronCanHold(book, duration);
    if (isNone(rejection)) {
      if (this.patronHolds.maximumHoldsAfterHoldingNextBook()) {
        BookPlacedOnHoldEvents.events(
          this.patronInformation.patronId,
          new BookPlacedOnHold(
            this.patronInformation.patronId,
            book.bookId,
            book.libraryBranchId,
            duration.to
          ),
          new MaximumNumberOhHoldsReached()
        );
      }
      return right(
        BookPlacedOnHoldEvents.event(
          this.patronInformation.patronId,
          new BookPlacedOnHold(
            this.patronInformation.patronId,
            book.bookId,
            book.libraryBranchId,
            duration.to
          )
        )
      );
    }
    return left(
      BookHoldFailed.bookHoldFailedNow(
        rejection.value,
        this.patronInformation.patronId
      )
    );
  }
}
