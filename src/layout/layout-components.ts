import React from 'react';
import ReactDOM from 'react-dom';
import 'golden-layout/lib/jquery';
import GoldenLayout from 'golden-layout';
import { LayoutComponentPropsBase } from '../types';

import { LayoutProjectOutlineComponent } from './project-outline';
import { SynthObjectViewComponent } from './object-view';
import { MetadataViewComponent } from './metadata-view';

import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';
import './layout-components.css';

var layoutUid = 0;

export const getLayoutUid = () => layoutUid;
export const setLayoutUid = (uid: number) => layoutUid = uid;

export const layoutComponents = {
  'outline': LayoutProjectOutlineComponent,
  'view': SynthObjectViewComponent,
  'metadata': MetadataViewComponent,
};

export const createLayoutComponent = (title: string, component: any, props?: any, isClosable?: boolean) => {
  const uid = component + '[' + (layoutUid++) + ']';
  return {
    type: 'component',
    id: uid,
    title,
    isClosable,
    componentName: 'reactshim',
    componentState: {
      component,
      props: { ...props, uid } as LayoutComponentPropsBase
    }
  };
};

export const defaultLayout = {
  settings: {
    showPopoutIcon: false
  },
  dimensions: {
    headerHeight: 30
  },
  content: [{
    type: 'row',
    content:[{
      type: 'stack',
      id: 'mainContainer',
      width: 75,
      isClosable: false,
      content: []
    }, {
      type: 'column',
      content: [{
        type: 'stack',
        id: 'toolboxContainer',
        height: 75,
        isClosable: false,
        content: [createLayoutComponent('Project Outline', 'outline', null, false)]
      },
      createLayoutComponent('Metadata', 'metadata', null, false)]
    }]
  }]
};

export const registerLayoutReactShim = (layout: GoldenLayout) => {
  layout.registerComponent('reactshim', function (container: GoldenLayout.Container, state: any) {

    const open = () => {
      const componentName = state && state.component;
      if (!componentName) { throw new Error( 'No react component name.' ); }
      const reactClass = container.layoutManager.getComponent( componentName );
      if (!reactClass) {
        throw new Error( 'React component "' + componentName + '" not found. ' +
          'Please register all components with GoldenLayout using `registerComponent(name, component)`' );
      }
      const element = React.createElement(reactClass, {
        ...state.props,
        glContainer: container,
        glEventHub: container.layoutManager.eventHub
      });
      ReactDOM.render(element, container.getElement()[0]);
    };

    const destroy = () => {
      ReactDOM.unmountComponentAtNode(container.getElement()[0]);
      container.off('open', open);
      container.off('destroy', destroy);
    };

    container.on('open', open);
    container.on('destroy', destroy);

  });
  return layout;
};
