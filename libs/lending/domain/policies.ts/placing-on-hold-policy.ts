import { Either, left, right } from 'fp-ts/lib/Either';
import { AvailableBook } from 'libs/lending/domain/book';
import { Patron } from 'libs/lending/domain/patron';
import { HoldDuration, PatronHolds } from 'libs/lending/domain/value-objects';

export interface PlacingOnHoldPolicy {
  (book: AvailableBook, patron: Patron, duration: HoldDuration): Either<
    Rejection,
    Allowance
  >;
}

export const regularPatronMaximumNumberOfHoldsPolicy: PlacingOnHoldPolicy = (
  _toHold,
  patron
) => {
  if (
    patron.isRegular() &&
    patron.numberOfHolds() >= PatronHolds.MAX_NUMBER_OF_HOLDS
  ) {
    return left(Rejection.withReason('patron cannot hold more blocks'));
  }
  return right(new Allowance());
};

export const onlyResearcherPatronsCanPlaceOpenEndedHolds: PlacingOnHoldPolicy =
  (toHold, patron, holdDuration) => {
    if (patron.isRegular() && holdDuration.isOpenEnded()) {
      return left(
        Rejection.withReason('regular patron cannot place open ended holds')
      );
    }
    return right(new Allowance());
  };

export const allCurrentPolicies: Set<PlacingOnHoldPolicy> = new Set([
  regularPatronMaximumNumberOfHoldsPolicy,
  onlyResearcherPatronsCanPlaceOpenEndedHolds,
]);

export class Allowance {}

export class Rejection {
  private constructor(public readonly reason: string) {}

  static withReason(reason: string): Rejection {
    return new Rejection(reason);
  }
}
