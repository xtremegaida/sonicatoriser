export interface SynthData {
  tracks: SynthTrack[];
  uidSequence: number;
}

export interface SynthObject {
  type: string;
  uid: number;
}

export interface SynthTrack extends SynthObject {
  name?: string;
  notesPerDivision?: number;
  noteLength?: number;
  notePattern?: number[];
  noteNames?: string[];
  content: SynthObject[];
}

export interface Sequence extends SynthObject {
  pitch: number;
  start: number;
  sequence: SequenceNote[];
}

export interface SequenceNote {
  pitch: number;
  len: number;
}
