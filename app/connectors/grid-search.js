import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {
  FormControl,
  FormGroup,
  InputGroup,
  Button
} from 'react-bootstrap'
import Icon from '../components/icon'
import debounce from 'lodash/debounce'

export default class SearchForm extends Component {

  constructor(props) {
    super(props)
    this.search = val => this.props.onSearch(val)
  }

  handleSearch(e) {
    e.preventDefault()
    var node = ReactDOM.findDOMNode(this.refs.searchform)
    this.search(node.value)
    return node.value
  }

  handleKeyup(e) {
    let blist = [13]
    if (blist.indexOf(e.which) < 0) {
      this.handleSearch(e)
    }
  }

  render() {
    return <form onSubmit={::this.handleSearch}>
      <FormGroup id="grid-search">
        <InputGroup>
          <FormControl ref="searchform"
                       type="search"
                       componentClass="input"
                       placeholder="Search for title, handle or vendor..."
                       value={this.props.value}
                       onKeyUp={::this.handleKeyup}
                       onChange={::this.handleKeyup} />
          <InputGroup.Button>
            <Button type="submit"><Icon type="search" /></Button>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    </form>
  }
}