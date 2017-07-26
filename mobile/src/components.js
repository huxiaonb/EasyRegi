//import RegisterForm from './components/RegisterForm'
//import RegisterProfile from './components/registerProfile'
//import Profile from './components/profile'
import Index from './components/registerProfile/index'
import Company from './components/company'
import Positions from './components/positions'

// 尽量别直接用全局变量 $
const $ = jQuery

class LegoComponent{

    constructor(selector){
        this.$el = selector
    }
    // 暴露插件

    
    registerForm(...args){
        return Index(this.$el, ...args)
        //return RegisterForm(this.$el, ...args)
    }
    selectCompany(...args){
        return Company(this.$el, ...args)
    }
    nearByPositions(...args){
        return Positions(this.$el, ...args)
    }
}

const Lego = selector => {
    let $el;
    if(typeof selector === 'string' || selector.nodeType){
        $el = $(selector)
    } else {
        $el = selector
    }
    return new LegoComponent($el)
}
export default Lego


