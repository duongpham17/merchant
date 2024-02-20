import styles from './Single.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  center?: boolean
};

const Single = ({children, center, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${center ? styles.center : ""}`} {...props}>
      {children}
    </div>
  )
};

export default Single