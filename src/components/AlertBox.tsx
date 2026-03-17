import Modal from 'react-bootstrap/Modal';
import styles from '../../styles/Home.module.scss';
import {Col, Container, Row, Button } from 'react-bootstrap';



function AlertBox() {
    return (
      <Modal.Dialog className={styles.modaldialog} style={{zIndex:'50'}}>
        <Container>
          <Row className={styles.Modalheader}>
            <Col lg={4}>
            </Col>
            <Col lg={4}>
            <Modal.Title>Alert</Modal.Title>
            </Col>
            <Col lg={4}>
            <Modal.Header closeButton className={styles.Modalclose}>
            </Modal.Header>
            </Col>
          </Row>
        </Container>
        
  
        <Modal.Body className={styles.successModalbody}>
          <p className={styles.successText}>Are you sure want to Submit the application?</p>
          <Modal.Footer>
          <Button variant="secondary">
            No
          </Button>
          <Button variant="primary" className={styles.Alertbutton}>
            Yes
          </Button>
        </Modal.Footer>
        </Modal.Body>
        
      </Modal.Dialog>
    );
  }
  
  export default AlertBox;