import Form from "react-bootstrap/Form";
function Login() {
  return (
    <>
      <div className="d-flex p-2 justify-content-center my-auto">
        <Form>
          <Form.Group className="mb-3" controlId="formGroupUsername">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default Login;
