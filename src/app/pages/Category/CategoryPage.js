import React from 'react';
import CategoryList from './CategoryList';
import CategoryAdd from './CategoryAdd';
import CategoryEdit from './CategoryEdit';
export class CategoryPage extends React.Component {
    render() {
        return (
            <>
                <CategoryList />
                <CategoryAdd/>
                <CategoryEdit/>
            </>
        );
    }
}