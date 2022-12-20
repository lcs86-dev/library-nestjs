import { PatronId } from 'libs/lending/domain/value-objects/patron-id';
import { PatronType } from 'libs/lending/domain/value-objects/patron-type';

export class PatronInformation {
  constructor(
    public readonly patronId: PatronId,
    public readonly type: PatronType
  ) {}

  isRegular(): boolean {
    return this.type === PatronType.Regular;
  }
}
