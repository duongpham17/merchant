import react from 'react';

import UseContext from './Context';
import Search from './search';
import Margin from './margin';
import Pagination from './pagination';

const Home = () => {

  return (
    <UseContext>

      <Margin />

      <Search />

      <Pagination />

    </UseContext>
  )
}

export default Home