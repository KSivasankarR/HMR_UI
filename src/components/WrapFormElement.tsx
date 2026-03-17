import Styles from "../../styles/components/WrapFormElement.module.scss";

interface PropsTypes {
    required: boolean;
    name: string;
    fullWidth?: boolean;
    children: any
  }
  
const WrapFormElement = ({children, name, required = false, fullWidth=false}: PropsTypes) => {
    return (
        <div className={!fullWidth ? Styles.WrappedElement : Styles.FullyWrapped} key={name}>
            <label>{name}
            {
                required && <span> *</span>
            }
            </label>
            <div>{children}</div>
        </div>
    )
}

export default WrapFormElement;