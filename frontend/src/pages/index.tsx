import styles from './Pages.module.scss'
import {Routes, Route} from 'react-router-dom';

import Private from './Private';

import Home from 'pages/home';
import Items from 'pages/items';
import Unknown from 'pages/unknown';
import Authentication from 'pages/authentication';
import Confirmation from './confirmation';
import Profile from './profile';

const Pages = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/items" element={<Items/>} />
        <Route path="/login" element={<Authentication/>} />
        <Route path="/confirm/:token" element={<Confirmation/>} />
        <Route path="/profile" element={<Private component={Profile} /> } />
        <Route path="*" element={<Unknown/>} />
      </Routes>
    </div>
  )
}

export default Pages