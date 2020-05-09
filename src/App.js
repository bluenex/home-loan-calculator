import React from "react";
import { createGlobalStyle } from "styled-components";
import HomeLoanCalculator from "./components/HomeLoanCalculator";

const GlobalStyle = createGlobalStyle`
  html, body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

export default function App() {
  return (
    <div>
      <GlobalStyle />
      <HomeLoanCalculator />
    </div>
  );
}
