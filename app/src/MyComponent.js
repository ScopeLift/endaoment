import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

import logo from "./logo.png";

export default ({ accounts }) => (
  <div className="App">
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Drizzle Examples</h1>
      <p>Examples of how to get started with Drizzle in various situations.</p>
    </div>

    <div className="section">
      Active Account{" "}
      {accounts[0]}
    </div>

    <div className="section">
      Total Shares:{" "}
      <ContractData contract="Moloch" method="totalShares" />
    </div>

    <div className="section">
      Current Recipient:{" "}
      <ContractData contract="Moloch" method="recipient" />
    </div>

    <div className="section">
      Proposal 1:{" "}
      <ContractData contract="Moloch" method="proposalQueue" methodArgs={[1]} />
    </div>

    <div className="section">
      Current Period:{" "}
      <ContractData contract="Moloch" method="getCurrentPeriod" />
    </div>

    <div className="section">
      Process Proposal:
      <ContractForm contract="Moloch" method="processRecipientProposal" />
    </div>

    <div className="section">
      Proposal Vote:
      <ContractForm contract="Moloch" method="submitVote" />
    </div>

    <div className="section">
      Membership Proposal:
      <ContractForm contract="Moloch" method="submitProposal" />
    </div>

    <div className="section">
      Recipient Proposal:
      <ContractForm contract="Moloch" method="submitRecipientProposal" />
    </div>
  </div>
);
