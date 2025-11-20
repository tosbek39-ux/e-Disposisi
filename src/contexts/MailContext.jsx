import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [mailTypes, setMailTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supabaseEnabled, setSupabaseEnabled] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🚀 Initializing MailContext...');
        
        // Check Supabase configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseKey) {
          console.log('✅ Supabase configured, attempting to connect...');
          setSupabaseEnabled(true);
          
          // Try to fetch from Supabase first
          await loadFromSupabase();
        } else {
          console.log('⚠️ Supabase not configured, using localStorage fallback');
          setSupabaseEnabled(false);
          loadFromLocalStorage();
        }
        
        // Always ensure mail types are available
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
      } catch (error) {
        console.error('❌ Error initializing data:', error);
        // Fallback to localStorage
        setSupabaseEnabled(false);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadFromSupabase = async () => {
    try {
      console.log('📡 Loading data from Supabase...');
      
      // Load incoming mails
      const { data: incomingData, error: incomingError } = await supabase
        .from('incoming_mails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (incomingError) {
        throw incomingError;
      }
      
      if (incomingData && incomingData.length > 0) {
        console.log(`✅ Loaded ${incomingData.length} incoming mails from Supabase`);
        setIncomingMail(incomingData.map(mail => ({
          id: mail.id,
          sender: mail.sender,
          subject: mail.subject,
          receivedDate: mail.received_date,
          mailDate: mail.mail_date,
          googleDriveFileUrl: mail.google_drive_file_url,
          classificationCode: mail.classification_code,
          initialRecipientId: mail.initial_recipient_id,
          agendaNumber: mail.agenda_number,
          content: mail.content
        })));
      } else {
        console.log('📝 No incoming mails found in Supabase, checking localStorage...');
        loadFromLocalStorage();
      }

      // Load outgoing mails
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('outgoing_mails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (outgoingError) {
        throw outgoingError;
      }
      
      if (outgoingData && outgoingData.length > 0) {
        console.log(`✅ Loaded ${outgoingData.length} outgoing mails from Supabase`);
        setOutgoingMail(outgoingData.map(mail => ({
          id: mail.id,
          recipient: mail.recipient,
          subject: mail.subject,
          date: mail.date,
          googleDriveFileUrl: mail.google_drive_file_url,
          signatory: mail.signatory,
          classificationCode: mail.classification_code,
          mailNumber: mail.mail_number,
          content: mail.content,
          uploaded: mail.uploaded,
          fileName: mail.file_name
        })));
      } else {
        console.log('📝 No outgoing mails found in Supabase, checking localStorage...');
        loadFromLocalStorage();
      }

      // Load dispositions
      const { data: dispositionData, error: dispositionError } = await supabase
        .from('dispositions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dispositionError) {
        throw dispositionError;
      }
      
      if (dispositionData && dispositionData.length > 0) {
        console.log(`✅ Loaded ${dispositionData.length} dispositions from Supabase`);
        setDispositions(dispositionData);
      } else {
        console.log('📝 No dispositions found in Supabase, checking localStorage...');
        loadFromLocalStorage();
      }
      
    } catch (error) {
      console.error('❌ Error loading from Supabase:', error);
      console.log('🔄 Falling back to localStorage...');
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    console.log('💾 Loading data from localStorage...');
    
    const storedIncoming = localStorage.getItem('incomingMail');
    if (storedIncoming) {
      setIncomingMail(JSON.parse(storedIncoming));
    }

    const storedOutgoing = localStorage.getItem('outgoingMail');
    if (storedOutgoing) {
      setOutgoingMail(JSON.parse(storedOutgoing));
    }
    
    const storedDispositions = localStorage.getItem('dispositions');
    if (storedDispositions) {
      setDispositions(JSON.parse(storedDispositions));
    }
  };

  const romanize = (num) => {
    if (!num && num !== 0) return '';
    const lookup = {M:1000,CM:900,D:500,CD:400,C:100,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
    let roman = '', numVal = parseInt(num, 10);
    for (const i in lookup) {
      while (numVal >= lookup[i]) {
        roman += i;
        numVal -= lookup[i];
      }
    }
    return roman;
  };

  const generateOutgoingMailNumber = (signatory, classificationCode) => {
    const romanMonth = romanize(new Date().getMonth() + 1);
    const year = new Date().getFullYear();
    const counter = Math.floor(Math.random() * 999) + 1;
    const initials = signatory ? signatory.split(' ').map(word => word[0]).join('').toUpperCase() : 'UN';
    return `${classificationCode}/${counter}/${initials}/${romanMonth}/${year}`;
  };

  const saveToSupabase = async (table, data) => {
    if (!supabaseEnabled) {
      console.log('⚠️ Supabase disabled, using localStorage');
      return false;
    }

    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log(`✅ Data saved to Supabase ${table}:`, result);
      return true;
    } catch (error) {
      console.error(`❌ Error saving to Supabase ${table}:`, error);
      return false;
    }
  };

  const addIncomingMail = async (mailData) => {
    const newMail = {
      ...mailData,
      id: mailData.id || `mail_${Date.now()}`,
      receivedDate: mailData.receivedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      type: 'incoming'
    };
    
    const updatedMails = [...incomingMail, newMail];
    setIncomingMail(updatedMails);
    
    // Save to both localStorage and Supabase
    localStorage.setItem('incomingMail', JSON.stringify(updatedMails));
    
    if (supabaseEnabled) {
      await saveToSupabase('incoming_mails', {
        sender: mailData.sender,
        subject: mailData.subject,
        received_date: mailData.receivedDate,
        mail_date: mailData.mailDate,
        google_drive_file_url: mailData.googleDriveFileUrl,
        classification_code: mailData.classificationCode,
        initial_recipient_id: mailData.initialRecipientId,
        agenda_number: mailData.agendaNumber,
        content: mailData.content
      });
    }
    
    // Create disposition
    const newDisposition = {
      id: `disp_${Date.now()}`,
      mail_id: newMail.id,
      mail_number: mailData.subject,
      date: new Date().toISOString().split('T')[0],
      instruction: `Mohon disposisi untuk surat masuk perihal "${mailData.subject}"`,
      status: 'pending',
      recipient_id: mailData.initialRecipientId || null,
      recipient_name: 'Belum Ditentukan',
      history: []
    };
    
    const updatedDispositions = [...dispositions, newDisposition];
    setDispositions(updatedDispositions);
    localStorage.setItem('dispositions', JSON.stringify(updatedDispositions));
    
    if (supabaseEnabled) {
      await saveToSupabase('dispositions', newDisposition);
    }

    return newMail;
  };

  const addOutgoingMail = async (mailData) => {
    const mailNumber = generateOutgoingMailNumber(mailData.signatory, mailData.classificationCode);
    const newMail = {
      ...mailData,
      id: mailData.id || `out_${Date.now()}`,
      mailNumber: mailNumber,
      date: mailData.date || new Date().toISOString().split('T')[0],
      type: 'outgoing',
      uploaded: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedMails = [...outgoingMail, newMail];
    setOutgoingMail(updatedMails);
    localStorage.setItem('outgoingMail', JSON.stringify(updatedMails));
    
    if (supabaseEnabled) {
      await saveToSupabase('outgoing_mails', {
        recipient: mailData.recipient,
        subject: mailData.subject,
        date: mailData.date,
        google_drive_file_url: mailData.googleDriveFileUrl,
        signatory: mailData.signatory,
        classification_code: mailData.classificationCode,
        mail_number: mailNumber,
        content: mailData.content,
        uploaded: false,
        file_name: mailData.fileName
      });
    }
    
    return newMail;
  };
  
  const updateMail = async (mailId, updatedData, mailType) => {
    const list = mailType === 'incoming' ? incomingMail : outgoingMail;
    const setList = mailType === 'incoming' ? setIncomingMail : setOutgoingMail;
    const storageKey = mailType === 'incoming' ? 'incomingMail' : 'outgoingMail';
    const tableName = mailType === 'incoming' ? 'incoming_mails' : 'outgoing_mails';

    const updatedList = list.map(m => m.id === mailId ? { ...m, ...updatedData } : m);
    setList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
    
    if (supabaseEnabled && mailType === 'incoming') {
      await saveToSupabase(tableName, {
        ...updatedData,
        id: mailId
      });
    }
  };
  
  const updateDisposition = async (dispId, updatedData) => {
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
    
    if (supabaseEnabled) {
      await saveToSupabase('dispositions', {
        ...updatedData,
        id: dispId
      });
    }
  };

  const value = {
    incomingMail,
    outgoingMail,
    dispositions,
    mailTypes,
    loading,
    supabaseEnabled,
    addIncomingMail,
    addOutgoingMail,
    updateMail,
    updateDisposition,
    mailClassifications,
    loadFromSupabase
  };

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
};

export default MailProvider;