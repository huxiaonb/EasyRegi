import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import lapi from './registerProfile/lapi'
import './less/basic.less'


class BasicView extends React.Component{
    state={
        info : {
            name : '',
            mobile : '',
            idCardNumber : '',
            currentAddress : '',
            degree :'',
            skill : [],
        }
    }
    async componentWillMount(){
        let openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
        let r = await lapi.getApplicant(openId);
        console.log('rrrr',r);
        if(r && r.length){
            this.setState({
                info : r[0]
            })
        }
    }
    render(){
        let {info} = this.state;
        return(
            <div>
                
            </div>
        )
    }
}