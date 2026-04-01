import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form, Nav, Navbar, Modal } from "react-bootstrap";
import { useActionState, useEffect, useState } from "react";
import { useUserState } from "~/stores/user-store";

export default function Header() {
  const [isErrorLoginDialogOpen, setErrorLoginDialogOpen] = useState(false);

  function handleShowErrorLoginDialog() {
    setErrorLoginDialogOpen(true);
  }

  function handleCloseErrorLoginDialog() {
    setErrorLoginDialogOpen(false);
  }

  let { user, loadLoggedUser, loginUser, logoutUser } = useUserState();

  async function loginUserAction(
    prevState: { success: boolean; error: string | null },
    formData: FormData,
  ) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const error = await loginUser(username, password);

    if (error) {
      handleShowErrorLoginDialog();
    }

    return { success: !error, error };
  }

  const [state, loginFormAction, isPending] = useActionState(loginUserAction, {
    success: false,
    error: null,
  });

  async function logoutUserAction() {
    await logoutUser();
  }

  const [, logoutFormAction, isLoggingOut] = useActionState(
    logoutUserAction,
    null,
  );

  useEffect(() => {
    loadLoggedUser();
  }, [loadLoggedUser]);

  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="px-3">
        <Container fluid>
          <Navbar.Brand href="/">Library</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent" className="justify-content-end">
            {!user && (
              <Form
                action={loginFormAction}
                className="d-flex align-items-center p-2"
              >
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="me-3"
                  disabled={isPending}
                />
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="me-3"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="btn-nowrap w-50"
                  disabled={isPending}
                >
                  {isPending ? "Logging in..." : "Log In"}
                </Button>
              </Form>
            )}

            {user && (
              <Nav className="d-flex align-items-center">
                <Navbar.Text className="fs-3 text-white mx-3">
                  {user.name}
                </Navbar.Text>
                <Form action={logoutFormAction} className="d-inline">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </Form>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={isErrorLoginDialogOpen} onHide={handleCloseErrorLoginDialog}>
        <Modal.Header className="bg-danger text-white" closeButton>
          <Modal.Title>Login Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{state.error}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorLoginDialog}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
