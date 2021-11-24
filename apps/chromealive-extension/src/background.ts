/// <reference types="chrome"/>
import { onMessagePayload } from './lib/background/BackgroundMessenger';
import * as TabManagement from './lib/background/TabManagement';
import logDebug from './lib/logDebug';
import './lib/background/BackgroundListeners';

onMessagePayload((payload, sendResponseFn) => {
  if (TabManagement[payload.action]) {
    const fn = TabManagement[payload.action];
    fn(payload)
      .catch(error => {
        if (sendResponseFn) sendResponseFn(error);
        logDebug('chrome.runtime.onMessage:ERROR', { payload, error });
      })
      .then(result => {
        if (sendResponseFn) sendResponseFn(result);
        logDebug('chrome.runtime.onMessage:Result', { payload, result });
        return null;
      })
      .catch(() => null);
    return true;
  }
  console.log('UNHANDLED MESSAGE: ', payload);
});
