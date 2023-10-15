import React from 'react';
import BalanceStockPage from './BalanceStockPage';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, {mount} from 'enzyme';
import BalanceStockAdd from './BalanceStockAdd';
import sinon from 'sinon';

Enzyme.configure({adapter:new Adapter()});


describe('<BalanceStockPage>',()=>{
    it('renders number of balanceSTocks',()=>{
        const wrapper = mount(<BalanceStockPage></BalanceStockPage>);
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(wrapper.find(BalanceStockAdd)).toHaveLength(1);
    })
})