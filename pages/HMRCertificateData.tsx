import Head from "next/head";
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.scss";
import { downloadFileByAppNoForView } from "../src/axios";
import { Col, Container, Row } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";

function HMRCertificateData() {
  //pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  pdfjs.GlobalWorkerOptions.workerSrc = process.env.HMR_HOME_URL+"/pdf.worker.min.js";
  const [validated, setValidated] = useState<boolean>(false);
  const [successTransaction, setSuccessTransaction] = useState<boolean>(false);
  const [singedFile, setSingedFile] = useState<string>("");
  const [numPages, setNumPages] = useState(null);

  useEffect(() =>{
    let locationData = window.location.href;
    let parthArray = locationData.split("?");
    if(parthArray.length==1){
        setValidated(true);
        setSuccessTransaction(false);
    }else {
        let pathParamAndVal = parthArray[1];
        let parmAndValArray = pathParamAndVal.split("=");
        if(parmAndValArray.length==1){
            setValidated(true);
            setSuccessTransaction(false);
        }else {
            let hmrAppNumber = parmAndValArray[1];
            try {
              const decoded = atob(hmrAppNumber);
             if (decoded.startsWith("HM")) {
            downloadFileByAppNo(decoded);
          } else {
            downloadFileByAppNo(hmrAppNumber);
          }
        } catch (err) {
          downloadFileByAppNo(hmrAppNumber);
        }
      }
    }
  }, []);

  const downloadFileByAppNo = (hmrAppNumber: string) => {
    let reqFrom;
    if(hmrAppNumber.indexOf("-")>0){
      let hmrAppNumberArray = hmrAppNumber.split("-");
      hmrAppNumber = hmrAppNumberArray[0];
      reqFrom = hmrAppNumberArray[1];
    }
    downloadFileByAppNoForView(hmrAppNumber).then((responseData) => {
    
      if (responseData?.Success) {
        let pdfBase64 = responseData.dataBase64;
        if(!reqFrom){
          setValidated(true);
          setSuccessTransaction(true);
          setSingedFile("data:application/pdf;base64,"+pdfBase64);
        }else{
          const linkSource = 'data:application/pdf;base64,'+pdfBase64;
          let downloadLink = document.createElement("a");

          downloadLink.href = linkSource;
          downloadLink.target = "_blank";
          downloadLink.download = hmrAppNumber+".pdf";
          downloadLink.click();
          sleep(1000);
          downloadLink.remove();        
        }
      } else {
        setValidated(true);
        setSuccessTransaction(false);
      }
    })
    .catch((error) => console.error(error));

  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onDocumentLoadSuccess({ numPages }) {
  setNumPages(numPages);
}

  
  return (
    <div>
        <Head>
            <title>HMR Certificate View Service</title>
            <link rel="icon" href="/hmr/images/aplogoimg.png" />
        </Head>
        <div className={styles.Navbar}>
          <text className={styles.NavbarLink}></text>
        </div>
        <div className="MainContent">
            <div className={styles.Forms_RegistrationMainDetails}>
                {validated==false ?(
                    <div>
                        <h5>Loading....</h5>
                    </div>
                ):(
                    <Container>
                        {successTransaction == true ? (
                            <Row>
                              <Col lg={12} md={12} xs={12}>
                                <Document file={singedFile} onLoadSuccess={onDocumentLoadSuccess}>
                                  {Array.apply(null, Array(numPages))
                                      .map((x, i)=>i+1)
                                      .map(page => <Page key={page} renderMode="canvas" pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)
                                  }
                                </Document>
                              </Col>
                            </Row>
                        ):(
                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <div className="text-start">
                                        <h2 className={styles.Forms_mainHeading}>
                                            HMR Certificate View Service
                                        </h2>
                                    </div>
                                    <div>
                                        <p style={{fontWeight:"600"}}>Invalid marriage certificate link.</p>
                                    </div>
                                </Col>
                            </Row>
                        )}   
                    </Container>
                )}
            </div>
        </div>
    </div>
  )
}

export default HMRCertificateData;