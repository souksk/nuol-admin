import React, { Component, useState, useEffect } from 'react'
import { Navbar, Image, NavDropdown, Nav } from 'react-bootstrap'
import useReactRouter from 'use-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSignOutAlt,
    faUser
} from '@fortawesome/free-solid-svg-icons';
import Consts from '../consts'

function CustomNavbar() {
    const { history, location, match } = useReactRouter()
    const [dataUser, setDataUser] = useState(null)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setDataUser(user.data)
        } else {
            history.push(`/`)
        }
    }, [])
    const _onLogout = () => {
        history.push(`/`)
        localStorage.removeItem('user');
    }
    const _onOpenProfile = () => {
        history.push(`/profile-detail`, dataUser)
    }
    return (
        <Navbar fixed='top' bg='white' style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 50, justifyContent: 'center', alignItems: 'flex-end', zIndex: 10000 }}>
            {dataUser && <div style={{ display: 'flex', flexDirection: 'row', width: '30%', height: 50, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <Nav className="mr-auto" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <NavDropdown alignRight title={dataUser.firstname + ' ' + ((dataUser.lastname) ? dataUser.lastname : '')} id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => _onOpenProfile()}><FontAwesomeIcon icon={faUser} style={{ color: Consts.PRIMARY_COLOR }} />{'\t'}Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => _onLogout()}><FontAwesomeIcon icon={faSignOutAlt} style={{ color: Consts.PRIMARY_COLOR }} />{'\t'}Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </div>}
        </Navbar>
    )
}
export default CustomNavbar