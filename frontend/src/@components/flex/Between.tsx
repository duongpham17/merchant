import styles from './Between.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  center?: boolean
};

const Between = ({children, center, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${center ? styles.center : ""}`} {...props}>
      {children}
    </div>
  )
};

export default Between