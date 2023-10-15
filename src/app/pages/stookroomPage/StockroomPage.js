import React,{useState} from 'react';
import StockroomPageList  from './StockroomPageList';
import StockroomPageAdd from './StockroomPageAdd';
import StockEdit from './StockroomPageEdit';

export function StockRoomPage() {
    return (<div>
            <StockroomPageList></StockroomPageList>
            <StockroomPageAdd></StockroomPageAdd>
            <StockEdit></StockEdit>

        </div>)
}

export default StockRoomPage;