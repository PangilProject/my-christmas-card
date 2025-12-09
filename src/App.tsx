import styled from "styled-components";
import AppRouter from "./routes/AppRouter";

const FooterContainer = styled.footer`
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  bottom: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  & > p,
  a {
    color: #fff8e7; /* Warm White text */
    text-align: center;
    font-size: 0.8rem;
    line-height: 0.8;
  }
  z-index: 100; /* Ensure it's above other content */
`;

function App() {
  return (
    <>
      <AppRouter />
      <FooterContainer>
        <p>&copy; {new Date().getFullYear()} pangil. All rights reserved.</p>
        <a href="https://forms.gle/jWHqGk64oxiZZ81RA" target="_blank">
          <u>문의하기</u>
        </a>
      </FooterContainer>
    </>
  );
}

export default App;
