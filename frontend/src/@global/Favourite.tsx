import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Favourite from '@redux/actions/favourites';

const FavouriteGlobal = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(Favourite.find());
    }, [dispatch]);
    
    return null
}

export default FavouriteGlobal;