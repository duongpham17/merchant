import styles from './Style1.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  selected?: boolean,
  background?: "default" | "light" | "dark" | 'main',
  hover?: boolean,
};

const Container = ({children, selected, background, hover=false, ...props}: Props) => {
  return (
    <div className={` ${styles.container} ${hover?styles.hover:""} ${selected?styles.selected:""} ${styles[background || "default"]} `} {...props}>
      {children}
    </div>
  )
}

export default Container