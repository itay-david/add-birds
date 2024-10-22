import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import database from './firebaseConfig';

function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newParrotData, setNewParrotData] = useState({
    code: '',
    name: '',
    address: '',
    phone: '',
    ownerName: ''
  });

  const handleLogin = () => {
    if (password === '7878') {
      setIsAuthenticated(true);
    } else {
      alert('סיסמה שגויה');
    }
  };

  const handleAddParrot = async () => {
    // Check if any field is empty
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

  if (!isAuthenticated) {
    return (
      <div className="page">
        <h1>כניסת מנהל</h1>
        <div className="input-container">
          <i className="material-icons">lock</i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הכנס סיסמה"
          />
        </div>
        <button onClick={handleLogin}>
          <i className="material-icons">login</i>
          <span>כניסה</span>
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>הוספת תוכי חדש</h1>
      {Object.keys(newParrotData).map((key) => (
        <div className="input-container" key={key}>
          <i className="material-icons">
            {key === 'code' ? 'qr_code' : 
             key === 'name' ? 'pets' : 
             key === 'address' ? 'home' : 
             key === 'phone' ? 'phone' : 'person'}
          </i>
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
          />
        </div>
      ))}
      <button onClick={handleAddParrot}>
        <i className="material-icons">add</i>
        <span>הוסף תוכי</span>
      </button>
    </div>
  );
}

export default AdminPage;
