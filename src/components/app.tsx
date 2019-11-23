import React, { useState, useEffect } from 'react';
import { MainMenu } from './main-menu';
import { MainLayoutComponent } from './main-layout';
import globalContext from '../global-context';
import { layoutComponents, defaultLayout } from '../layout/layout-components';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

const containerStyle: any = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0'
};

const dockStyle: any = {
  position: 'absolute',
  top: '64px',
  bottom: '0',
  width: '100%',
  overflow: 'hidden',
  zIndex: -1
};

export function App() {
  const [ currentLayout, setCurrentLayout ] = useState(defaultLayout);
  useEffect(() => {
    const preventEvent = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventEvent);
    return () => window.removeEventListener('contextmenu', preventEvent);
  }, []);
  globalContext.setCurrentLayout = setCurrentLayout as any;
  return <div style={containerStyle}>
    <MainMenu />
    <MainLayoutComponent config={currentLayout} components={layoutComponents}
      style={dockStyle} onInit={layout => globalContext.layout = layout} />
    <DeleteConfirmDialog />
  </div>;
};
