import { useAppSelector } from '@redux/hooks/useRedux';
import Unknown from 'pages/unknown';

interface Props {
    roles?: string[],
    component: React.FunctionComponent
}

const Private = ({component: Component, roles=["user", "admin"]}: Props) => {

  const {isLoggedIn} = useAppSelector(state => state.authentication);

  const {user} = useAppSelector(state => state.users);

  const auth_good = isLoggedIn && roles.includes(user?.role || "user");

  const auth_bad = !isLoggedIn || !roles.includes(user?.role || "user");

  if (auth_good) return <Component/>
  
  if (auth_bad) return <Unknown />
  
  return <div className='loading' />
}

export default Private