import React, { Component } from 'react';
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";
import PropTypes from 'prop-types'


import { Container, Row, Col, Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';

class MyComponent extends Component {

  constructor(props, context) {
    super(props);

    this.moloch = context.drizzle.contracts.Moloch

    this.state = {
      newRecipientAddressInput: "",
      newRecipientDetailsInput: "",
    }

    this.handleNewRecipientAddressInputChange = this.handleNewRecipientAddressInputChange.bind(this);
    this.handleNewRecipientDetailsInputChange = this.handleNewRecipientDetailsInputChange.bind(this);
    this.handleNewRecipientSubmit = this.handleNewRecipientSubmit.bind(this);
  }

  // HANDLERS

  handleNewRecipientAddressInputChange(event) {
    event.preventDefault();

    this.setState({
      newRecipientAddressInput: event.currentTarget.value,
    });
  }

  handleNewRecipientDetailsInputChange(event) {
    event.preventDefault();

    this.setState({
      newRecipientDetailsInput: event.currentTarget.value,
    });
  }

  handleNewRecipientSubmit(event) {
    event.preventDefault();

    this.moloch.methods.submitRecipientProposal.cacheSend(this.state.newRecipientAddressInput, this.state.newRecipientDetailsInput);
  }

  // RENDER

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
              <Form.Control type="input"
                            placeholder="address"
                            value={this.state.newRecipientAddressInput}
                            onChange={this.handleNewRecipientAddressInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Proposal Details</Form.Label>
              <Form.Control type="input"
                            value={this.state.newRecipientDetailsInput}
                            onChange={this.handleNewRecipientDetailsInputChange} />
            </Form.Group>

            <Form.Group>
              <Button variant="primary" onClick={this.handleNewRecipientSubmit}>Submit</Button>
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

MyComponent.contextTypes = {
  drizzle: PropTypes.object,
};


export default MyComponent;
