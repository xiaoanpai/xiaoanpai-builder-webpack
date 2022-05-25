'use strict'
// import React from "react"
// import './search.less'
// import maidanglao from './image/maidanglao.jpeg'

const React = require('react');
const maidanglao = require('./image/maidanglao.jpeg')
require('./search.less')
class Search extends React.Component {
    loadComponent = () => { }
    render() {
        return <div className="search_test">
            {funcA}
            <img src={maidanglao}></img>
            Search page内容</div>
    }
}

// ReactDOM.render(<Search></Search>, document.getElementById('root'))

module.exports = <Search></Search>