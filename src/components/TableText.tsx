import styles from '../../styles/components/Table.module.scss';

interface PropsTypes {
  label: string;
  required: boolean;
  LeftSpace: boolean;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width' | 'full-size-kana'
}

const TableText = ({label,required=false,LeftSpace=false, textTransform}:PropsTypes) => {
    
    return (
      <div >
        <text className={styles.columnText} style={{paddingLeft: LeftSpace?'14px':'0px', textTransform: textTransform ? textTransform : 'none'}}>{label}</text>
        {required && <text className={styles.columnText} style={{color:'red', marginLeft:'5px'}}>*</text>}
      </div>
    );
  }

  export default TableText;
