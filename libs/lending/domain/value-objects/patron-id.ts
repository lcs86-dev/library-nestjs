import { Uuid } from '@libs/shared/domain';

export class PatronId extends Uuid {
  static generate(): PatronId {
    return super.generate();
  }
}
