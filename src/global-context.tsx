import GoldenLayout from 'golden-layout';
import { defaultLayout, getLayoutUid, setLayoutUid } from './layout-components';

class GlobalContext {
  layout: GoldenLayout | null = null;
  setCurrentLayout: ((config: GoldenLayout.Config) => void) | null = null;
  globalState: any = {};
  
  serialize() {
    var saveData: any = { uidSeq: getLayoutUid() };
    if (this.globalState) { saveData.globalState = this.globalState; }
    if (this.layout) { saveData.layout = this.layout.toConfig(); }
    return saveData;
  }

  deserialize(saveData: any) {
    setLayoutUid(saveData.uidSeq || 0);
    if (saveData.globalState) { this.globalState = saveData.globalState; }
    if (saveData.layout && this.setCurrentLayout) {
      this.setCurrentLayout(saveData.layout);
    }
  }

  fileNew() {
    setLayoutUid(0);
    this.globalState = {};
    if (this.setCurrentLayout) {
      this.setCurrentLayout({...defaultLayout});
    }
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
