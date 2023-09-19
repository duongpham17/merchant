import styles from './Evenly.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  center?: boolean
};

const Evenly = ({children, center, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${center ? styles.center : ""}`} {...props}>
      {children}
    </div>
  )
};

export default Evenly