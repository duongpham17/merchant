import styles from './Pagination.module.scss';
import react, {useContext} from 'react';
import {Context} from '../Context';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';

const PaginationIndex = () => {

    const {page, setPage, sorted} = useContext(Context);

    const onNext = () => {
        if(page >= Math.ceil(sorted.length / 100) - 1) return;
        setPage(page => page + 1);
        window.scrollTo(0, 0);
    };

    const onPrev = () => {
        if(page <= 0) return;
        setPage(page => page - 1);
    }

    return (
        <div className={styles.container}>
            <button onClick={onPrev}><MdKeyboardArrowLeft/></button>
            <p> {page+1} / {Math.ceil(sorted.length / 100)} </p>
            <button onClick={onNext}><MdKeyboardArrowRight/></button>
        </div>
    )
}

export default PaginationIndex