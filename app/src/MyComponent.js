import React, { Component } from 'react';
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";
import PropTypes from 'prop-types'


import { Container, Row, Col, Card, ListGroup, ListGroupItem, Form, Button, ButtonToolbar } from 'react-bootstrap';

class MyComponent extends Component {

  constructor(props, context) {
    super(props);

    this.moloch = context.drizzle.contracts.Moloch
    this.utils = context.drizzle.web3.utils;

    this.state = {
      newRecipientAddressInput: "",
      newRecipientDetailsInput: "",
      newMemberAddressInput: "",
      newMemberTributeInput: "",
      newMemberDetailsInput: "",
      selectedProposalIndex: "None",
    }

    this.handleNewRecipientAddressInputChange = this.handleNewRecipientAddressInputChange.bind(this);
    this.handleNewRecipientDetailsInputChange = this.handleNewRecipientDetailsInputChange.bind(this);
    this.handleNewRecipientSubmit = this.handleNewRecipientSubmit.bind(this);

    this.handleNewMemberAddressInputChange = this.handleNewMemberAddressInputChange.bind(this);
    this.handleNewMemberTributeInputChange = this.handleNewMemberTributeInputChange.bind(this);
    this.handleNewMemberDetailsInputChange = this.handleNewMemberDetailsInputChange.bind(this);
    this.handleNewMemberSubmit = this.handleNewMemberSubmit.bind(this);
    this.handleProposalChange = this.handleProposalChange.bind(this);

    this.handleVoteYesClicked = this.handleVoteYesClicked.bind(this);
    this.handleVoteNoClicked = this.handleVoteNoClicked.bind(this);
    this.handleProcessMembership = this.handleProcessMembership.bind(this);
    this.handleProcessRecipient = this.handleProcessRecipient.bind(this);
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

  handleNewMemberAddressInputChange(event) {
    event.preventDefault();

    this.setState({
      newMemberAddressInput: event.currentTarget.value,
    });
  }

  handleNewMemberTributeInputChange(event) {
    event.preventDefault();

    this.setState({
      newMemberTributeInput: event.currentTarget.value,
    });
  }

  handleNewMemberDetailsInputChange(event) {
    event.preventDefault();

    this.setState({
      newMemberDetailsInput: event.currentTarget.value,
    });
  }

  handleNewMemberSubmit(event) {
    event.preventDefault();

    let weiDaiTribute = this.utils.toWei(this.state.newMemberTributeInput, "ether");
    this.moloch.methods.submitProposal.cacheSend(this.state.newMemberAddressInput, weiDaiTribute, weiDaiTribute, this.state.newMemberDetailsInput);
  }

  handleProposalChange(event) {
    event.preventDefault();

    this.setState({
      selectedProposalIndex: event.currentTarget.value,
    });
  }

  handleVoteYesClicked(event) {
    event.preventDefault();
    this.moloch.methods.submitVote.cacheSend(this.state.selectedProposalIndex, "1");
  }

  handleVoteNoClicked(event) {
    event.preventDefault();
    this.moloch.methods.submitVote.cacheSend(this.state.selectedProposalIndex, "2");
  }

  handleProcessMembership(event) {
    event.preventDefault();
    this.moloch.methods.processProposal.cacheSend(this.state.selectedProposalIndex);
  }

  handleProcessRecipient(event){
    event.preventDefault();
    this.moloch.methods.processRecipientProposal.cacheSend(this.state.selectedProposalIndex);
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
              <ListGroupItem>Bank Address: <ContractData contract="Moloch" method="guildBank" /></ListGroupItem>
              <ListGroupItem>Number Of Proposals: <ContractData contract="Moloch" method="getProposalQueueLength" /></ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs="6">
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
                            placeholder="details"
                            value={this.state.newRecipientDetailsInput}
                            onChange={this.handleNewRecipientDetailsInputChange} />
            </Form.Group>

            <Form.Group>
              <Button variant="primary" onClick={this.handleNewRecipientSubmit}>Submit</Button>
            </Form.Group>
          </Form>
        </Col>

        <Col xs="6">
          <h3>Propose New Member</h3>
          <Form>
            <Form.Group>
              <Form.Label>New Member</Form.Label>
              <Form.Control type="input"
                            placeholder="address"
                            value={this.state.newMemberAddressInput}
                            onChange={this.handleNewMemberAddressInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tribute Amount</Form.Label>
              <Form.Control type="number"
                            placeholder="amount"
                            value={this.state.newMemberTributeInput}
                            onChange={this.handleNewMemberTributeInputChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Proposal Details</Form.Label>
              <Form.Control type="input"
                            placeholder="details"
                            value={this.state.newMemberDetailsInput}
                            onChange={this.handleNewMemberDetailsInputChange} />
            </Form.Group>

            <Form.Group>
              <Button variant="primary" onClick={this.handleNewMemberSubmit}>Submit</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <h3>Proposals</h3>
      <Row className="mt-4">
        <Col>
          <Form>
            <Form.Group>
              <Form.Control as="select" onChange={this.handleProposalChange}>
                <option>None</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
            { "None" !== this.state.selectedProposalIndex &&
              <ButtonToolbar>
                <Button variant="success" onClick={this.handleVoteYesClicked}>Vote YES</Button>
                <Button className="ml-2" variant="danger" onClick={this.handleVoteNoClicked}>Vote NO</Button>
              </ButtonToolbar>
            }
            { "None" !== this.state.selectedProposalIndex &&
              <ButtonToolbar className="mt-2">
                <Button variant="outline-secondary" onClick={this.handleProcessMembership}>Process Membership</Button>
                <Button className="ml-2" variant="outline-secondary" onClick={this.handleProcessRecipient}>Process Recipient</Button>
              </ButtonToolbar>
            }
          </Form>
        </Col>
        <Col>
          <Card>
            <Card.Header>Proposal Data</Card.Header>
            <Card.Body>
              { "None" !== this.state.selectedProposalIndex && <ContractData contract="Moloch" method="proposalQueue" methodArgs={[this.state.selectedProposalIndex]} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
    );
  }
}

MyComponent.contextTypes = {
  drizzle: PropTypes.object,
};


export default MyComponent;
