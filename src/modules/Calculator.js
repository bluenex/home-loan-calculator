class Calculator {
  static _thousandSeparator(value) {
    const parts = String(value).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  // taken from https://gist.github.com/pies/4166888#file-excelformulas-js-L16-L30
  static _pmt(ir, nper, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (ir === 0) return -(pv + fv) / nper;

    const pvif = Math.pow(1 + ir, nper);
    let pmtResult = (ir / (pvif - 1)) * -(pv * pvif + fv);

    if (type === 1) {
      pmtResult /= 1 + ir;
    }

    return pmtResult;
  }

  static _isObjEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static _getStepValue(ind, stepsObj) {
    if (!stepsObj || this._isObjEmpty(stepsObj)) {
      return null;
    }

    const stepKeys = Object.keys(stepsObj);
    const indexOfStep =
      stepKeys
        .map(stepKey => ind + 1 > Number(stepKey))
        .filter(isTrue => isTrue).length - 1;

    if (indexOfStep < 0) {
      return null;
    }

    return stepsObj[stepKeys[indexOfStep]];
  }

  static _eachMonthInterest(pv, ir, numOfDays) {
    return Array.from({ length: numOfDays }, (_, ind) => ind).reduce(
      (acc, _) => {
        const thisDayInterest = ((ir / 365) * (pv + acc)) / 100;
        return acc + thisDayInterest;
      },
      0
    );
  }

  static calculatePaymentTableData(
    initial,
    ir,
    installment,
    noOfPayments,
    paymentSteps,
    interestSteps
  ) {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let pv = initial;
    let totalInitialPaid = 0;
    let totalInterestPaid = 0;
    let totalPaid = 0;

    const paymentTableData = [];

    Array.from({ length: noOfPayments + 1 }, (_, ind) => ind).some((_, ind) => {
      const thisMonthInstallment =
        this._getStepValue(ind, paymentSteps) || installment;
      const thisMonthIr = this._getStepValue(ind, interestSteps) || ir;

      const thisMonthInterest = this._eachMonthInterest(
        pv,
        thisMonthIr,
        days[ind % days.length]
      );

      let initialPaid = thisMonthInstallment - thisMonthInterest;

      if (pv < initialPaid) {
        initialPaid = pv;
      }

      pv = pv - initialPaid;
      totalInitialPaid += initialPaid;
      totalInterestPaid += thisMonthInterest;
      totalPaid = totalPaid + initialPaid + thisMonthInterest;

      const eachMonthData = {
        count: ind + 1,
        ir: thisMonthIr.toFixed(3),
        pv: this._thousandSeparator(pv.toFixed(2)),
        paid: this._thousandSeparator(
          (initialPaid + thisMonthInterest).toFixed(2)
        ),
        initialPaid: this._thousandSeparator(initialPaid.toFixed(2)),
        interestPaid: this._thousandSeparator(thisMonthInterest.toFixed(2)),
        totalInitialPaid: this._thousandSeparator(totalInitialPaid.toFixed(2)),
        totalInterestPaid: this._thousandSeparator(
          totalInterestPaid.toFixed(2)
        ),
        totalPaid: this._thousandSeparator(totalPaid.toFixed(2))
      };

      if (pv === 0) {
        paymentTableData.push(eachMonthData);
        return true;
      }

      paymentTableData.push(eachMonthData);
      return false;
    });

    return paymentTableData;
  }

  static calculateExpectedInstallment(
    initial,
    ir,
    noOfPayments,
    compensate = false
  ) {
    // monthly calculated by PMT
    const mtl = this._pmt(
      compensate ? (ir + 1) / 1200 : ir / 1200,
      noOfPayments,
      initial
    );
    // return abs and round
    return Math.ceil(Math.abs(mtl / 100)) * 100;
  }
}

export default Calculator;
