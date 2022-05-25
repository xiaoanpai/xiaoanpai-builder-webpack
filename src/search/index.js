'use strict'
import React from "react"
import ReactDOM from "react-dom"
import './search.less'
import maidanglao from './image/maidanglao.jpeg'
// import { common } from '../../common/index'
import { a } from './tree-shaking'

if (false) {
    const funcA = a()
}
class Search extends React.Component {
    loadComponent = ()=>{}
    render() {
        return <div className="search_test">
            {funcA}
            <img src={maidanglao}></img>
            Search page内容</div>
    }
}

ReactDOM.render(<Search></Search>, document.getElementById('root'))