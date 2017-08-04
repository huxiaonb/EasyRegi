import React, { Component } from 'react'
import './less/loading.less';

export default ()=>(
    <div className="components-loading-box">
       <div className='loader-container'>
           <div className='right-side'>
               <div className='bar'></div>
           </div>
           <div className='left-side'>
               <div className='bar'></div>
           </div>
       </div>
    </div>
)