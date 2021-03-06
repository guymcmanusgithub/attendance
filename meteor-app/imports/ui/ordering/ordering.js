import React from "react";
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom";
import {
  Grid,
  Container,
  Header,
  Input,
  Button,
  Dimmer,
  Loader,
  Image,
  Message,
  Segment,
  Icon
} from "semantic-ui-react";
import UploadXL from "/imports/ui/ordering/uploadXL";
import PartCard from "/imports/ui/ordering/ordering-part-card";
import PartList from "/imports/ui/ordering/ordering-part-list";
import CartIcon from "/imports/ui/ordering/cart-icon";

class Ordering extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addParts: true
    };
  }

  toggleAddPart = () => {
    this.setState({ addParts: !this.state.addParts });
  }

  render() {
    if (this.props.loading) {
      return (
        <div>
          <Dimmer active inverted>
            <Loader size="huge">Loading... </Loader>
          </Dimmer>

          <Image src="/images/wireframe/short-paragraph.png" />
        </div>
      );
    }
    const { activeOrder, uploadXL } = this.props;
    let noOfParts = 0;

    return (
      <Grid container columns="equal">
        {!this.props.loading &&
          activeOrder &&
          activeOrder.orderedParts.forEach(part => {
            noOfParts += part.qty;
            return noOfParts;
          })}

        <Grid.Row columns={1}>
          <Grid.Column width={16}>
            <Header as="h2" textAlign="center">
              {" "}
              <div>Parts Search</div>{" "}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1} centered>
          <CartIcon noOfParts={noOfParts} />
          <br />
          <Input
            placeholder="Part number or name"
            className="member-search"
            onChange={this.props.onSearchInput}
            value={this.props.partSearchQuery}
            icon={"search"}
            size="huge"
            fluid
          />{" "}
        </Grid.Row>

        <Grid.Row columns={1} centered>
          {this.props.parts < 1 ? (
            <>
              <Message
                icon="inbox"
                header="Nothing found"
                content="Please try again"
              />
              <Button
                onClick={this.toggleAddPart}
                style={{
                  height: "100px",
                  marginTop: "20px",
                  marginBottom: "20px"
                }}
                color="grey"
              >
                <h1>Add updated pricelist</h1>
              </Button>

              {this.state.addParts ? (
                ""
              ) : (
                <UploadXL
                  uploadXL={this.props.uploadXL}
                  toggleAddPart={this.toggleAddPart}
                />
              )}
            </>
          ) : (
            ""
          )}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <PartList
              title={"Part Title:"}
              parts={this.props.parts}
              activeOrder={this.props.activeOrder}
              addToCart={this.props.addToCart}
              Component={PartCard}
              componentClassName="part-card-main"
              loading={this.props.loading}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Ordering);

Ordering.propTypes = {
  activeOrder: PropTypes.object,
  addToCart: PropTypes.func.isRequired,
  parts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  partSearchQuery: PropTypes.string,
  onSearchInput: PropTypes.func,
  uploadXL: PropTypes.func.isRequired,
}
