import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Input, Button } from 'wps-antd';
import {trim} from 'helpers'

import 'styles/components/search-input';

const InputGroup = Input.Group;

class SearchInput extends Component{

    static PropTypes = {
        onSearch : PropTypes.func.isRequired,
        placeholder : PropTypes.string,
        isRequired: PropTypes.bool
    }

    state = {
        value: '',
        focus: false,
    }

    handleInputChange(e) {
        const v = e.target.value || ''
        const compact = v.replace(/\s+/g,"")
        if (this.props.isRequired && compact.length === 0 && v.length !== 0 ) {
            e.target.value = ''
        } else {
            this.props.onSearch(e.target.value);
            this.setState({ value: e.target.value });
        }
    }

    handleFocusBlur(e) {
        this.setState({ focus: e.target === document.activeElement });
    }

    handleSearch() {
        if(!this.state.value) return;
        if (this.props.onSearch) {
            //第二个参数 isFromEnter 是否由回车触发
            this.props.onSearch(this.state.value, true);
        }
    }

    componentWillMount(){
        // let {value} = this.props
        // if(value){
        this.setState({value: this.props.value ||this.props.defaultValue})
        // }
    }

    componentWillReceiveProps(nextProps){
        // 暂时注释
        if(typeof nextProps.value === 'undefined'){
            return;
        }
        if(nextProps.value != this.state.value){
            this.setState({value: nextProps.value || ''})
        }
    }

    render() {
        const { style, size, placeholder } = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!trim(this.state.value),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });
        const inputProps = {
            placeholder: placeholder,
            onChange: ::this.handleInputChange,
            onFocus: ::this.handleFocusBlur,
            onBlur: ::this.handleFocusBlur,
            onPressEnter: ::this.handleSearch,
            maxLength: "40",
            [(typeof this.props.value === 'undefined') ? 'defaultValue' : 'value']: this.state.value
        }

        return (
            <div className="ant-search-input-wrapper" style={style}>
                <InputGroup className={searchCls}>
                    <Input {...inputProps} />
                    <div className="ant-input-group-wrap">
                        <Button icon="search" className={btnCls} size={size} onClick={::this.handleSearch} />
                    </div>
                </InputGroup>
            </div>
        );
    }
}

export default SearchInput
