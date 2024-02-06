import styles from './Style3.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
  name: any,
  value?: any,
  size?: string,
  weight?: number,
  color?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main",
  valueColor?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main",
  nameColor?: "default" | "white" | "light" | "dark" | "black" | "grey" | "blue" | "red" | "green" | "main"
};

const Style1 = ({name, value, color, valueColor, nameColor, size, weight, ...props}:Props) => {
  return (
    <div className={styles.container} {...props} >
      <label className={`${styles[color || "default"]} ${styles[nameColor || "default"]}`} style={{fontSize: size, fontWeight: weight}}>{name}</label>
      <label className={`${styles[color || "default"]} ${styles[valueColor || "default"]}`} style={{fontSize: size, fontWeight: weight}}>{value}</label>
    </div>
  )
}

export default Style1