import GoldenLayout from 'golden-layout';
import { defaultLayout, getLayoutUid, setLayoutUid, createLayoutComponent } from './layout/layout-components';
import { SynthContext } from './synth/synth';
import { SynthContextEditor } from './synth/synthEdit';
import { SynthObject } from './synth/types';
import { SimpleTypedEvent } from './synth/simple-event';
import { showConfirmDialog } from './components/confirm-dialog';

class GlobalContext {
  layout: GoldenLayout | null = null;
  setCurrentLayout: ((config: GoldenLayout.Config) => void) | null = null;
  globalState: any = {};
  readonly onFocus = new SimpleTypedEvent<number>();

  readonly synthEdit = new SynthContextEditor();
  synth = new SynthContext();

  constructor() { this.init(); }

  private init() {
    setLayoutUid(0);
    this.globalState = {};
    this.synth = new SynthContext();
    if (this.setCurrentLayout) {
      this.setCurrentLayout({...defaultLayout});
    }
    this.synthEdit.setSynthContext(this.synth);
  }
  
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
    showConfirmDialog('Create New', 'Create new project?')
      .then(() => this.init());
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

  showObjectView(obj: SynthObject) {
    if (!this.layout || !this.synth) { return; }
    const layoutItem = createLayoutComponent('(' + obj.uid + ')', 'view', { selectedUid: obj.uid });
    this.layout.root.getItemsById('mainContainer')[0].addChild(layoutItem);
  }

  deleteObject(obj: SynthObject, confirm?: boolean) {
    if (confirm) {
      this.synthEdit.delete(obj);
    } else {
      showConfirmDialog('Delete Object', 'Permanently delete object?')
        .then(() => this.synthEdit.delete(obj));
    }
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
