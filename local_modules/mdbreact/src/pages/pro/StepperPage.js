import React from "react";
import {
  Container,
  Row,
  Col,
  Stepper,
  Step,
  Fa,
  Button,
  Card,
  CardBody,
  Input
} from "mdbreact";
import DocsLink from "../DocsLink";

class StepperPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formActivePanel1: 1,
      formActivePanel1Changed: false,
      formActivePanel2: 1,
      formActivePanel2Changed: false,
      formActivePanel3: 1,
      formActivePanel3Changed: false
    };
  }

  swapFormActive = a => param => e => {
    this.setState({
      ["formActivePanel" + a]: param,
      ["formActivePanel" + a + "Changed"]: true
    });
  };

  handleNextPrevClick = a => param => e => {
    this.setState({
      ["formActivePanel" + a]: param,
      ["formActivePanel" + a + "Changed"]: true
    });
  };

  handleSubmission = () => {
    alert("Form submitted!");
  };

  calculateAutofocus = a => {
    if (this.state["formActivePanel" + a + "Changed"]) {
      return true;
    }
  };

  render() {
    return (
      <Container>
        <DocsLink
          title="Steppers"
          href="https://mdbootstrap.com/docs/react/components/stepper/"
        />
        <Container className="mt-5">
          <h2>Horizontal stepper</h2>
          <Stepper>
            <Step className="completed">
              <a href="#!">
                <span className="circle">1</span>
                <span className="label">First step</span>
              </a>
            </Step>
            <Step className="active">
              <a href="#!">
                <span className="circle">2</span>
                <span className="label">Second step</span>
              </a>
            </Step>
            <Step className="warning">
              <a href="#!">
                <span className="circle">
                  <Fa icon="warning" />
                </span>
                <span className="label">Third step</span>
              </a>
            </Step>
          </Stepper>

          <hr className="my-5" />
          <h2>Vertical stepper</h2>

          <Stepper vertical>
            <Step className="completed">
              <a href="#!">
                <span className="circle">1</span>
                <span className="label">First step</span>
              </a>
            </Step>
            <Step className="active">
              <a href="#!">
                <span className="circle">2</span>
                <span className="label">Second step</span>
              </a>
              <div className="step-content grey lighten-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
                  cupiditate voluptate facere iusto quaerat vitae excepturi,
                  accusantium ut aliquam repellat atque nesciunt nostrum
                  similique. Inventore nostrum ut, nobis porro sapiente.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dolore error excepturi veniam nemo repellendus, distinctio
                  soluta vitae at sit saepe. Optio eaque quia excepturi adipisci
                  pariatur totam, atque odit fugiat.
                </p>
                <p>
                  Deserunt voluptatem illum quae nisi soluta eum perferendis
                  nesciunt asperiores tempore saepe reiciendis, vero quod a
                  dolor corporis natus qui magni quas fuga rem excepturi
                  laboriosam. Quisquam expedita ab fugiat.
                </p>
              </div>
            </Step>
            <Step className="warning">
              <a href="#!">
                <span className="circle">
                  <Fa icon="warning" />
                </span>
                <span className="label">Third step</span>
              </a>
            </Step>
            <Step>
              <a href="#!">
                <span className="circle">4</span>
                <span className="label">Fourth step</span>
              </a>
            </Step>
            <Row className="mt-1">
              <Col md="12" className="text-right">
                <Button flat>Cancel</Button>
                <Button color="primary">Next </Button>
              </Col>
            </Row>
          </Stepper>

          <hr className="my-5" />
          <h2>Steps within form</h2>

          <Row>
            <Col xl="6" lg="7" md="10">
              <Card>
                <CardBody>
                  <h2 className="text-center font-weight-bold pt-4 pb-5">
                    <strong>Steps form example</strong>
                  </h2>
                  <Stepper form>
                    <Step form>
                      <a href="#formstep1" onClick={this.swapFormActive(1)(1)}>
                        <Button
                          color={
                            this.state.formActivePanel1 === 1
                              ? "indigo"
                              : "default"
                          }
                          circle
                        >
                          1
                        </Button>
                      </a>
                      <p>Step 1</p>
                    </Step>
                    <Step form>
                      <a href="#formstep2" onClick={this.swapFormActive(1)(2)}>
                        <Button
                          color={
                            this.state.formActivePanel1 === 2
                              ? "indigo"
                              : "default"
                          }
                          circle
                        >
                          2
                        </Button>
                      </a>
                      <p>Step 2</p>
                    </Step>
                    <Step form>
                      <a href="#formstep3" onClick={this.swapFormActive(1)(3)}>
                        <Button
                          color={
                            this.state.formActivePanel1 === 3
                              ? "indigo"
                              : "default"
                          }
                          circle
                        >
                          3
                        </Button>
                      </a>
                      <p>Step 3</p>
                    </Step>
                  </Stepper>

                  <form action="" method="post">
                    <Row>
                      {this.state.formActivePanel1 === 1 && (
                        <Col md="12">
                          <h3 className="font-weight-bold pl-0 my-4">
                            <strong>Step 1</strong>
                          </h3>
                          <Input
                            label="First Name"
                            className="mt-3"
                            autoFocus={this.calculateAutofocus(1)}
                          />
                          <Input label="Last Name" className="mt-3" />
                          <Input label="Address" type="textarea" rows="2" />
                          <Button
                            color="indigo"
                            rounded
                            className="float-right"
                            onClick={this.handleNextPrevClick(1)(2)}
                          >
                            next
                          </Button>
                        </Col>
                      )}
                      {this.state.formActivePanel1 === 2 && (
                        <Col md="12">
                          <h3 className="font-weight-bold pl-0 my-4">
                            <strong>Step 2</strong>
                          </h3>
                          <Input
                            label="Company Name"
                            className="mt-4"
                            autoFocus={this.calculateAutofocus(1)}
                          />
                          <Input label="Company Address" className="mt-4" />
                          <Button
                            color="indigo"
                            rounded
                            className="float-left"
                            onClick={this.handleNextPrevClick(1)(1)}
                          >
                            previous
                          </Button>
                          <Button
                            color="indigo"
                            rounded
                            className="float-right"
                            onClick={this.handleNextPrevClick(1)(3)}
                          >
                            next
                          </Button>
                        </Col>
                      )}
                      {this.state.formActivePanel1 === 3 && (
                        <Col md="12">
                          <h3 className="font-weight-bold pl-0 my-4">
                            <strong>Step 3</strong>
                          </h3>
                          <Button
                            color="indigo"
                            rounded
                            className="float-left"
                            onClick={this.handleNextPrevClick(1)(2)}
                            autoFocus={this.calculateAutofocus(1)}
                          >
                            previous
                          </Button>
                          <Button
                            color="default"
                            rounded
                            className="float-right"
                            onClick={this.handleSubmission}
                          >
                            submit
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <hr className="my-5" />
          <h2>Registration form with steps</h2>

          <Card>
            <CardBody>
              <h2 className="text-center font-weight-bold pt-4 pb-5 mb-2">
                <strong>Registration form</strong>
              </h2>
              <Stepper icon>
                <Step
                  icon="folder-open-o"
                  stepName="Basic Information"
                  onClick={this.swapFormActive(2)(1)}
                />
                <Step
                  icon="pencil"
                  stepName="Personal Data"
                  onClick={this.swapFormActive(2)(2)}
                />
                <Step
                  icon="photo"
                  stepName="Terms and Conditions"
                  onClick={this.swapFormActive(2)(3)}
                />
                <Step
                  icon="check"
                  stepName="Finish"
                  onClick={this.swapFormActive(2)(4)}
                />
              </Stepper>

              <form action="" method="post">
                <Row>
                  {this.state.formActivePanel2 === 1 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Basic Information</strong>
                      </h3>
                      <Input
                        label="Email"
                        className="mt-4"
                        autoFocus={this.calculateAutofocus(2)}
                      />
                      <Input label="Username" className="mt-4" />
                      <Input label="Password" className="mt-4" />
                      <Input label="Repeat Password" className="mt-4" />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(2)(2)}
                      >
                        next
                      </Button>
                    </Col>
                  )}
                  {this.state.formActivePanel2 === 2 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Personal Data</strong>
                      </h3>
                      <Input
                        label="First Name"
                        className="mt-3"
                        autoFocus={this.calculateAutofocus(2)}
                      />
                      <Input label="Second Name" className="mt-3" />
                      <Input label="Surname" className="mt-3" />
                      <Input label="Address" type="textarea" rows="2" />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(2)(1)}
                      >
                        previous
                      </Button>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(2)(3)}
                      >
                        next
                      </Button>
                    </Col>
                  )}
                  {this.state.formActivePanel2 === 3 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Terms and conditions</strong>
                      </h3>
                      <Input
                        label="I agreee to the terms and conditions"
                        type="checkbox"
                        id="checkbox"
                        autoFocus={this.calculateAutofocus(2)}
                      />
                      <Input
                        label="I want to receive newsletter"
                        type="checkbox"
                        id="checkbox2"
                      />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(2)(2)}
                      >
                        previous
                      </Button>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(2)(4)}
                      >
                        next
                      </Button>
                    </Col>
                  )}

                  {this.state.formActivePanel2 === 4 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Finish</strong>
                      </h3>
                      <h2 className="text-center font-weight-bold my-4">
                        Registration completed!
                      </h2>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(2)(3)}
                      >
                        previous
                      </Button>
                      <Button
                        color="success"
                        rounded
                        className="float-right"
                        onClick={this.handleSubmission}
                      >
                        submit
                      </Button>
                    </Col>
                  )}
                </Row>
              </form>
            </CardBody>
          </Card>

          <hr className="my-5" />
          <h2>Vertical registration form steps</h2>

          <Card>
            <CardBody>
              <Row className="pt-5 justify-content-center">
                <Col md="2" className="pl-5 pl-md-0 pb-5">
                  <Stepper icon vertical>
                    <Step
                      icon="folder-open-o"
                      stepName="Basic Information"
                      onClick={this.swapFormActive(3)(1)}
                      vertical
                    />
                    <Step
                      icon="pencil"
                      stepName="Personal Data"
                      onClick={this.swapFormActive(3)(2)}
                      vertical
                    />
                    <Step
                      icon="photo"
                      stepName="Terms and Conditions"
                      onClick={this.swapFormActive(3)(3)}
                      vertical
                    />
                    <Step
                      icon="check"
                      stepName="Finish"
                      onClick={this.swapFormActive(3)(4)}
                      vertical
                    />
                  </Stepper>
                </Col>

                <Col md="7">
                  {this.state.formActivePanel3 === 1 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Basic Information</strong>
                      </h3>
                      <Input
                        label="Email"
                        className="mt-4"
                        autoFocus={this.calculateAutofocus(3)}
                      />
                      <Input label="Username" className="mt-4" />
                      <Input label="Password" className="mt-4" />
                      <Input label="Repeat Password" className="mt-4" />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(3)(2)}
                      >
                        next
                      </Button>
                    </Col>
                  )}
                  {this.state.formActivePanel3 === 2 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Personal Data</strong>
                      </h3>
                      <Input
                        label="First Name"
                        className="mt-3"
                        autoFocus={this.calculateAutofocus(3)}
                      />
                      <Input label="Second Name" className="mt-3" />
                      <Input label="Surname" className="mt-3" />
                      <Input label="Address" type="textarea" rows="2" />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(3)(1)}
                      >
                        previous
                      </Button>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(3)(3)}
                      >
                        next
                      </Button>
                    </Col>
                  )}
                  {this.state.formActivePanel3 === 3 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Terms and conditions</strong>
                      </h3>
                      <Input
                        label="I agreee to the terms and conditions"
                        type="checkbox"
                        id="checkbox3"
                        autoFocus={this.calculateAutofocus(3)}
                      />
                      <Input
                        label="I want to receive newsletter"
                        type="checkbox"
                        id="checkbox4"
                      />
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(3)(2)}
                      >
                        previous
                      </Button>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-right"
                        onClick={this.handleNextPrevClick(3)(4)}
                      >
                        next
                      </Button>
                    </Col>
                  )}
                  {this.state.formActivePanel3 === 4 && (
                    <Col md="12">
                      <h3 className="font-weight-bold pl-0 my-4">
                        <strong>Finish</strong>
                      </h3>
                      <h2 className="text-center font-weight-bold my-4">
                        Registration completed!
                      </h2>
                      <Button
                        color="mdb-color"
                        rounded
                        className="float-left"
                        onClick={this.handleNextPrevClick(3)(3)}
                      >
                        previous
                      </Button>
                      <Button
                        color="success"
                        rounded
                        className="float-right"
                        onClick={this.handleSubmission}
                      >
                        submit
                      </Button>
                    </Col>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </Container>
    );
  }
}

export default StepperPage;
