import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  center?: boolean
};

const Style1 = ({children, center, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${center ? styles.center : ""}`} {...props}>
      {children}
    </div>
  )
};

export default Style1