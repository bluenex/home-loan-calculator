import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Calculator from "../modules/Calculator";
import Table from "./Table";

const Container = styled.div`
  table {
    // for responsive rendering
    display: block;
    overflow-x: scroll;

    tbody {
      td {
        :first-child {
          text-align: center;
        }

        :not(:first-child) {
          text-align: right;
        }
      }
    }

    th {
      &:first-child {
        padding-left: 1em;
      }
      h4 {
        margin: 0;
      }
    }
    tr {
      :not(:nth-child(odd)) {
        background-color: #f4f4f4;
      }
      td {
        border: none;
        /* padding is removed in layout */
        &:first-child {
          padding-left: 1em;
        }
        &:last-child {
          padding-right: 1em;
        }
      }
    }
  }
`;

const HomeLoanCalculator = () => {
  const { handleSubmit, register, watch } = useForm();
  const [expectedInstallment, setExpectedInstallment] = useState(null);
  const [paymentTableData, setPaymentTableData] = useState([]);

  // -- DATA
  const columns = useMemo(
    () => [
      {
        Header: "count",
        accessor: "count"
      },
      {
        Header: "ir",
        accessor: "ir"
      },
      {
        Header: "pv",
        accessor: "pv"
      },
      {
        Header: "paid",
        accessor: "paid"
      },
      {
        Header: "initialPaid",
        accessor: "initialPaid"
      },
      {
        Header: "interestPaid",
        accessor: "interestPaid"
      },
      {
        Header: "totalInitialPaid",
        accessor: "totalInitialPaid"
      },
      {
        Header: "totalInterestPaid",
        accessor: "totalInterestPaid"
      },
      {
        Header: "totalPaid",
        accessor: "totalPaid"
      }
    ],
    []
  );

  const data = useMemo(() => paymentTableData, [paymentTableData]);

  // const watchAll = watch();

  // useEffect(() => {
  //   console.log(watchAll);
  // }, [watchAll]);

  return (
    <Container>
      <h1>Home Loan Calculator</h1>
      <form
        onSubmit={handleSubmit(data => {
          const {
            initial,
            ir,
            installment,
            year,
            installmentSteps,
            irSteps
          } = data;

          const stepsParser = text =>
            text.split(/;\s?/).reduce((a, c) => {
              const tmp = c.split(/:\s?/);
              return { ...a, [tmp[0]]: Number(tmp[1]) };
            }, {});

          if (initial && ir && year) {
            setExpectedInstallment(
              Calculator.calculateExpectedInstallment(
                Number(initial),
                Number(ir),
                Number(year * 12)
              )
            );

            if (installment) {
              let tableData;

              if (installmentSteps && irSteps) {
                tableData = Calculator.calculatePaymentTableData(
                  Number(initial),
                  Number(ir),
                  Number(installment),
                  Number(year * 12),
                  stepsParser(installmentSteps),
                  stepsParser(irSteps)
                );
              } else {
                if (installmentSteps || irSteps) {
                  if (irSteps) {
                    tableData = Calculator.calculatePaymentTableData(
                      Number(initial),
                      Number(ir),
                      Number(installment),
                      Number(year * 12),
                      null,
                      stepsParser(irSteps)
                    );
                  }
                  if (installmentSteps) {
                    tableData = Calculator.calculatePaymentTableData(
                      Number(initial),
                      Number(ir),
                      Number(installment),
                      Number(year * 12),
                      stepsParser(installmentSteps)
                    );
                  }
                } else {
                  tableData = Calculator.calculatePaymentTableData(
                    Number(initial),
                    Number(ir),
                    Number(installment),
                    Number(year * 12)
                  );
                }
              }

              setPaymentTableData(tableData);
            }
          } else {
            setExpectedInstallment(null);
            setPaymentTableData([]);
          }
        })}
      >
        <div>
          <label htmlFor="initial">Initial:</label>
          <input name="initial" type="number" step="any" ref={register()} />
        </div>
        <div>
          <label htmlFor="ir">Interest Rate (IR):</label>
          <input name="ir" type="number" step="any" ref={register()} />
        </div>
        <div>
          <label htmlFor="installment">Installment:</label>
          <input name="installment" type="number" step="any" ref={register()} />
        </div>
        <div>
          <label htmlFor="year">Year to Pay:</label>
          <input name="year" type="number" step="any" ref={register()} />
        </div>
        <div>
          <label htmlFor="installmentSteps">
            Installment steps (optional):
          </label>
          <input
            name="installmentSteps"
            type="text"
            step="any"
            ref={register()}
          />
        </div>
        <div>
          <label htmlFor="irSteps">IR steps (optional):</label>
          <input name="irSteps" type="text" step="any" ref={register()} />
        </div>
        <button type="submit">Calculate</button>
      </form>
      <p>PMT: {expectedInstallment}</p>
      <Table defaultColumns={columns} data={data} />
    </Container>
  );
};

export default HomeLoanCalculator;
