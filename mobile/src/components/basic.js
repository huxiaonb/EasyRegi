import React from 'react';
import ReactDOM from 'react-dom';
import lapi from './registerProfile/lapi'
import './less/basic.less'
import BasicForm from './basicform';
import BasicView from './basicView';
import {Toast} from 'antd-mobile';

const openId = $('#openId').text();

class Basic extends React.Component{
    state={
        editFlag : false,
        next : false,
        info : {},
        load :true,
    }
    async componentWillMount(){
        //let openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
        let r = await lapi.getApplicant(openId);
        if(r && r.length){
            //console.log(r[0])
            this.setState({
                editFlag : true,
                info : r[0],
                load : false
            })
        }else{
            this.setState({
                load :false
            })
        }
    }
    onEdit(){
        this.setState({
            next : true
        })
    }
    render(){
        let {editFlag, info, next,load} = this.state;
        
        if(load){
            return(<div></div>);
        }
        if(!!next){
            return (<BasicForm info={info}/>)
        }
        return(
            editFlag ? <BasicView info={info} onEdit={this.onEdit.bind(this)} /> : <BasicForm />
        )
    }
}
export default ($el, args) => {
    $el.each(function() {ReactDOM.render(<Basic args = { args } />, this);})
}