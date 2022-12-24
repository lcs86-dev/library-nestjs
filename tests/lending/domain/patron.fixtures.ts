import {
  AvailableBook,
  BookId,
  BookOnHold,
  Hold,
  LibraryBranchId,
  Patron,
  PatronId,
  PatronType,
} from '@libs/lending/domain';
import {
  allCurrentPolicies,
  onlyResearcherPatronsCanPlaceOpenEndedHolds,
} from '@libs/lending/domain/policies/placing-on-hold-policy';
import { PatronHolds } from '@libs/lending/domain/value-objects/patron-holds';
import { PatronInformation } from '@libs/lending/domain/value-objects/patron-information';
import { Version } from '@libs/shared/domain';

export class PatronFixtures {
  static regularPatronWithHold(
    bookOnHold: BookOnHold,
    patronId?: PatronId
  ): Patron {
    return new Patron(
      new PatronHolds(
        new Set([new Hold(bookOnHold.bookId, bookOnHold.libraryBranchId)])
      ),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(
        patronId ?? PatronId.generate(),
        PatronType.Researcher
      )
    );
  }

  static GivenRegularPatron(patronId?: PatronId): Patron {
    if (!patronId) {
      patronId = PatronId.generate();
    }
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(patronId, PatronType.Regular)
    );
  }
  static GivenCirculatingAvailableBook(): AvailableBook {
    return new AvailableBook(
      BookId.generate(),
      LibraryBranchId.generate(),
      Version.zero()
    );
  }
  static GivenResearcherPatron(): Patron {
    return new Patron(
      new PatronHolds(new Set()),
      new Set([onlyResearcherPatronsCanPlaceOpenEndedHolds]),
      new PatronInformation(PatronId.generate(), PatronType.Researcher)
    );
  }

  static regularPatronWithHolds(numberOfHold: number): Patron {
    return new Patron(
      new PatronHolds(
        new Set(
          Array(numberOfHold)
            .fill(null)
            .map(() => new Hold(BookId.generate(), LibraryBranchId.generate()))
        )
      ),
      allCurrentPolicies,
      new PatronInformation(PatronId.generate(), PatronType.Regular)
    );
  }
}
