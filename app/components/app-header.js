import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {Loader} from 'react-loaders'
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
    <Navbar fluid inverse fixedTop className="dftba">
      <Navbar.Header>
        <Navbar.Brand className="dftba-brand">
          <Link to={profile && profile.app_metadata.role === 'admin' ? '/admin' : '/creator'} onlyActiveOnIndex>DFTBA</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      <Navbar.Collapse>
        {profile && <div>
          {profile.app_metadata.role === 'admin' ? <AdminNav/> : <CreatorNav/>}
        </div>}

        {profile && <Nav pullRight>
          {profile.app_metadata.role === 'admin' && <LinkContainer to="/admin/settings">
            <NavItem eventKey={5}><Icon type="cog" /> Settings</NavItem>
          </LinkContainer>}
          {profile.app_metadata.role === 'admin' && <LinkContainer to="/admin/users">
            <NavItem eventKey={4}><Icon type="users" /> Users</NavItem>
          </LinkContainer>}
          <NavDropdown eventKey={99} title={user} id="user-menu">
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
    <LinkContainer to="/admin/ledger">
      <NavItem eventKey={3}><Icon type="bar-chart" /> Ledger</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/products">
      <NavItem eventKey={2}><Icon type="shopping-cart" /> Products</NavItem>
    </LinkContainer>
  </Nav>
}

function CreatorNav(props) {
  return <Nav>
    <LinkContainer to="/creator" onlyActiveOnIndex>
      <NavItem eventKey={1}><Icon type="dashboard" /> Dashboard</NavItem>
    </LinkContainer>
    <LinkContainer to="/creator/inventory">
      <NavItem eventKey={2}><Icon type="cubes" /> My Inventory</NavItem>
    </LinkContainer>
    <LinkContainer to="/creator/expenses">
      <NavItem eventKey={2}><Icon type="arrow-circle-o-up" /> Expenses</NavItem>
    </LinkContainer>
    <LinkContainer to="/creator/income">
      <NavItem eventKey={2}><Icon type="arrow-circle-o-down" /> Income</NavItem>
    </LinkContainer>
  </Nav>
}