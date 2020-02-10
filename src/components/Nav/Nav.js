import styled from "styled-components";

const Nav = styled.nav`
  position: fixed;
  background: ${props => props.theme.colors.darkYellow};
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  ${props => props.theme.padded}

  @media(max-width: 900px) {
    .menu {
      li,
      span {
        display: none !important;
      }

      li.visible-mobile {
        display: block !important;
      }
    }
  }

  .logo {
    img {
      height: 40px;
    }
  }

  .menu {
    list-style-type: none;
    display: flex;

    li {
      a {
        text-decoration: none;
        color: #000;
        font-size: 18px;
        margin: 0 10px;
      }
      a.featured {
        font-family: "Gotham";
        font-weight: 500;
        color: ${props => props.theme.colors.darkBlue};
      }
    }
  }
`;

export default Nav;
