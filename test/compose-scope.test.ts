/// <reference types="jest" />
import {composeScope, createAsyncScope} from "../src";

describe('ComposeScope', () => {

  const TEST_VALUE = 1000;
  const ACTION_NAME = 'action';

  it('composeScope', () => {

    function initScope(name: string) {
      const scope = createAsyncScope({name});
      scope.registerAction(ACTION_NAME, (scope, props) => {
        return Promise.resolve(props);
      });
      return scope;
    }

    const composedScope = composeScope([
      initScope('comS1'),
      initScope('comS2'),
      initScope('comS3'),
      initScope('comS4')
    ], {name: 'ComposeScope'});

    composedScope.dispatch(ACTION_NAME, TEST_VALUE).then((newState) => {
      expect(newState).toEqual({
        'comS1': TEST_VALUE,
        'comS2': TEST_VALUE,
        'comS3': TEST_VALUE,
        'comS4': TEST_VALUE
      });
    });

  });

});
