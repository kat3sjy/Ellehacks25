
import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav style={styles.navBar}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/meal_planning" style={styles.link}>Meal Planning</Link>
      <Link to="/active_living" style={styles.link}>Active Living</Link>
    </nav>
  );
};

// Basic inline styles for the navigation bar
const styles = {
  navBar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
  },
};

export default NavBar;