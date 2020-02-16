import React, { Component } from 'react';
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

import { Container, Row, Col, Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';

class MyComponent extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {

    return (
  <div className="App">

    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              Your Account
            </Card.Header>
            <Card.Body>
              {this.props.accounts[0]}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              DAO Stats
            </Card.Header>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Total Shares: <ContractData contract="Moloch" method="totalShares" /></ListGroupItem>
              <ListGroupItem>Current Period: <ContractData contract="Moloch" method="getCurrentPeriod" /></ListGroupItem>
              <ListGroupItem>Current Grant Recipient: <ContractData contract="Moloch" method="recipient" /></ListGroupItem>
              <ListGroupItem>Number Of Proposals: <ContractData contract="Moloch" method="getProposalQueueLength" /></ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h3>Propose Recipient Change</h3>
          <Form>
            <Form.Group>
              <Form.Label>New Recipient</Form.Label>
              <Form.Control type="input" placeholder="address" />
            </Form.Group>

            <Form.Group>
              <Form.Label>Proposal Details</Form.Label>
              <Form.Control type="input" />
            </Form.Group>

            <Form.Group>
              <Button variant="primary">Submit</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>

    {/* <div className="section">
      Proposal 1:{" "}
      <ContractData contract="Moloch" method="proposalQueue" methodArgs={[0]} />
    </div> */}

    {/* <div className="section">
      Lookup Member:{" "}
      <ContractData contract="Moloch" method="members" methodArgs={[accounts[0]]} />
    </div> */}

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
  }
}

export default MyComponent;
