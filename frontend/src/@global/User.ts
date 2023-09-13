import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import authentication from '@redux/actions/authentication';

const User = () => {

    const dispatch = useAppDispatch();

    const {isLoggedIn} = useAppSelector(state => state.authentication);

    useEffect(() => {
        let user: any = localStorage.getItem("user"); 
        if(isLoggedIn || !user) return;
        user = JSON.parse(user);
        const isTokenExpired = Date.now() >= user.expires;
        if(isTokenExpired) return authentication.logout();
        dispatch(authentication.load_user());
    }, [isLoggedIn, dispatch]);

    return null;
}

export default User