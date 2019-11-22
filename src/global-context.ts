import GoldenLayout from 'golden-layout';
import { defaultLayout, getLayoutUid, setLayoutUid, createLayoutComponent } from './layout/layout-components';
import { SynthContext } from './synth/synth';
import { SynthContextEditor } from './synth/synthEdit';

class GlobalContext {
  layout: GoldenLayout | null = null;
  setCurrentLayout: ((config: GoldenLayout.Config) => void) | null = null;
  globalState: any = {};

  readonly synthEdit = new SynthContextEditor();
  synth = new SynthContext();

  constructor() { this.fileNew(); }
  
  serialize() {
    var saveData: any = { uidSeq: getLayoutUid() };
    if (this.globalState) { saveData.globalState = this.globalState; }
    if (this.layout) { saveData.layout = this.layout.toConfig(); }
    if (this.synth) { saveData.synth = this.synth.data; }
    return saveData;
  }

  deserialize(saveData: any) {
    setLayoutUid(saveData.uidSeq || 0);
    this.synth = new SynthContext(saveData.synth);
    if (saveData.globalState) { this.globalState = saveData.globalState; }
    if (saveData.layout && this.setCurrentLayout) {
      this.setCurrentLayout(saveData.layout);
    }
    this.synthEdit.setSynthContext(this.synth);
  }

  fileNew() {
    setLayoutUid(0);
    this.globalState = {};
    this.synth = new SynthContext();
    if (this.setCurrentLayout) {
      this.setCurrentLayout({...defaultLayout});
    }
    this.synthEdit.setSynthContext(this.synth);
  }

  fileQuickLoad() {
    var data = localStorage.getItem('quicksave');
    if (data) { this.deserialize(JSON.parse(data)); }
  }
  
  fileQuickSave() {
    localStorage.setItem('quicksave', JSON.stringify(this.serialize()));
  }

  fileLoad() {

  }
  
  fileSave() {

  }

  showTrackView(index: number) {
    if (!this.layout) { return; }
    const track = (this.synth.data.tracks[index] && this.synth.data.tracks[index].name) || ('Track ' + (index + 1));
    const layoutItem = createLayoutComponent(track, 'trackView', { selectedTrackIndex: index });
    this.layout.root.getItemsById('mainContainer')[0].addChild(layoutItem);
  }

  get(key: string, defaultValue?: any) {
    if (key in this.globalState) { return this.globalState[key]; }
    return defaultValue;
  }

  set(key: string, value: any) {
    if (value === undefined) { delete this.globalState[key]; }
    else { this.globalState[key] = value; }
  }
}

export default new GlobalContext();
