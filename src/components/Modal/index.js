import React from "react";
import styled from "styled-components";
import { Transition } from "react-transition-group";
import PropTypes from "prop-types";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 300ms ease-in-out;
  z-index: ${({ state }) =>
    state === "entering" || state === "entered" || state === "exiting"
      ? "1"
      : "-1"};
  opacity: ${({ state }) =>
    state === "entering" || state === "entered" ? 1 : 0};
`;

const ModalBackground = styled.div`
  overflow: auto;
  background: #f7f7f7;
  height: 100%;
  width: 100%;
  right: 0;
  z-index: 3;
  position: fixed;
  top: 0;
  box-shadow: 0px 0 20px #666;
  transition: transform 300ms ease-in-out;
  transform: translateX(
    ${({ state }) => (state === "entering" || state === "entered" ? 0 : 110)}%
  );
  padding: 20px;

  @media (min-width: 900px) {
    width: ${props => props.width || "50%"};
  }
`;

const Modal = ({
  isModalOpened,
  closeModal,
  children,
  style,
  width,
  showOverlay
}) => (
  <Transition in={isModalOpened} timeout={250}>
    {state => (
      <React.Fragment>
        {showOverlay && <Overlay state={state} onClick={closeModal} />}
        <ModalBackground state={state} style={style} width={width}>
          {children}
        </ModalBackground>
      </React.Fragment>
    )}
  </Transition>
);

Modal.propTypes = {
  isModalOpened: PropTypes.bool,
  closeModal: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object,
  width: PropTypes.string,
  showOverlay: PropTypes.bool
};

Modal.defaultProps = {
  isModalOpened: false,
  closeModal: () => {},
  children: null,
  style: {},
  width: "50%",
  showOverlay: true
};

export default Modal;
