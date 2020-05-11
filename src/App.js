import React from "react";
import { createGlobalStyle } from "styled-components";
import HomeLoanCalculator from "./components/HomeLoanCalculator";
import { Helmet } from "react-helmet";

const GlobalStyle = createGlobalStyle`
  html, body {
    font-family: 'Chakra Petch', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

export default function App() {
  return (
    <div>
      <Helmet>
        <title>Home Loan Calculator</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <GlobalStyle />
      <HomeLoanCalculator />
    </div>
  );
}
