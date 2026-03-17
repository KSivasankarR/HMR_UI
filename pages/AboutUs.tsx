import React from 'react';
import styles from '../styles/pages/AboutUs.module.scss';



const AboutUs = () => {
  let TableDetails = [
    { key: "1. Registration Act,1908", values: "The Registration Act governs the registration of documents relating to properties both immovable and movable. Encumbrance certificates are issued on the immovable properties by conducting a search of the record sought for the specified period. Certified copies of the registered documents are issued to the public. The Sub-Registrar is the competent authority for the registration of documents under the Act." },
    { key: "2. Indian Stamp Act,1899", values: "The Stamp Act is a fiscal Act aimed at augmenting the revenues of the State by way of levying Stamp Duty. The revenue collected thus is one of the major revenues of the State Govt." },
    { key: "3. Andhra Pradesh Societies Registration Act,2001	", values: "Under this Act, public societies formed for charitable, religious and educational the purposes among others are registered by the Registrar. The District Registrar is the competent authority for the registration of such societies." },
    { key: "4. Indian Partnership Act,1932", values: "Under the Act, Partnership firms are registered. The District Registrar is the competent authority to register firms." },
    { key: "5. Hindu Marriages Act,1955	", values: "A Hindu Marriage can be registered under this Act after it is solemnised. The registration can be done by the Sub-registrar of either the place of the solemnisation or the place of the residence of either the husband or the wife. The District Registrar/DIG concerned are also competent to register marriages under this Act." },
    { key: "6. Special Marriages Act,1954	", values: "Under this Act, marriages are solemnised and registered. Every ub-registrar is a Marriage Officer under this Act." },
    { key: "7. The Indian Christian Marriages Act,1954", values: "The Marriages are solemnized by the pastors appointed by the Government. The marriage record sent to it by the pastor will be filed by the District Registrar." },
    { key: "9. The Andhra Pradesh Non Trading Companies Act,1962	", values: "Under this Act, Non Trading Companies are registered in the O/o Commissioner and I.G. Assistant I.G is competent to register such Non Trading Companies" },
    { key: "10. The Notaries Act,1952	", values: "The Government has the powers to appoint, issue and renew the licenses of the Notaries in the State." },
  ];

  const tableContainer = (key: string, value: string) => {
    return (
      <div key={key} className={styles.tableContainer}>
        <div className={styles.leftTableContainer}>
          <text className={styles.letTableText}>{key}</text>
        </div>
        <div className={styles.rightTableContainer}>
          <text className={styles.rightTableText}>{value}</text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Container}>
      <text className={styles.TitleText}>About Us</text>
      <p className={styles.paraText}>
        {"The Registration and Stamps Department is age old department functioning way back from the year 1864. The object of the department is to give publicity to the registered documents. Registration of a document is a notice to the public by way of definite recorded information to the world at large to enable public to verify the records and enquire therefrom the right, title and obligations if any on any immovable property. Further the department is acting as a Royal record keeper, by preserving age old records and providing copies of the records held by it to provide as proof of genuineness in the Court of Law. The department is collecting revenue to the State exchequer by way of Stamp Duty, Transfer Duty and Registration Fees. At present the department is the third largest revenue earning department in the state of Andhra Pradesh."}
      </p>
      <div>
        {TableDetails.map(singleData => tableContainer(singleData.key, singleData.values))}
      </div>
    </div>
  )
}

export default AboutUs