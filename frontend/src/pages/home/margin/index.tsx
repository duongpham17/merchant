import { useContext } from 'react';
import { gp }  from '@utils/osrs';
import { Context } from '../Context';

import Flex from '@components/flex/Between';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Summary from '@components/summary/Style1';

const MarginIndex = () => {
    const {onSubmit, onChange, values, edited} = useContext(Context);

    return (
        <Summary title="Margin" background='dark'>
            <form onSubmit={onSubmit}>
                <Flex>
                    <Input 
                    label1="Lowest"
                    label2={`${gp(values.lowest)}`}
                    type="number"
                    name="lowest" 
                    placeholder='...'
                    value={values.lowest || ""} 
                    onChange={onChange} 
                    />
                    <Input 
                    label1="Highest"
                    label2={`${gp(values.highest)}`}
                    type="number"
                    name="highest" 
                    placeholder='...'
                    value={values.highest || ""} 
                    onChange={onChange} 
                    />
                </Flex>

                {edited && 
                    <Button 
                    label1="save"
                    type="submit"
                    color="blue"
                    />
                }
            </form>
        </Summary>
  )
}

export default MarginIndex