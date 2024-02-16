import styles from './Cover.module.scss';
import React, {ReactNode, ReactElement} from 'react';

interface Types {
  children: ReactNode | ReactElement,
  onClose?: React.MouseEventHandler<HTMLDivElement>
};

export const Cover = ({children, onClose}: Types) => {

  return (
    <div className={styles.container} onClick={onClose}>
      {children}
    </div>
  )
}

export default Cover