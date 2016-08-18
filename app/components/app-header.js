import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import Loader from 'react-loaders'
import {
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  NavDropdown,
  Image
} from 'react-bootstrap'
import Icon from './icon'

export default function AppHeader(props) {
  let {profile, handleLogout, route, loading} = props

  let user = profile ? (<span>
    <Image src={profile.picture} circle style={{maxHeight: '20px', marginTop: '-2px'}} />
    &nbsp;{profile.user_metadata ? profile.user_metadata.name : profile.email}
  </span>) : null;

  return <div>
    <Navbar inverse fixedTop className="dftba">
      <Navbar.Header>
        <Navbar.Brand className="dftba-brand">
          <Link to="/" onlyActiveOnIndex>DFTBA</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      <Navbar.Collapse>
        {profile && <div>
          {profile.app_metadata.role === 'admin' ? <AdminNav/> : <CreatorNav/>}
        </div>}

        {profile && <Nav pullRight>
          {profile.app_metadata.role === 'admin' && <LinkContainer to="/admin/users">
            <NavItem eventKey={3}><Icon type="users" /> Users</NavItem>
          </LinkContainer>}
          <NavDropdown eventKey={1} title={user} id="user-menu">
            <LinkContainer to="/profile">
              <MenuItem eventKey={'user-menu-profile'}>
                Edit Profile
              </MenuItem>
            </LinkContainer>
            <MenuItem eventKey={'user-menu-logout'} onClick={handleLogout}>
              Logout 
              &nbsp;<Icon type="sign-out" />
            </MenuItem>
          </NavDropdown>
        </Nav>}

        {loading && <Nav className="loader-container" pullRight>
          <Loader type="line-scale" />
        </Nav>}
      </Navbar.Collapse>
    </Navbar>
  </div>
}

function AdminNav(props) {
  return <Nav>
    <LinkContainer to="/admin" onlyActiveOnIndex>
      <NavItem eventKey={1}><Icon type="tachometer" /> Dashboard</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/products">
      <NavItem eventKey={2}><Icon type="shopping-cart" /> Products</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/ledger">
      <NavItem eventKey={4}><Icon type="bar-chart" /> Ledger</NavItem>
    </LinkContainer>
  </Nav>
}

function CreatorNav(props) {
  return <Nav>
    <LinkContainer to="/creators">
      <NavItem eventKey={1}>Dashboard</NavItem>
    </LinkContainer>
    <LinkContainer to="/creators/fake">
      <NavItem eventKey={1}>404 Page</NavItem>
    </LinkContainer>
  </Nav>
}