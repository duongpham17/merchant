import styles from './Input.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label1?: string | number, 
    label2?: string | number | React.ReactNode,
    error?: boolean,
    borderBottom?: boolean,
    marginBottom?: boolean,
    onClear?: () => void,
};

const Input = ({label1, label2, error, borderBottom, marginBottom=true, onClear, ...props}:Props) => {
    
  return (
    <div className={styles.container}>

        {label1 && !label2 && 
            <label className={styles.single}>
                <span>{label1}</span>
            </label>
        }

        {label1 && label2 && 
            <label className={styles.double}> 
                <span>{label1}</span>
                <small className={`${error ? styles.errorSmall : ""}`}>{label2}</small>
            </label>
        }

        <div className={styles.inputArea}>

            <input {...props} className={`${borderBottom ? styles.borderBottom : styles.border} ${error ? styles.error : ""} ${marginBottom ? styles.marginBottom : ""}` } />

            {onClear && props.value ? <button type="button" className={styles.clear} onClick={onClear}> x </button> : ""}
        </div>

    </div>
  )
}

export default Input