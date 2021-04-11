import React, { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import './styles/Dropdown.scss';

const Dropdown = React.forwardRef((props, ref) => {
  const { label, items, onChange } = props;
  const [dropDownId] = useState(_uniqueId());
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);

  function itemSelected(indx) {
    setVisible(!visible);
    setSelected(indx);
    onChange(indx);
  }

  return (
    <div className={`dropdown ${visible ? 'is-active' : ''}`} role="menu">
      <div className="dropdown-trigger">
        <button ref={ref} value={selected} type="button" className="button" onClick={() => setVisible(!visible)} aria-haspopup="true" aria-controls={dropDownId}>
          <span>{items[selected] ? items[selected] : label}</span>
          <span className="icon is-small">
            <FontAwesomeIcon icon={visible ? faAngleUp : faAngleDown} />
          </span>
        </button>
      </div>
      <div id={dropDownId} className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          { Object.values(items).map((item, indx) => (
            <button key={_uniqueId()} type="button" className="dropdown-item button is-ghost" onClick={() => itemSelected(indx)}>
              {item}
            </button>
          )) }
        </div>
      </div>
    </div>
  );
});

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  items: (PropTypes.arrayOf(PropTypes.any) || PropTypes.objectOf(PropTypes.any)).isRequired,
  onChange: PropTypes.func,
};

Dropdown.defaultProps = {
  onChange: () => {},
};

export default Dropdown;
