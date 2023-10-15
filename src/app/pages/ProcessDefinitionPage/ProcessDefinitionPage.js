import React,{useState} from 'react';
import ProcessDefinitionPageList  from './ProcessDefinitionPageList';
import ProcessDefinitionPageAdd from './ProcessDefinitionPageAdd';
import ProcessDefinitionPageEdit from './ProcessDefinitionPageEdit'
export function ProcessDefinitionPage() {
    return (<div>
            <ProcessDefinitionPageList></ProcessDefinitionPageList>
            <ProcessDefinitionPageAdd></ProcessDefinitionPageAdd>
            <ProcessDefinitionPageEdit></ProcessDefinitionPageEdit>
        </div>)
}

export default ProcessDefinitionPage;