import styled from "styled-components";

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f8f7f7 100%);
  padding: 2.3rem;
  box-sizing: border-box;
`;

export const LayoutContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  overflow-x: hidden;
`;
