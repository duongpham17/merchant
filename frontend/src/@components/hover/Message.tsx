import styles from './Message.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode,
  side?: "left" | "right" | "center" 
  message: string,
}

const Message = ({children, message, side="center"}: Props) => {
  return (
    <div className={`${styles.container} ${styles[side]}`}>
      <div className={styles.children}>{children}</div>
      <div className={`${styles.message}`}>{message}</div>
    </div>
  )
}

export default Message