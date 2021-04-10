import React, { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import './styles/Dropdown.scss';

function Dropdown(props) {
  const { label, items, onSelect } = props;
  const [visible, setVisible] = useState(false);

  function itemSelected(indx) {
    setVisible(!visible);
    onSelect(indx);
  }

  return (
    <div className={`dropdown ${visible ? 'is-active' : ''}`} role="menu">
      <div className="dropdown-trigger">
        <button type="button" className="button" onClick={() => setVisible(!visible)} aria-haspopup="true" aria-controls="dropdown-menu">
          <span>{label}</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={visible ? faAngleUp : faAngleDown} />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          { Object.values(items).map((item, indx) => (
            <button id={_uniqueId()} type="button" className="dropdown-item button is-white" onClick={() => itemSelected(indx)}>
              {item}
            </button>
          )) }
        </div>
      </div>
    </div>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  items: (PropTypes.arrayOf(PropTypes.any) || PropTypes.objectOf(PropTypes.any)).isRequired,
  onSelect: PropTypes.func,
};

Dropdown.defaultProps = {
  onSelect: () => {},
};

export default Dropdown;
