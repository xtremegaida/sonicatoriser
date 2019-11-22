import { SimpleTypedEvent } from "./simple-event";
import { SynthContext } from './synth';
import { SynthData } from './types';

export class SynthContextEditor {
  readonly onChange = new SimpleTypedEvent<SynthData>();
  private synth: SynthContext | null = null;

  setSynthContext(synth: SynthContext) {
    this.synth = synth;
    this.onChange.trigger(synth.data);
  }

  addTrack() {
    if (!this.synth) { return null; }
    const track = { content: [] };
    this.synth.data.tracks.push(track);
    this.onChange.trigger(this.synth.data);
    return track;
  }
}
