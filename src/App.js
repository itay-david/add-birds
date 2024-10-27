import React, { useState, useEffect } from 'react';
import { ref, set, remove, onValue } from 'firebase/database';
import database from './firebaseConfig';
import { 
  faLock, 
  faSignInAlt, 
  faQrcode, 
  faDove, 
  faHome, 
  faPhone, 
  faUser, 
  faPlus,
  faSearch,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';

function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [parrots, setParrots] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [newParrotData, setNewParrotData] = useState({
    code: '',
    name: '',
    address: '',
    phone: '',
    ownerName: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      const parrotsRef = ref(database, 'parrots');
      onValue(parrotsRef, (snapshot) => {
        const data = snapshot.val();
        setParrots(data || {});
      });
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === '7878') {
      setIsAuthenticated(true);
    } else {
      alert('סיסמה שגויה');
    }
  };

  const handleAddParrot = async () => {
    if (Object.values(newParrotData).some(value => value.trim() === '')) {
      alert('יש למלא את כל השדות');
      return;
    }

    const parrotRef = ref(database, `parrots/${newParrotData.code}`);
    try {
      await set(parrotRef, newParrotData);
      alert('תוכי נוסף בהצלחה');
      setNewParrotData({
        code: '',
        name: '',
        address: '',
        phone: '',
        ownerName: ''
      });
    } catch (error) {
      alert('שגיאה בהוספת תוכי: ' + error.message);
    }
  };

  const handleDeleteParrot = async (code) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התוכי?')) {
      const parrotRef = ref(database, `parrots/${code}`);
      try {
        await remove(parrotRef);
        alert('התוכי נמחק בהצלחה');
      } catch (error) {
        alert('שגיאה במחיקת התוכי: ' + error.message);
      }
    }
  };

  const filteredParrots = Object.entries(parrots).filter(([_, parrot]) => 
    parrot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parrot.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="page">
        <h1 className="title">כניסת מנהל</h1>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="icon" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הכנס סיסמה"
            className="input"
          />
        </div>
        <button onClick={handleLogin} className="button">
          <FontAwesomeIcon icon={faSignInAlt} className="icon" />
          <span>כניסה</span>
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="title">ניהול תוכים</h1>
      
      {/* Add New Parrot Section */}
      <div className="section">
        <h2 className="title">הוספת תוכי חדש</h2>
        {Object.keys(newParrotData).map((key) => (
          <div className="input-container" key={key}>
            <FontAwesomeIcon 
              icon={
                key === 'code' ? faQrcode : 
                key === 'name' ? faDove : 
                key === 'address' ? faHome : 
                key === 'phone' ? faPhone : faUser
              } 
              className="icon"
            />
            <input
              type="text"
              value={newParrotData[key]}
              onChange={(e) => setNewParrotData({...newParrotData, [key]: e.target.value})}
              placeholder={
                key === 'code' ? 'קוד תוכי' : 
                key === 'name' ? 'שם תוכי' : 
                key === 'address' ? 'כתובת' : 
                key === 'phone' ? 'טלפון' : 'שם הבעלים'
              }
              className="input"
            />
          </div>
        ))}
        <button onClick={handleAddParrot} className="button">
          <FontAwesomeIcon icon={faPlus} className="icon" />
          <span>הוסף תוכי</span>
        </button>
      </div>

      {/* Search and Existing Parrots List */}
      <div className="section">
        <h2 className="title">רשימת תוכים</h2>
        
        {/* Search Box */}
        <div className="search-container">
          <div className="input-container">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חפש לפי שם תוכי או שם בעלים"
              className="input"
            />
          </div>
        </div>

        {/* Parrots List */}
        <div className="parrots-list">
          {filteredParrots.length === 0 ? (
            <p className="no-results">לא נמצאו תוכים</p>
          ) : (
            filteredParrots.map(([code, parrot]) => (
              <div key={code} className="parrot-item">
                <div className="parrot-info">
                  <strong>קוד: {code}</strong>
                  <p>שם: {parrot.name}</p>
                  <p>בעלים: {parrot.ownerName}</p>
                  <p>טלפון: {parrot.phone}</p>
                  <p>כתובת: {parrot.address}</p>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteParrot(code)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>מחק</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;