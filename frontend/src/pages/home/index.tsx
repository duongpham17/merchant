import styles from './index.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';
import Search from '@components/search/Search';
import OsrsGeItems from '@data/osrs-ge'
import Container from '@components/containers/Style1';
import Label from '@components/labels/Style1'

const Home = () => {

  const {latest} = useAppSelector(state => state.osrs);

  return (
    <div className={styles.container}>
      <Search initialData={OsrsGeItems} dataKey={"name"}>
        {(Items) => 
          Items.slice(0, 100).map(el => 
            <Container key={el.id} background="dark">
              <Label name={el.name} value={((latest[el.id]?.high + latest[el.id]?.low) / 2).toLocaleString() || 0} />
              <Label name={`H ${latest[el.id]?.high.toLocaleString()}`} color="green" value={`${(latest[el.id]?.high - latest[el.id]?.low).toLocaleString()}`} />
              <Label name={`L ${latest[el.id]?.low.toLocaleString()}`} color="red" />
            </Container>
          )
        }
      </Search>
    </div>
  )
}

export default Home