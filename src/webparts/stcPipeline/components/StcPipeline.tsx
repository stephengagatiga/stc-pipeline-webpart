import * as React from 'react';
import { IStcPipelineProps } from './IStcPipelineProps';
import { escape } from '@microsoft/sp-lodash-subset';

import ComponentSwitch from '../components/ComponentSwitch';

import {createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../redux/reducer';
import {Provider} from 'react-redux';

const store = createStore(reducer, applyMiddleware(thunk));

export default class StcPipeline extends React.Component<any, any> {
  public render(): React.ReactElement<any> {
    return (
      <Provider store={store}>
        <ComponentSwitch />
      </Provider>
    );
  }
}
