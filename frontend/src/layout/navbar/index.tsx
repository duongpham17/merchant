import styles from './Navbar.module.scss';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';

import { Context } from 'themes'; 

import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';
import { AiFillHome, AiFillFileAdd, AiOutlineUser } from 'react-icons/ai';
import { FaSitemap } from 'react-icons/fa';
import { MdLogin} from 'react-icons/md';

import Message from '@components/hover/Message';
import SlideIn from '@components/slidein/Style1';

import CreateComp from './create';

const Navbar = () => {

  const {onSetTheme, theme} = useContext(Context);

  const {isLoggedIn} = useAppSelector(state => state.authentication)

  return (
    <div className={styles.container}>

      <nav>
        <Message message='Home'><Link className={styles.button}  to="/"><AiFillHome/></Link></Message>
        {isLoggedIn && <Message message='Items'><Link className={styles.button} to="/items"><FaSitemap/></Link></Message>}
      </nav>

      <nav>
        {isLoggedIn && 
          <SlideIn width={350} icon={<Message message='Transaction'><button className={styles.button}><AiFillFileAdd/></button> </Message>}>
            <CreateComp />
          </SlideIn>
        }

        {theme.name === "light" && 
          <Message message='Light'>
            <button className={styles.button} onClick={onSetTheme}><BsSunFill/></button> 
          </Message>
        }
        {theme.name === "night" &&
          <Message message='Dark'>
            <button className={styles.button} onClick={onSetTheme}><BsFillMoonFill/></button>
          </Message>
        }

        { !isLoggedIn ?
          <Message message={"Login"}><Link className={styles.button} to="/login"><MdLogin/></Link></Message>
          :
          <Message message={"Profile"}><Link className={styles.button} to="/profile"><AiOutlineUser/></Link></Message>
        }
      </nav>

    </div>
  )
}

export default Navbar