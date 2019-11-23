import React, { useEffect, useState } from 'react';
import { LayoutComponentPropsBase } from '../types';
import { useGlobalState } from '../hooks/global-context-state';
import globalContext from '../global-context';

export function MetadataViewComponent (props: LayoutComponentPropsBase) {
  const [selectedUid, setSelectedUid] = useGlobalState(props.uid, 'uid', 0);
  const [obj, setObj] = useState(() => globalContext.synth.getByUid(selectedUid));
  
  useEffect(() => globalContext.onFocus.subscribe(setSelectedUid), [setSelectedUid]);
  useEffect(() => setObj(globalContext.synth.getByUid(selectedUid)), [selectedUid, setObj]);
  useEffect(() => globalContext.synthEdit.onChange
    .subscribe(() => setObj(globalContext.synth.getByUid(selectedUid))), [selectedUid, setObj]);

  if (!obj) {
    return <div>Nothing selected.</div>;
  } else {
    return <div>Selected {obj.uid}</div>;
  }
}
