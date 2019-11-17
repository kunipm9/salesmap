import React, { Component } from "react";
import { Container, Collapse, Card, CardBody, CollapseHeader } from "mdbreact";
import DocsLink from "../DocsLink";

class CollapsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseID: "collapse3"
    };
  }

  toggleCollapse = collapseID => () =>
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }));

  render() {
    const { collapseID } = this.state;
    return (
      <Container>
        <DocsLink
          title="Accordion PRO"
          href="https://mdbootstrap.com/docs/react/advanced/collapse/#accordion"
        />
        <Container className="md-accordion mt-5">
          <Card className="mt-3">
            <CollapseHeader onClick={this.toggleCollapse("collapse1")}>
              Collapsible Group Item #1
              <i
                className={
                  collapseID === "collapse1"
                    ? "fa fa-angle-down rotate-icon"
                    : "fa fa-angle-down"
                }
              />
            </CollapseHeader>
            <Collapse id="collapse1" isOpen={collapseID}>
              <CardBody>
                Pariatur cliche reprehenderit, enim eiusmod high life accusamus
                terry richardson ad squid. 3 wolf moon officia aute, non
                cupidatat skateboard dolor brunch. Food truck quinoa nesciunt
                laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a
                bird on it squid single-origin coffee nulla assumenda shoreditch
                et. Nihil anim keffiyeh helvetica, craft beer labore wes
                anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
                butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                raw denim aesthetic synth nesciunt you probably haven&apos;t
                heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>

          <Card>
            <CollapseHeader onClick={this.toggleCollapse("collapse2")}>
              Collapsible Group Item #2
              <i
                className={
                  collapseID === "collapse2"
                    ? "fa fa-angle-down rotate-icon"
                    : "fa fa-angle-down"
                }
              />
            </CollapseHeader>
            <Collapse id="collapse2" isOpen={collapseID}>
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                put a bird on it squid single-origin coffee nulla assumenda
                shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
                wes anderson cred nesciunt sapiente ea proident. Ad vegan
                excepteur butcher vice lomo. Leggings occaecat craft beer
                farm-to-table, raw denim aesthetic synth nesciunt you probably
                haven&apos;t heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>

          <Card>
            <CollapseHeader onClick={this.toggleCollapse("collapse3")}>
              Collapsible Group Item #3
              <i
                className={
                  collapseID === "collapse3"
                    ? "fa fa-angle-down rotate-icon"
                    : "fa fa-angle-down"
                }
              />
            </CollapseHeader>
            <Collapse id="collapse3" isOpen={collapseID}>
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life
                accusamus terry richardson ad squid. 3 wolf moon officia aute,
                non cupidatat skateboard dolor brunch. Food truck quinoa
                nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                put a bird on it squid single-origin coffee nulla assumenda
                shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
                wes anderson cred nesciunt sapiente ea proident. Ad vegan
                excepteur butcher vice lomo. Leggings occaecat craft beer
                farm-to-table, raw denim aesthetic synth nesciunt you probably
                haven&apos;t heard of them accusamus labore sustainable VHS.
              </CardBody>
            </Collapse>
          </Card>
        </Container>
      </Container>
    );
  }
}

export default CollapsePage;
