import React, { useState, useEffect } from 'react';
import Util from '../common/util';
import DeleteInfoDialog from '../common/components/deleteinfoDialog';
import CreateLeadDialog from '../common/components/createLeadDialog';

const Dashboard = () => {
  const [userLists, setUserLists] = useState([]);
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const util = new Util();

  const formatPhoneNumber = (phoneNumber) => {
    const phoneNumberStr = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    const match = phoneNumberStr.match(/^(\d{3})(\d{3})(\d{4})$/); // Match the US phone number format

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber; 
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openLeadModal = (row) =>{
    setUser(row);
    setIsLeadDialogOpen(true)
  }
  const closeLeadDialog = () => setIsLeadDialogOpen(false);
  useEffect(() => {
    //getUsers
    fetch('https://staging.newfi.com/wp-json/newfi/v1/getUsers')
    .then(response => {
      if (!response.ok) {
                throw new Error('Network response was not ok');
            }
      return response.json();
    })
      .then(result => {
        const sortedUsers = result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUserLists(sortedUsers);
        setIsModalOpen(true);

      }).catch((error) => {
        console.error('There was an error!', error);
      })
    
  },[])

  return (
    <div>
      <div className="table-container">
        <table className="nf-table">
          <thead>
            <tr>
              <th className='name'>Name</th>
              <th className='phonenumber'>Phone Number</th>
              <th className='email'>Email</th>
              <th className='createdat'>Created At</th>
              <th className='location'>Location</th>
              <th className='url'>URL</th>
              <th className='otpstatus'>OTP Status</th>
              <th className='crm_id'>CRM ID</th>
              <th className='utmsource'>UTM Source</th>
              <th>UTM Medium</th>
              <th>UTM Campaign</th>
              <th>UTM Term</th>
              <th>Campaign Type</th>
              <th className='gadsource'>GAD Source</th>
              <th className='gclid'>Gclid</th>
              <th className='ipaddress'>IP Address</th>
              <th className='leadstatus'>Lead Status</th>
            </tr>
          </thead>
          <tbody>
            {userLists.map((row, index) => (
              <tr key={index}>
                <td>{row.first_name} {row.last_name}</td>
                <td>
                  <a className='noUnderline whiteS' href={`tel:${row.phone_number}`} target="_blank" rel="noopener noreferrer">
                    {formatPhoneNumber(row.phone_number)}
                  </a>
                </td>
                <td>
                  <a href={`mailto:${row.email_id}`} target="_blank" rel="noopener noreferrer"></a>
              <a href={`mailto:${row.email_id}`} target="_blank" rel="noopener noreferrer">
              {row.email_id}
                </a>
            </td>
            <td className='whiteS'>{util.formatDate(row.created_at)}</td>
            <td>
              { (row.city || row.state || row.country) ? 
                (row.city ? row.city + ', ' : '') + 
                (row.state ? row.state + ', ' : '') + 
                (row.country ? row.country : '') 
                : 'NA' }
            </td>
            <td>
              <a title={row.url} href={row.url} target="_blank" rel="noopener noreferrer">
                {row.url}
              </a>
            </td>
            <td className='whiteS'>{row.otp_status === '1' ? 'Verified' : 'Not Verified'}</td>
            <td className='whiteS'>{row.crm_id || 'N/A'}</td>
            <td>{row.utm_source || 'N/A'}</td>
            <td>{row.utm_medium || 'N/A'}</td>
            <td>{row.utm_campaign || 'N/A'}</td>
            <td>{row.utm_term || 'N/A'}</td>
            <td>{row.campaign_type || 'N/A'}</td>
            <td>{row.gad_source || 'N/A'}</td>
            <td title={row.gclid}><p>{row.gclid || 'N/A'}</p></td>
            <td className='whiteS'>{row.ip_address}</td>
            <td>
                  {row.crm_id ? (
                    <span>Lead Created</span>
                  ) : (
                    <button className='nf-btn nf-btn-lead round whiteS' onClick={() =>openLeadModal(row)}>
                      Create Lead
                    </button>
                  )}
                </td>
          </tr>
        ))}
      </tbody>
    </table>
    <DeleteInfoDialog isOpen={isModalOpen} onClose={closeModal} />
    <CreateLeadDialog userDetail={user} isOpen={isLeadDialogOpen} onClose={closeLeadDialog} />
  </div>
    <p className='deleteInfo'>*User details will be permanently deleted 15 days after the date of creation.</p>
  </div>
   
  
  );
};

export default Dashboard;
