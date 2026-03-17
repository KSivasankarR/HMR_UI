import { off } from 'process';
import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  type: string,
  placeholder: string;
  required: boolean;
  value: string;
  onChange: any;
  name: string;
  disabled?: boolean;
}

const TableInputText = ({ type, placeholder, required = false, value, name, onChange, disabled}: PropsTypes) => {

  const blockInvalidChar = e => {
    if (type == "number") {
      ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault();
    }
  }

  return (
    <div >
      <input className={styles.columnInputBox}
        // style={{ textTransform: (type != 'email' && type != 'password') ? 'uppercase' : 'none' }}
        // style={{textTransform: type!="email"  'uppercase' }}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        autoComplete="off"
        onChange={onChange}
        onKeyDown = {blockInvalidChar}
        onWheel={ event => event.currentTarget.blur() }
        disabled={disabled}
        style={["loginRPassword", "loginPassword", "oldPswrd", "newPswrd", "cnfPswrd"].includes(name) ? {textTransform: 'none'} : {}}
      />
    </div>
  );
}

export default TableInputText;
