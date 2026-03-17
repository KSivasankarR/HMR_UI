import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  required: boolean;
  onChange: any;
  options: any;
  name: string;
  value: string;
  sro?: boolean;
  customized?: any
}

const TableDropdown = ({ required = false, onChange, options = [], name, value, sro = false, customized={} }: PropsTypes) => {

  return (
    <div>
      <select className={styles.columnDropDownBox} value={value} name={name} onChange={onChange} required={required}>
      <option style={{width:'300px'}} key='' value='' >SELECT</option>
        {Object.keys(customized).length
        ?
        options.map((singleOption: any, index) => {
          return (
            <option key={index} value={singleOption[customized.value]}>{singleOption[customized.label]}</option>
          )
        })
        :
        sro?
        options.map((singleOption: any, index: any) => {
          return (
            <option key={index} value={singleOption} >{singleOption}</option>
          )
        })
        :
          options.map((singleOption: any, index: any) => {
            return (
              <option key={index} value={singleOption.label} >{singleOption.label}</option>
            )
          })
        }
        
      </select>
    </div>
  );
}

export default TableDropdown;

