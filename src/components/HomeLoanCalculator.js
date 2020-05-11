import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Calculator from "../modules/Calculator";
import Table from "./Table";

const Container = styled.div`
  color: #333;

  .align-box {
    width: max-content;
    margin: 0 auto;
    text-align: left;
    margin-bottom: 1em;
  }

  hr {
    border: 2px solid #ddd;
    border-radius: 10px;
    width: 85%;
  }

  form {
    font-size: 1.15em;
    text-align: center;
    margin-bottom: 1em;

    input {
      font-size: 0.75em;
      min-width: 320px;
      width: 100%;
      /* border: none; */
      border: 2px solid #ddd;
      border-radius: 3px;
      padding: 5px;
      margin-bottom: 0.45em;
      margin-top: 0.25em;
    }

    label {
      padding-right: 8px;
    }

    button {
      border: 1px solid #666;
      background-color: #ccc;
      color: #000;

      padding: 5px 12px;
      border-radius: 3px;
      font-size: 0.95em;
      cursor: pointer;
      outline: none;

      :hover {
        background-color: #ddd;
        color: #000;
      }

      :active {
        background: #333;
        color: #fff;
      }
    }
  }

  table {
    // for responsive rendering
    display: block;
    overflow-x: scroll;
    font-variant-numeric: tabular-nums;

    tbody {
      td {
        padding: 5px 10px;

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
        text-align: center;
      }
      h4 {
        margin: 0;
      }
    }
    tr {
      :not(:nth-child(odd)) {
        background-color: #e6e6e6;
      }
      td {
        border: none;
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
        Header: "งวดที่",
        accessor: "count"
      },
      {
        Header: "อัตราดอกเบี้ย",
        accessor: "ir"
      },
      {
        Header: "เงินต้นคงเหลือ",
        accessor: "pv"
      },
      {
        Header: "ค่างวด",
        accessor: "paid"
      },
      {
        Header: "เป็นเงินต้น",
        accessor: "initialPaid"
      },
      {
        Header: "เป็นดอกเบี้ย",
        accessor: "interestPaid"
      },
      {
        Header: "เงินต้นสะสม",
        accessor: "totalInitialPaid"
      },
      {
        Header: "ดอกเบี้ยสะสม",
        accessor: "totalInterestPaid"
      },
      {
        Header: "สุทธิ",
        accessor: "totalPaid"
      }
    ],
    []
  );

  const data = useMemo(() => paymentTableData, [paymentTableData]);

  const watchYear = watch("year");
  const watchInstallment = watch("installment");
  const lastInstallmentObj =
    paymentTableData.length > 0 &&
    paymentTableData[paymentTableData.length - 1];

  return (
    <Container>
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
            } else {
              setPaymentTableData([]);
            }
          } else {
            setExpectedInstallment(null);
            setPaymentTableData([]);
          }
        })}
      >
        <div className="align-box">
          <h1>Home Loan Calculator</h1>
          <div>
            <label htmlFor="initial">ยอดกู้:</label>
            <br />
            <input name="initial" type="number" step="any" ref={register()} />
          </div>
          <div>
            <label htmlFor="ir">อัตราดอกเบี้ย (% ต่อปี):</label>
            <br />
            <input name="ir" type="number" step="any" ref={register()} />
          </div>
          <div>
            <label htmlFor="year">จำนวนปีที่ผ่อนชำระ:</label>
            <br />
            <input name="year" type="number" step="any" ref={register()} />
          </div>
          <div>
            <label htmlFor="installment">เงินค่างวด:</label>
            <br />
            <input
              name="installment"
              type="number"
              step="any"
              ref={register()}
            />
          </div>
          <div>
            <label htmlFor="installmentSteps">
              ค่างวดลำดับขั้น (optional):
            </label>
            <br />
            <input
              name="installmentSteps"
              type="text"
              step="any"
              ref={register()}
            />
          </div>
          <div>
            <label htmlFor="irSteps">ดอกเบี้ยลำดับขั้น (optional):</label>
            <br />
            <input name="irSteps" type="text" step="any" ref={register()} />
          </div>
        </div>
        <button type="submit">คำนวณ</button>
      </form>
      {expectedInstallment ? (
        <>
          <hr />
          <div className="align-box">
            <h2>ผลการคำนวณ</h2>
            <h3>ค่างวดต่อเดือนจนครบสัญญา</h3>
            <p>
              ค่างวดต่อเดือน (ครบ {watchYear} ปี): ~
              {Calculator._thousandSeparator(expectedInstallment)} บาท
            </p>
            {lastInstallmentObj ? (
              <>
                <h3>
                  ค่างวดที่กำหนดเอง (
                  {Calculator._thousandSeparator(watchInstallment)} บาท)
                </h3>
                <p>
                  จำนวนงวดทั้งสิ้น: {lastInstallmentObj.count} งวด (
                  {(lastInstallmentObj.count / 12).toFixed(2)} ปี)
                </p>
                <p>
                  ชำระทั้งสิ้น:{" "}
                  {lastInstallmentObj.totalPaid.replace(/\.[0-9]+$/, "")} บาท
                </p>
                <p>
                  เป็นเงินต้น:{" "}
                  {lastInstallmentObj.totalInitialPaid.replace(/\.[0-9]+$/, "")}{" "}
                  บาท
                </p>
                <p>
                  เป็นดอกเบี้ย:{" "}
                  {lastInstallmentObj.totalInterestPaid.replace(
                    /\.[0-9]+$/,
                    ""
                  )}{" "}
                  บาท
                </p>
              </>
            ) : null}
          </div>
        </>
      ) : null}
      {data.length === 0 ? null : (
        <>
          <hr />
          <h2>ตารางแสดงการชำระ</h2>
          <Table defaultColumns={columns} data={data} />
        </>
      )}
    </Container>
  );
};

export default HomeLoanCalculator;
