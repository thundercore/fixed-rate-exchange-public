import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "components/Input";
import Button from "components/Button";
import { useExchangeFactoryContract } from "hooks/useContract";
import { emptyAddress, showError } from "utils";
import { toWei } from "utils/ethers";

const inputFields = {
  token0: { name: "token 0 address" },
  token1: { name: "token 1 address" },
  clientContract: { name: "client contract" },
  rate0To1: { name: "exchange rate from token 0 to token 1", type: "number" },
  rate1To0: { name: "exchange rate from token 1 to token 0", type: "number" },
};

function CreatePair({ setpairCreateCount }) {
  const factoryContract = useExchangeFactoryContract();
  const [isLoading, setisLoading] = useState(false);
  const [isCreatePairOpen, setisCreatePairOpen] = useState(false);
  const [inputValues, setinputValues] = useState({
    token0: "",
    token1: "",
    clientContract: "",
    rate0To1: "",
    rate1To0: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisLoading(true);
      const tx = await factoryContract.createPair(
        inputValues.token0,
        inputValues.token1,
        inputValues.clientContract || emptyAddress,
        toWei(inputValues.rate0To1),
        toWei(inputValues.rate1To0)
      );
      await tx.wait();
      setisLoading(false);
      setpairCreateCount((prev) => prev + 1);
      alert("pair created successfully");
    } catch (error) {
      showError(error);
      setisLoading(false);
    }
  };

  const onChange = (name, value) => {
    setinputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="mb-8">
      <div className="message w-2/3">
        <button
          type="button"
          className="w-full flex items-center justify-items-start py-2 pl-2"
          onClick={() => setisCreatePairOpen((prev) => !prev)}
        >
          <span>Create New Pair</span>
        </button>
        {isCreatePairOpen && (
          <div className="message-body">
            <form className="field" onSubmit={handleSubmit}>
              <div className="mb-4">
                {Object.keys(inputFields).map((key) => (
                  <Input
                    key={key}
                    name={inputFields[key].name}
                    value={inputValues[key]}
                    onChange={(e) => onChange(key, e.target.value)}
                    type={inputFields[key].type}
                  />
                ))}
              </div>
              <Button isLoading={isLoading} type="submit">
                <p>Submit</p>
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

CreatePair.propTypes = {};

export default CreatePair;
