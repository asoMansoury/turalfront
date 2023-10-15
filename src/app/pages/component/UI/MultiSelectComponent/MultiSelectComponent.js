import React, { Component } from "react";
import { FormControl, FormGroup, FormLabel } from "@material-ui/core";
import MultiChipSelect from "./MultiChipSelect";
export const array = [
    {
        id:1, s:'option 1'
    },
    {
        id:2, s:'option 2'
    },
    {
        id:3, s:'option 3'
    },
    {
        id:4, s:'option 5'
    },
    {
        id:5, s:'option 5'
    }
];



class MultiSelectComponent extends React.Component {
    constructor(props){
        super(props)
    }
  allItems = this.props.dataSource
    .map(s => ({ name: s.title.toString().toLowerCase() , id: s.id}));
  state = {
    items: this.allItems,
    selectedItem: []
  };

  componentWillReceiveProps(nextProps,nextState,prevProps,prevState,nextContext,prevContext){
      this.allItems = this.props.dataSource
      .map(s => ({ name: s.title.toString().toLowerCase() , id: s.id}));
        this.state = {
      items: this.allItems,
      selectedItem: []
    };
  }

 handleChange(e){
    if (this.state.selectedItem.includes(e)) {
      this.removeSelectedItem(e);
    } else {
      this.addSelectedItem(e);
    }

  };

  addSelectedItem(item) {
    this.setState(({ selectedItem, items }) => ({
      inputValue: "",
      selectedItem: [...selectedItem, item],
      items: items.filter(i => i.id !== item)
    }));
    console.log("selected",this.state.selectedItem);
  }

  removeSelectedItem = item => {
    this.setState(({ selectedItem, items }) => ({
      inputValue: "",
      selectedItem: selectedItem.filter(i => i !== item),
      items: [...items, { name: item, id: item.toLowerCase() }]
    }));
  };

  handleChangeInput = inputVal => {
    const t = inputVal.split(",");
    if (JSON.stringify(t) !== JSON.stringify(this.state.selectedItem)) {
      this.setState({ inputValue: inputVal });
    }
  };

  render() {
    const { selectedItem, items } = this.state;
    return (
      <FormGroup>
        <FormControl>
          <MultiChipSelect
            onInputValueChange={this.handleChangeInput}
            inputValue={this.state.inputValue}
            availableItems={items}
            selectedItem={selectedItem}
            onChange={this.handleChange}
            onRemoveItem={this.removeSelectedItem}
          />
          <FormLabel>{this.props.footerTitle}</FormLabel>
        </FormControl>
      </FormGroup>
    );
  }
}

export default MultiSelectComponent;
