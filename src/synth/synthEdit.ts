import { SimpleEvent } from "./simple-event";
import { SynthContext } from './synth';
import { SynthObject, SynthData, SynthTrack } from './types';

export class SynthContextEditor {
  readonly onChange = new SimpleEvent();
  private synth: SynthContext | null = null;

  setSynthContext(synth: SynthContext) {
    this.synth = synth;
    this.synth.invalidateUidCache();
    this.onChange.trigger();
  }

  addTrack() {
    if (!this.synth) { return; }
    const track = { uid: 0, type: 'track', content: [] };
    return this.add(track, this.synth.data, 'tracks') as SynthTrack;
  }

  add(obj: SynthObject, parent: SynthObject | SynthData, key: string) {
    if (!this.synth) { return; }
    obj = {...obj, uid: ++this.synth.data.uidSequence };
    const newParent = {...parent};
    (newParent as any)[key] = [...(parent as any)[key], obj];
    this.changed(newParent);
    return obj;
  }

  changed(obj: SynthObject | SynthData) {
    if (!this.synth) { return; }
    obj = {...obj};
    while ('uid' in obj) {
      var parent = this.synth.getParentByUid(obj.uid);
      if (!parent) { return; }
      const array = [...(parent.parent as any)[parent.key]];
      array[parent.index] = obj;
      obj = {...parent.parent};
      (obj as any)[parent.key] = array;
    }
    this.synth.data = obj as SynthData;
    this.synth.invalidateUidCache();
    this.onChange.trigger();
    return obj;
  }
  
  delete(obj: SynthObject) {
    if (!this.synth) { return; }
    var parent = this.synth.getParentByUid(obj.uid);
    if (parent) {
      const array = [...(parent.parent as any)[parent.key]];
      array.splice(parent.index, 1);
      const newParent = {...parent.parent};
      (newParent as any)[parent.key] = array;
      this.changed(newParent);
    }
  }
}

