import { SynthData, SynthObject } from "./types";

export class SynthContext {
  data: SynthData;
  private uidCache: { [uid: number]: SynthObject } | null = null;
  private uidParentCache: { [uid: number]: SynthParentInfo } | null = null;
  
  constructor (data?: SynthData) {
    this.data = data || {
      tracks: [],
      uidSequence: 0
    };
  }

  getByUid(uid: number) {
    return this.getUidCache()[uid];
  }

  getParentByUid(childUid: number) {
    if (!this.uidParentCache) { this.getUidCache(); }
    return this.uidParentCache && this.uidParentCache[childUid];
  }

  invalidateUidCache() {
    this.uidCache = null;
    this.uidParentCache = null;
  }

  private getUidCache() {
    if (!this.uidCache || !this.uidParentCache) {
      this.uidCache = {};
      this.uidParentCache = {};
      if (this.data.tracks) {
        for (var i = this.data.tracks.length - 1; i >= 0; i--) {
          addUidCacheNode(this.uidCache, this.data.tracks[i],
            this.uidParentCache, this.data, 'tracks', i);
        }
      }
    }
    return this.uidCache;
  }
}

interface SynthParentInfo {
  parent: SynthObject | SynthData;
  key: string;
  index: number;
}

const childContainers = ['content', 'sequence'];

function addUidCacheNode(cache: { [uid: number]: SynthObject }, obj: SynthObject,
  parentCache: { [uid: number]: SynthParentInfo }, parent: SynthObject | SynthData, parentKey: string, parentIndex: number) {
  cache[obj.uid] = obj;
  parentCache[obj.uid] = { parent: parent, key: parentKey, index: parentIndex };
  for (var j = 0; j < childContainers.length; j++) {
    const containerKey = childContainers[j];
    const container = (obj as any)[containerKey];
    if (container) {
      for (var i = container.length - 1; i >= 0; i--) {
        addUidCacheNode(cache, container[i], parentCache, obj, containerKey, i);
      }
    }
  }
}
