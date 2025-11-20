import React, { createContext, useContext, useState, useEffect } from 'react';
import { mailClassifications } from '@/lib/mail-data';

const MailContext = createContext(null);

export const useMail = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
};

const MailProvider = ({ children }) => {
  const [incomingMail, setIncomingMail] = useState([]);
  const [outgoingMail, setOutgoingMail] = useState([]);
  const [dispositions, setDispositions] = useState([]);
  const [outgoingCounter, setOutgoingCounter] = useState(1);
  const [incomingCounter, setIncomingCounter] = useState(1);
  const [mailTypes, setMailTypes] = useState([]);

  useEffect(() => {
    const storedIncoming = localStorage.getItem('incomingMail');
    setIncomingMail(storedIncoming ? JSON.parse(storedIncoming) : []);

    const storedOutgoing = localStorage.getItem('outgoingMail');
    setOutgoingMail(storedOutgoing ? JSON.parse(storedOutgoing) : []);
    
    const storedDispositions = localStorage.getItem('dispositions');
    setDispositions(storedDispositions ? JSON.parse(storedDispositions) : []);

    const storedOutgoingCounter = localStorage.getItem('outgoingCounter');
    setOutgoingCounter(storedOutgoingCounter ? parseInt(storedOutgoingCounter, 10) : 1);
    
    const storedIncomingCounter = localStorage.getItem('incomingCounter');
    setIncomingCounter(storedIncomingCounter ? parseInt(storedIncomingCounter, 10) : 1);

    const storedTypes = localStorage.getItem('mailTypes');
    if (storedTypes) {
      setMailTypes(JSON.parse(storedTypes));
    } else {
       const defaultTypes = mailClassifications.flatMap(cat => 
        cat.items.map(item => ({...item, id: item.code}))
       );
       localStorage.setItem('mailTypes', JSON.stringify(defaultTypes));
       setMailTypes(defaultTypes);
    }
  }, []);

  const romanize = (num) => {
    const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '', i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  }

  const generateOutgoingMailNumber = (signatoryCode, classificationCode) => {
    const currentCounter = outgoingCounter;
    const year = new Date().getFullYear();
    const month = romanize(new Date().getMonth() + 1);
    
    const mailNumber = `${currentCounter}/${signatoryCode}.W3-A7/${classificationCode}/${month}/${year}`;
    
    const newCounter = currentCounter + 1;
    setOutgoingCounter(newCounter);
    localStorage.setItem('outgoingCounter', newCounter.toString());

    return `NOMOR : ${mailNumber}`;
  };

  const generateIncomingAgendaNumber = (classificationCode) => {
    const currentCounter = incomingCounter;
    const year = new Date().getFullYear();
    const month = romanize(new Date().getMonth() + 1);

    const agendaNumber = `SM${currentCounter}/${classificationCode}/${month}/${year}`;

    const newCounter = currentCounter + 1;
    setIncomingCounter(newCounter);
    localStorage.setItem('incomingCounter', newCounter.toString());

    return agendaNumber;
  };
  
  const addIncomingMail = (mailData) => {
    const agendaNumber = generateIncomingAgendaNumber(mailData.classificationCode);
    const newMail = {
      ...mailData,
      id: Date.now().toString(),
      type: 'incoming',
      agendaNumber: agendaNumber,
      createdAt: new Date().toISOString()
    };
    const updatedMails = [...incomingMail, newMail];
    setIncomingMail(updatedMails);
    localStorage.setItem('incomingMail', JSON.stringify(updatedMails));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const initialRecipient = users.find(u => u.id === mailData.initialRecipientId);
    
    const newDisposition = {
      id: `disp-${newMail.id}`,
      mailId: newMail.id,
      mailNumber: newMail.subject,
      date: new Date().toISOString(),
      instruction: `Mohon disposisi untuk surat masuk perihal "${newMail.subject}"`,
      status: 'pending',
      recipientId: initialRecipient ? initialRecipient.id : '',
      recipientName: initialRecipient ? initialRecipient.name : 'Belum Ditentukan',
      history: []
    };
    const updatedDispositions = [...dispositions, newDisposition];
    setDispositions(updatedDispositions);
    localStorage.setItem('dispositions', JSON.stringify(updatedDispositions));

    return newMail;
  };

  const addOutgoingMail = (mailData) => {
    const mailNumber = generateOutgoingMailNumber(mailData.signatory, mailData.classificationCode);
    const newMail = {
      ...mailData,
      id: Date.now().toString(),
      mailNumber: mailNumber,
      type: 'outgoing',
      uploaded: false,
      createdAt: new Date().toISOString()
    };
    const updatedMails = [...outgoingMail, newMail];
    setOutgoingMail(updatedMails);
    localStorage.setItem('outgoingMail', JSON.stringify(updatedMails));
    return newMail;
  };
  
  const updateMail = (mailId, updatedData, mailType) => {
    const list = mailType === 'incoming' ? incomingMail : outgoingMail;
    const setList = mailType === 'incoming' ? setIncomingMail : setOutgoingMail;
    const storageKey = mailType === 'incoming' ? 'incomingMail' : 'outgoingMail';

    const updatedList = list.map(m => m.id === mailId ? { ...m, ...updatedData } : m);
    setList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };
  
  const updateDisposition = (dispId, updatedData) => {
    const updatedList = dispositions.map(d => {
        if (d.id === dispId) {
            return {
                ...d,
                ...updatedData,
                recipientId: updatedData.recipient || d.recipientId,
                recipientName: updatedData.recipientName || d.recipientName
            };
        }
        return d;
    });
    setDispositions(updatedList);
    localStorage.setItem('dispositions', JSON.stringify(updatedList));
};

  const value = {
    incomingMail,
    outgoingMail,
    dispositions,
    mailTypes,
    addIncomingMail,
    addOutgoingMail,
    updateMail,
    updateDisposition,
    mailClassifications
  };

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
};

export default MailProvider;