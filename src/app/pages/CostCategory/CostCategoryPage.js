import React from 'react';
import CostCategoryList from './CostCategoryList';
import CostCategoryAdd from './CostCategoryAdd';
import CostCategoryEdit from './CostCategoryEdit';
export class CostCategoryPage extends React.Component {
    render() {
        return (
            <>
                <CostCategoryList />
                <CostCategoryAdd/>
                <CostCategoryEdit/>
            </>
        );
    }
}

export default CostCategoryPage