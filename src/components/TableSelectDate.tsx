import styles from '../../styles/components/Table.module.scss';
import moment from 'moment';
import Image from "next/image";
import { Fragment } from 'react';

interface PropsTypes {
  placeholder: string;
  required: boolean;
  value: string;
  onChange: any;
  name: string;
  max?: any;
  min?: any;
}
// input#session-date {
//   display: inline-block;
//   position: relative;
// }
// input[type="date"]::-webkit-calendar-picker-indicator {
//   background: transparent;
//   bottom: 0;
//   color: transparent;
//   cursor: pointer;
//   height: auto;
//   left: 0;
//   position: absolute;
//   right: 0;
//   top: 0;
//   width: auto;
// }
const TableSelectDate = ({ placeholder, required = false, name, value, onChange, max, min }: PropsTypes) => {

  return (
    <div className={styles.DateContainer} style={{backgroundColor:'white'}}>
      <Fragment >
        <input
          required={required}
          id="datePicker"
          type="date"
          className={styles.columnDateInputBox}
          pattern="\d{4}-\d{2}-\d{2}"
          data-language='en'
          placeholder={placeholder}
          name={name}
          value={value}
          onKeyDown={(e) => e.preventDefault()}
          onChange={onChange}
          max={max}
          min={min}
          tabIndex={-1}
          style={{ backgroundColor: 'transparent', color:'#6c757d'}}
        />
        <Image style={{ cursor: 'pointer', zIndex: '0' }} height={10} width={10} src='/hmr/images/calender.svg' />
      </Fragment>
    </div>
  );
}

export default TableSelectDate;
