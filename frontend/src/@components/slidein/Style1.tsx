import styles from './Style1.module.scss';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

interface Types {
  children: ReactNode | ReactElement,
  icon: ReactNode | ReactElement,
  iconOpen?: ReactNode | ReactElement,
  width?: number
}

const Sidebar = ({children, icon, width=500, iconOpen}: Types) => {

    const location = useLocation();

    const [open, setOpen] = useState<boolean>(false); 

    const onOpen = (): void => setOpen(!open);

    //remove scrollbar from main body when menu is open, add bodySCrollBar to main css file for this to work
    /* 
        .bodyScrollBar{
            overflow: hidden;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    */
    useEffect(() => {
        if(open) document.body.classList.add("bodyScrollBar");
        return () => document.body.classList.remove('bodyScrollBar');
    }, [open]);

    useEffect(() => {
        setOpen(false);
    }, [location])

    return (
        <div className={styles.container}>
            <div className={styles.icon} onClick={onOpen}> 
                {icon}
            </div>                                              
            { open &&
                <div className={styles.cover} onClick={onOpen}>
                    <div className={styles.sidebar} style={{maxWidth: `${width}px`}} onClick={e => e.stopPropagation()}>
                        <div className={styles.iconOpen}>
                            <button className={styles.close} onClick={() => setOpen(!open)}><MdOutlineKeyboardBackspace/></button>
                            {iconOpen}
                        </div>
                        <div onClick={e => e.stopPropagation()}>
                            {children}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Sidebar