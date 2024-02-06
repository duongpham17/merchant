import styles from './Alert.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';

const AlertContainer = () => {

    const {alert} = useAppSelector(state => state.alert);

    return (
        <div className={styles.container}>
        {alert?.map(el => 
            <p key={el.id} className={`${styles.alert} ${styles[`${el.color}`]}`}>
                {el.message}
            </p>
        )}
        </div>
    )
}

export default AlertContainer