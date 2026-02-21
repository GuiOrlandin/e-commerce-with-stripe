import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--color-bg);
  position: relative;
  overflow-x: hidden;

  /* Very subtle dot pattern for depth (SaaS-style) */
  &::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: radial-gradient(
      var(--color-border) 1px,
      transparent 1px
    );
    background-size: 20px 20px;
    opacity: 0.5;
    pointer-events: none;
    z-index: 0;
  }
`;

export const LayoutContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-width);
  padding: var(--layout-padding);
  width: calc(100vw - var(--sidebar-width));
  max-width: 100%;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  min-width: 0;
  animation: contentFadeIn 0.3s ease-out;

  @keyframes contentFadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 1200px) {
    width: 100%;
    max-width: calc(var(--content-max-width) + var(--layout-padding) * 2);
    margin-left: var(--sidebar-width);
    padding-left: var(--layout-padding);
    padding-right: var(--layout-padding);
  }
`;
