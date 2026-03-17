import styles from '../../styles/components/Table.module.scss';
import moment from 'moment';

interface PropsTypes {
  placeholder: string;
  required: boolean;
  value: string;
  onChange: any;
  name: string;
  max?:any;
}

const ReactDatePicker = ({ placeholder, required = false,name, value, onChange, max}: PropsTypes) => {

  return (
    <div >
    <input
      required = {required} 
      id="datePicker"
      type="date" 
      className={styles.columnDateInputBox}  
      pattern="\d{4}-\d{2}-\d{2}"
      data-language='en' 
      placeholder={placeholder}
      name = {name}
      value={value}
      onKeyDown={(e) => e.preventDefault()}
      onChange={onChange}
      max = {max}

      />
  </div>
  );
}

export default ReactDatePicker;
