import React, { useRef, useEffect } from 'react';
import GoldenLayout from 'golden-layout';
import { registerLayoutReactShim } from '../layout/layout-components';

export function MainLayoutComponent(props: MainLayoutComponentProps) {

  const container = useRef(null);

  useEffect(() => {
    const layout = registerLayoutReactShim(new GoldenLayout(props.config, container.current));
    const updateSize = () => layout.updateSize();
    if (props.components) {
      Object.keys(props.components)
        .forEach(key => layout.registerComponent(key, props.components[key]));
    }
    layout.init();
    window.addEventListener('resize', updateSize);
    if (props.onInit) { props.onInit(layout); }
    return () => {
      window.removeEventListener('resize', updateSize);
      layout.destroy();
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config, props.components, container.current]);

  return <div style={props.style} ref={container} />;
}

interface MainLayoutComponentProps {
  config: GoldenLayout.Config;
  components: { [key: string]: any };
  onInit?: (layout: GoldenLayout) => void;
  style?: any;
}

