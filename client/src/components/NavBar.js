import { Nav, Navbar, Container } from 'react-bootstrap'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineUserAdd, HiOutlineLogout } from "react-icons/hi";
import { FaRegUser } from "react-icons/fa"
import './NavBar.css'

function NavBar({ currentUser }) {
    const [expanded, updateExpanded] = useState(false);

    return (
        <Navbar expanded={expanded} expand="md" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">מזג האוויר</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => updateExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto" ref={(node) => {
                        if (node) {
                            node.style.setProperty("direction", "rtl", "important");
                        }
                    }}>
                        {currentUser ? (
                            <>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                                        <AiOutlineHome style={{ marginBottom: "2px" }} /> בית
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/logout" onClick={() => updateExpanded(false)}>
                                        <HiOutlineLogout style={{ marginBottom: "2px" }} /> התנתקות
                                    </Nav.Link>
                                </Nav.Item>
                            </>
                        ) : (
                            <>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/login" onClick={() => updateExpanded(false)}>
                                        <FaRegUser style={{ marginBottom: "2px" }} /> התחברות
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="/register" onClick={() => updateExpanded(false)}>
                                        <HiOutlineUserAdd style={{ marginBottom: "2px" }} /> הרשמה
                                    </Nav.Link>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default NavBar;