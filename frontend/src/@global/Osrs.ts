import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import OSRS from '@redux/actions/osrs';

const Osrs = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(OSRS.latest());
    }, [dispatch]);
    
    return null
}

export default Osrs;