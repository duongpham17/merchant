import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';

const Osrs = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(Items.find("empty"));
      }, [dispatch]);

    return null
}

export default Osrs;