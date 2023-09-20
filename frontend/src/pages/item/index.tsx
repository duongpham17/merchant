import { useParams } from 'react-router-dom';
import GEOsrs from '@data/osrs-ge';
import { firstcaps } from '@utils/functions';

import Label1 from '@components/labels/Style1';
import Line from '@components/line/Style1';
import Container from '@components/containers/Style1';

import Chart from './chart';

const ItemIndex = () => {

  const [params] = [useParams()];

  const id: string = params.id || "";

  const item = GEOsrs.find(el => el.id.toString() === id);

  if(!item){
    return (
      <div>
        <p>Cant find item</p>
      </div>
    )
  };

  return (
    <Container>

      <Label1 
        name={ <img src={`https://oldschool.runescape.wiki/images/${firstcaps(item.icon.replaceAll(" ", "_"))}`} alt="osrs" />}
        value={item.name}
      />

      <Line 
        color='main' 
      />

      <Chart
        item={item}
      />

    </Container>
  );
}

export default ItemIndex