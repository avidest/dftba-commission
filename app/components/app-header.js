import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  NavDropdown,
  Image
} from 'react-bootstrap'

export default function AppHeader(props) {
  let {profile, handleLogout, route} = props

  let user = profile ? (<span>
    <Image src={profile.picture} circle style={{maxHeight: '20px', marginTop: '-2px'}} /> {profile.name}
  </span>) : null;

  return <div>
    <Navbar inverse staticTop className="dftba">
      <Navbar.Header>
        <Navbar.Brand className="dftba-brand">
          <Link to="/" onlyActiveOnIndex>DFTBA</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      <Navbar.Collapse>
        {profile && <div>
          {profile.role === 'admin' ? <AdminNav/> : <CreatorNav/>}
        </div>}

        {profile && <Nav pullRight>
          <NavDropdown eventKey={1} title={user} id="user-menu">
            <LinkContainer to="/profile">
              <MenuItem eventKey={'user-menu-profile'}>
                Edit Profile
              </MenuItem>
            </LinkContainer>
            <MenuItem eventKey={'user-menu-logout'} onClick={handleLogout}>
              Logout
            </MenuItem>
          </NavDropdown>
        </Nav>}
      </Navbar.Collapse>
    </Navbar>
  </div>
}

function AdminNav(props) {
  return <Nav>
    <LinkContainer to="/admin" onlyActiveOnIndex>
      <NavItem eventKey={1}>Dashboard</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/orders">
      <NavItem eventKey={1}>Orders</NavItem>
    </LinkContainer>
    <LinkContainer to="/admin/users">
      <NavItem eventKey={1}>Users</NavItem>
    </LinkContainer>
  </Nav>
}

function CreatorNav(props) {
  return <Nav>
    <LinkContainer to="/creators">
      <NavItem eventKey={1}>Dashboard</NavItem>
    </LinkContainer>
  </Nav>
}