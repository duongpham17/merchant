import styles from './Navbar.module.scss';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';

import { Context } from 'themes'; 

import { FaWater } from 'react-icons/fa';
import { BiCalculator } from 'react-icons/bi';
import { BsSunFill, BsFillMoonFill, BsSunsetFill } from 'react-icons/bs';
import { AiFillHome, AiFillFileAdd, AiOutlineUser, AiFillThunderbolt, AiOutlineSearch } from 'react-icons/ai';
import { FaStar, FaStoreAlt } from 'react-icons/fa';
import { MdLogin} from 'react-icons/md';

import Message from '@components/hover/Message';
import SlideIn from '@components/slidein/Style1';

import CreateComp from './create';
import CalculatorComp from './calculator';
import ItemsComp from './items';
import FavouriteComp from './favourite';

const Navbar = () => {

  const {onSetTheme, theme} = useContext(Context);

  const {isLoggedIn} = useAppSelector(state => state.authentication)

  return (
    <div className={styles.container}>

      <nav>
        <Message message='Home'>
          <Link className={styles.button}  to="/"><AiFillHome/></Link>
        </Message>
        { !isLoggedIn ?
          <Message message={"Login"}><Link className={styles.button} to="/login"><MdLogin/></Link></Message>
          :
          <Message message={"Profile"}><Link className={styles.button} to="/profile"><AiOutlineUser/></Link></Message>
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
        {theme.name === "sunset" &&
          <Message message='Sunset'>
            <button className={styles.button} onClick={onSetTheme}><BsSunsetFill/></button>
          </Message>
        }
        {theme.name === "ocean" &&
          <Message message='Ocean'>
            <button className={styles.button} onClick={onSetTheme}><FaWater/></button>
          </Message>
        }
        {theme.name === "thunder" &&
          <Message message='Thunder'>
            <button className={styles.button} onClick={onSetTheme}><AiFillThunderbolt/></button>
          </Message>
        }
      </nav>

      <nav>
        <SlideIn 
            width={350} 
            icon={<Message message='Search'><button className={styles.button}><AiOutlineSearch/></button> </Message>}
          >
            <ItemsComp />
        </SlideIn>

        <SlideIn 
            width={350} 
            icon={<Message message='Favourite'><button className={styles.button}><FaStar/></button> </Message>}
            iconOpen={<FaStar className={styles.star}/>}
          >
            <FavouriteComp />
        </SlideIn>

      {isLoggedIn &&
        <>
          <SlideIn 
            width={350} 
            iconOpen="Calculator"
            icon={<Message message='Calculator'><button className={styles.button}><BiCalculator/></button> </Message>}
          >
            <CalculatorComp />
          </SlideIn>

          <SlideIn 
            width={350} 
            icon={<Message message='Transaction'><button className={styles.button}><AiFillFileAdd/></button> </Message>}
          >
            <CreateComp />
          </SlideIn>

          <Message message='Stocks'>
            <Link className={styles.button} to="/items"><FaStoreAlt/></Link>
          </Message>
        </> 
        }
      </nav>

    </div>
  )
}

export default Navbar