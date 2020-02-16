import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

import { Container, Row, Col, Card } from 'react-bootstrap';

import logo from "./logo.png";

export default ({ accounts }) => (
  <div className="App">

    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              Your Account
            </Card.Header>
            <Card.Body>
              {accounts[0]}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

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

    {/* <div className="section">
      Proposal 1:{" "}
      <ContractData contract="Moloch" method="proposalQueue" methodArgs={[0]} />
    </div> */}

    <div className="section">
      Lookup Member:{" "}
      <ContractData contract="Moloch" method="members" methodArgs={[accounts[0]]} />
    </div>


    <div className="section">
      Current Period:{" "}
      <ContractData contract="Moloch" method="getCurrentPeriod" />
    </div>

    <div className="section">
      Process Recipient Proposal:
      <ContractForm contract="Moloch" method="processRecipientProposal" />
    </div>

    <div className="section">
      Process Membership Proposal:
      <ContractForm contract="Moloch" method="processProposal" />
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
