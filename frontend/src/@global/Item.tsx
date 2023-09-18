import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Items from '@redux/actions/items';

const Osrs = () => {

  const dispatch = useAppDispatch();

  const {isLoggedIn} = useAppSelector(state => state.authentication)

  useEffect(() => {
      if(!isLoggedIn) return;
      dispatch(Items.find("empty"));
  }, [dispatch, isLoggedIn]);

  return null
}

export default Osrs;