import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import styles from '../scss/StcPipeline.module.scss';

/*
* Props
*   value: set the default value
*   items: set the choices
*   onChanged: retrive the selected item
*   placeholder: Set the placeholder
*/

export class Dropdown extends React.Component<any, any> {
    
    parent = [];
    static dropDown = [];

    setTextInputRef = null;

    static instanceNumber = 0;
    currentInstanceNumber = 0;

    constructor(props) {
        super(props);
        
        this.currentInstanceNumber = Dropdown.instanceNumber;
        this.parent[this.currentInstanceNumber] = React.createRef();
        Dropdown.dropDown[this.currentInstanceNumber] = this;

        Dropdown.instanceNumber++;

        this.state = {
            dropdownShow: false,
            width: 0,
            value: this.props.value == undefined ? null : this.props.value,
            placeholder: this.props.placeholder == undefined ? '' : this.props.placeholder,
            items: this.props.items == undefined ? [] : this.props.items,
            flexGrow: this.props.flexGrow == undefined ? false : this.props.flexGrow,
            enableSearch: this.props.enableSearch == undefined ? false : this.props.enableSearch,
            search: "",
        }

    }
 
     onDrowpDownClick = () => {
        for(let i = 0; i < Dropdown.dropDown.length; i++) {
            if (i != this.currentInstanceNumber && Dropdown.dropDown[i] != undefined) {
                if (Dropdown.dropDown[i].state.dropdownShow) {
                    Dropdown.dropDown[i].setState({ dropdownShow: false });
                }
            }
        }

        this.setState({
            width: this.parent[this.currentInstanceNumber].clientWidth + "px",
            dropdownShow: !this.state.dropdownShow 
        });
    }

    onSelectItem = async (e) => {
        let value = JSON.parse(e.currentTarget.getAttribute('data-value'));
        await this.setState({value: value, dropdownShow: false});
        if (this.props.onChange != undefined) {
            this.props.onChange(value);
        }
    }

    componentWillReceiveProps(props) {
        let placeholder = this.state.placeholder;
        let flexGrow = this.state.flexGrow;
        let value = props.value;
       
        if (props.placeholder != undefined) {
            placeholder = props.placeholder;
        }

        if (props.flexGrow != undefined) {
            if (props.flexGrow == "true") {
                flexGrow = true;
            }
        }

        this.setState({
            placeholder,
            value: value,
            items: props.items == undefined ? [] : props.items,
            flexGrow
        });

    }

    componentWillUnmount() {
        //Remove the instance in the array
        Dropdown.dropDown = Dropdown.dropDown.filter(i => i != this);
    }

    render() {
        const {dropdownShow, width, value, placeholder, items, flexGrow, enableSearch, search} = this.state;

        let flex = {};
        if (flexGrow) {
            flex = {
                flexGrow: "1"
            };
        }

        let filteredItems = [];
        if (enableSearch == "true") {
            filteredItems = items.filter(i => i.text.toLowerCase().indexOf(search.toLowerCase()) != -1 );
        } else {
            filteredItems = items;
        }

        return (
            <div className={styles.customDropdown} ref={element => { this.parent[this.currentInstanceNumber] = element }} style={flex}>
                <div className={styles.customDropdownSelected} onClick={this.onDrowpDownClick}>{value == null || items.length == 0 ? placeholder : (items.filter(i => i.value == value).length == 0 ? placeholder : items.filter(i => i.value == value)[0].text) }</div>
                <div style={{maxWidth: width, width: width}} className={dropdownShow ? `${styles.customDropdownList} ${styles.customDropdownListShow}` : `${styles.customDropdownList} ${styles.customDropdownListHide}`}>
                    {
                        enableSearch == "true" &&
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <input type="text" placeholder="Search..." value={search} onChange={e => this.setState({search: e.currentTarget.value })} />
                            </div>
                        </div>
                    }
                    {
                        filteredItems.map((item,index) => 
                            <div key={index} className={item.value == value ? `${styles.customDropdownListItem} ${styles.customDropdownListItemSelected}` : `${styles.customDropdownListItem}`} data-value={item.value} onClick={this.onSelectItem}>{item.text}</div>
                            )
                    }
                </div>
            </div>);
    }
}