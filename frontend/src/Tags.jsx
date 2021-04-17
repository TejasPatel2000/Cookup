import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import AppContext from './AppContext';

function Tags() {
  return (
    <AppContext.Consumer>
      { (value) => value.listTag.map((tag) => (
        <div key={_uniqueId()} className="box">
          <div className="content">
            <p>{tag.name}</p>
          </div>
        </div>
      )) }
    </AppContext.Consumer>
  );
}

export default Tags;
