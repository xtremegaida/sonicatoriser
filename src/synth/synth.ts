import { SynthData } from "./types";

export class SynthContext {
  readonly data: SynthData;

  constructor (data?: SynthData) {
    this.data = data || {
      tracks: [],
      uidSequence: 0
    };
  }
}
