import styles from './index.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';
import Search from '@components/search/Search';
import OsrsGeItems from '@data/osrs-ge'
import { firstcaps } from '@utils/functions';
import Label3 from '@components/labels/Style3'
import Label2 from '@components/labels/Style2'
import Flex from '@components/flex/Style1';
import Line from '@components/line/Style1'

const Home = () => {

  const {latest} = useAppSelector(state => state.osrs);

  return (
    <div className={styles.container}>
      <Search initialData={OsrsGeItems} dataKey={"name"}>
        {(Items) => 
          Items.slice(0, 100).map(el => 
            <div className={styles.element} key={el.id}>
              <div className={styles.image}>
                <img src={`https://oldschool.runescape.wiki/images/${firstcaps(el.icon.replaceAll(" ", "_"))}`} alt="osrs"/>
                <Label3 name={el.name} value={(latest[el.id]?.high - latest[el.id]?.low).toLocaleString()} valueColor={(latest[el.id]?.high - latest[el.id]?.low) >= 0 ? "green" : "red" }/>
              </div>
              <Line/>
              <Flex>
                <Label2 name="PRICE" value={((latest[el.id]?.high + latest[el.id]?.low) / 2).toLocaleString() || 0} />
                <Label2 name="HIGHEST" value={`H ${latest[el.id]?.high.toLocaleString()}`} color="green" />
                <Label2 name="LOWEST" value={`H ${latest[el.id]?.low.toLocaleString()}`} color="red" />
              </Flex>
            </div>
          )
        }
      </Search>
    </div>
  )
}

export default Home