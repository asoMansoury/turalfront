import React, { useEffect } from 'react';
import './tableStyle.css';

export const TableLog=(props)=>{
    const [head,setHead]= React.useState([]);
    useEffect(()=>{
        setHead(props.headRows)
    },[])
    return (
    <table class="styled-table" id="tableLog"  style={{borderRadius: '24px'}}>
        <tbody>
            <tr style={{color:'white',background:'#6f42c1'}}>
                {
                    head.map((item,index)=>{
                        return <td>{item.label}</td>;
                    })
                }
                
            </tr>
            {props.children}

        </tbody>
    </table>

    )
}

export default TableLog;