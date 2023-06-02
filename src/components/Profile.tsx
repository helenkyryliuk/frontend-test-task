import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import Highlight from "./Highlight";
import Loading from "./Loading";
import { withAuthenticationRequired, Auth0ContextInterface, withAuth0 } from "@auth0/auth0-react";

interface ProfileProps {
  auth0: Auth0ContextInterface
}

export class ProfileComponent extends Component<ProfileProps> {
  render () {
    const { user } = this.props.auth0;

    return (
      <Container className="mb-5">
        <Row className="align-items-center profile-header mb-5 text-center text-md-left">
          <Col md={2}>
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
            />
          </Col>
          <Col md>
            <h2>{user.name}</h2>
            <p className="lead text-muted">{user.email}</p>
          </Col>
        </Row>
        <Row>
          <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
        </Row>
      </Container>
    );
  }
};

export default withAuthenticationRequired(withAuth0(ProfileComponent), {
  onRedirecting: () => <Loading />,
});
