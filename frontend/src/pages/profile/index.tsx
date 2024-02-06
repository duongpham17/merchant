import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Authentication from '@redux/actions/authentication';

import Label from '@components/labels/Style2';
import Container from '@components/containers/Style1';
import Button from '@components/buttons/Button';

const UserIndex = () => {

    const dispatch = useAppDispatch();

    const {user} = useAppSelector(state => state.users);

    const logout = () => dispatch(Authentication.logout);

    return (
        <Container>
            <Button label1="Logout" color="red" margin onClick={logout} />

            <Container background='dark'>
             <Label name="Email Address" value={user?.email}/>
            </Container>
            
        </Container>
    )
}

export default UserIndex