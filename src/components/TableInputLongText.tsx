import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  placeholder: string,
  required: boolean,
  value: string,
  onChange: any,
  name: string,
  disabled?: boolean
}

const TableInputLongText = ({ name, placeholder, required = false, value, onChange, disabled=false }: PropsTypes) => {

  return (
    <div >
      <textarea rows={5} className={styles.columnInputBox}
        style={{ textTransform: 'uppercase' }}
        placeholder={placeholder}
        required={required}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export default TableInputLongText;
