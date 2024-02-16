import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currencyList, setCurrencyList] = useState([]);
  const [toFromAmountCurrency, setToFromAmountCurrency] = useState({
    to: "",
    from: "",
    amount: "",
  });

  const [convertedAmount, setConvertedAmount] = useState("");
  const [toCurrencyJson, setToCurrencyJson] = useState({});
  useEffect(() => {
    getCurrencyList();
  }, []);

  const getCurrencyList = async () => {
    const data = await fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json"
    );
    const response = await data.json();
    let currencyListData = [];
    for (let currency in response) {
      currencyListData.push({ label: response[currency], value: currency });
    }
    setCurrencyList(currencyListData);
  };

  useEffect(() => {
    if (toFromAmountCurrency.from) {
      callToApi().then((response) => setToCurrencyJson(response));
    }
  }, [toFromAmountCurrency.from]);

  const convertToAmount = () => {
    if (toFromAmountCurrency.to) {
      setConvertedAmount(
        toCurrencyJson[toFromAmountCurrency.to] * toFromAmountCurrency.amount
      );
    }
  };

  const callToApi = async () => {
    const data = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${toFromAmountCurrency.from}.json`
    );
    const response = await data.json();

    return response[toFromAmountCurrency.from];
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setToFromAmountCurrency({ ...toFromAmountCurrency, [name]: value });
  };

  const interChange = () => {
    let obj = { ...toFromAmountCurrency };
    let temp = obj.to;
    obj.to = obj.from;
    obj.from = temp;
    setToFromAmountCurrency(obj);
  };

  return (
    <div className="App">
      <div className="converter-container border rounded">
        <h5 className="text-center p-3 bg-info ">Currency Converter</h5>
        <div className="m-3">
          <div>Amount</div>
          <input
            name="amount"
            value={toFromAmountCurrency.amount}
            onChange={changeHandler}
            type="number"
            className="form-control form-control"
            placeholder="Enter Amount"
          />
        </div>
        <div className="m-3">
          <div>From</div>
          <select
            name="from"
            value={toFromAmountCurrency.from}
            onChange={changeHandler}
            className="form-select form-select"
          >
            <option value={""}>--Select--</option>
            {currencyList.map((data) => (
              <option value={data.value}>{data.label}</option>
            ))}
          </select>
        </div>
        <div className="m-2 text-center">
          <span
            role="button"
            className="p-1 bg-success rounded"
            onClick={interChange}
          >
            &uarr;&darr;
          </span>
        </div>
        <div className="m-3">
          <div>To</div>
          <select
            name="to"
            value={toFromAmountCurrency.to}
            onChange={changeHandler}
            className="form-select form-select"
          >
            <option value={""}>--Select--</option>
            {currencyList.map((data) => (
              <option value={data.value}>{data.label}</option>
            ))}
          </select>
        </div>
        <div className="m-2 text-center ">
          <button className="btn btn btn-primary" onClick={convertToAmount}>
            Convert
          </button>
        </div>
        <div className="text-center mt-3 border-top bg-warning p-2">
          <h4>Converted Amount</h4>
          <h2 className="mb-0 text-secondary ">{convertedAmount && convertedAmount}</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
