import Modal from 'react-bootstrap/Modal';
import styles from '../../styles/Home.module.scss';
import Image from "next/image";
import {Col, Container, Row } from 'react-bootstrap';



function SuccessBox() {
    return (
      <Modal.Dialog className={styles.modaldialog}>
        <Container>
          <Row className={styles.Modalheader}>
            <Col lg={4}>
            </Col>
            <Col lg={4}>
            <Modal.Title>Success</Modal.Title>
            </Col>
            <Col lg={4}>
            <Modal.Header closeButton className={styles.Modalclose}>
            </Modal.Header>
            </Col>
          </Row>
        </Container>
        
  
        <Modal.Body className={styles.successModalbody}>
        <div className={styles.successContainer}>
         <Image className={styles.successImage} alt='' width={40} height={40} object-fit="none" src="/hmr/images/success.svg" />
        </div>
          <p className={styles.successText}>Your Application Has been Submitted Successfully</p>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
  
  export default SuccessBox;