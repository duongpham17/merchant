import styles from './Pages.module.scss'
import {Routes, Route} from 'react-router-dom';

import Private from './Private';

import Home from 'pages/home';
import Items from 'pages/items';
import Unknown from 'pages/unknown';
import Authentication from 'pages/authentication';
import Confirmation from './confirmation';
import Profile from './profile';
import Item from './item';

const Pages = () => {
  return (
    <div className={styles.container}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home/>} />
        <Route path="/item/:id" element={<Item/>} />
        <Route path="/login" element={<Authentication/>} />
        <Route path="/confirm/:token" element={<Confirmation/>} />

        {/* PRIVATE ROUTES */}
        <Route path="/items" element={<Private component={Items} /> } />
        <Route path="/profile" element={<Private component={Profile} /> } />

        <Route path="*" element={<Unknown/>} />
      </Routes>
    </div>
  )
}

export default Pages